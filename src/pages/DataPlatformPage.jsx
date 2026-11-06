import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  BarChart3,
  Bot,
  Check,
  Cloud,
  Database,
  FolderKanban,
  GitBranch,
  GitMerge,
  Layers,
  Lock,
  Network,
  Receipt,
  RotateCcw,
  ShieldCheck,
  Users,
  Wrench,
  X,
  XCircle,
} from 'lucide-react'
import { useContent } from '../hooks/useContent'
import { getDataPlatformData } from '../services/contentService'
import EmptyState from '../components/EmptyState'
import DataFlowSimulator from '../components/DataFlowSimulator'

const ICON_MAP = {
  Receipt,
  Users,
  FolderKanban,
  Wrench,
  ShieldCheck,
  Network,
  Database,
  GitMerge,
  GitBranch,
  RotateCcw,
  Layers,
  Lock,
  Cloud,
  BarChart3,
  Bot,
}

export default function DataPlatformPage() {
  const { data, loading, error } = useContent(getDataPlatformData, [])

  const [activeTab, setActiveTab] = useState('dag')
  const [activeNodeId, setActiveNodeId] = useState(null)
  const [approvalMap, setApprovalMap] = useState({})

  const canvasRef = useRef(null)
  const nodeRefs = useRef({})
  const [edges, setEdges] = useState([])

  const layers = useMemo(() => data?.layers || [], [data])
  const nodes = useMemo(() => data?.nodes || [], [data])
  const edgeLabels = useMemo(() => data?.edgeLabels || {}, [data])

  const activeNode = useMemo(
    () => nodes.find((n) => n.id === activeNodeId) || null,
    [nodes, activeNodeId]
  )

  const { incomingIds, outgoingIds, relatedNodeIds } = useMemo(() => {
    if (!activeNode) {
      return { incomingIds: new Set(), outgoingIds: new Set(), relatedNodeIds: new Set() }
    }
    const outSet = new Set(activeNode.connections || [])
    const inSet = new Set(
      nodes.filter((n) => (n.connections || []).includes(activeNode.id)).map((n) => n.id)
    )
    const related = new Set([activeNode.id, ...inSet, ...outSet])
    return { incomingIds: inSet, outgoingIds: outSet, relatedNodeIds: related }
  }, [nodes, activeNode])

  const recomputeEdges = useCallback(() => {
    const container = canvasRef.current
    if (!container || nodes.length === 0 || activeTab !== 'dag') return

    const containerRect = container.getBoundingClientRect()
    const nextEdges = []

    for (const sourceNode of nodes) {
      const sourceEl = nodeRefs.current[sourceNode.id]
      if (!sourceEl) continue
      const sRect = sourceEl.getBoundingClientRect()

      const x1 = sRect.right - containerRect.left
      const y1 = sRect.top - containerRect.top + sRect.height / 2

      for (const targetId of sourceNode.connections || []) {
        const targetEl = nodeRefs.current[targetId]
        if (!targetEl) continue
        const tRect = targetEl.getBoundingClientRect()

        const x2 = tRect.left - containerRect.left
        const y2 = tRect.top - containerRect.top + tRect.height / 2

        const dx = Math.max(Math.abs(x2 - x1) * 0.45, 32)
        const path = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`

        const edgeKey = `${sourceNode.id}->${targetId}`
        nextEdges.push({
          id: edgeKey,
          sourceId: sourceNode.id,
          targetId,
          path,
          midX: (x1 + x2) / 2,
          midY: (y1 + y2) / 2,
          label: edgeLabels[edgeKey] || '',
        })
      }
    }

    setEdges(nextEdges)
  }, [nodes, activeTab, edgeLabels])

  useEffect(() => {
    const rafId = requestAnimationFrame(recomputeEdges)
    const container = canvasRef.current
    let observer
    if (container && typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(() => recomputeEdges())
      observer.observe(container)
    }
    window.addEventListener('resize', recomputeEdges)
    return () => {
      cancelAnimationFrame(rafId)
      observer?.disconnect()
      window.removeEventListener('resize', recomputeEdges)
    }
  }, [recomputeEdges, loading, activeTab])

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setActiveNodeId(null)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const handleToggleApproval = (nodeId, status) => {
    setApprovalMap((prev) => ({ ...prev, [nodeId]: status }))
  }

  if (loading) {
    return (
      <div className="bg-paper min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 animate-pulse space-y-8">
          <div className="h-9 w-96 bg-paper-sunken rounded" />
          <div className="h-36 bg-paper-sunken rounded" />
          <div className="h-[520px] bg-paper-sunken rounded" />
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="bg-paper min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <EmptyState
            title="Không thể tải sơ đồ kiến trúc"
            description="Vui lòng tải lại trang để khởi tạo lại luồng dữ liệu."
          />
        </div>
      </div>
    )
  }

  const activeApprovalStatus = activeNode
    ? approvalMap[activeNode.id] || 'approved'
    : 'approved'

  const presets = data.storyPresets || []

  return (
    <div className="min-h-screen bg-paper text-ink relative overflow-x-hidden">
      {/* 1. EDITORIAL HEADER */}
      <header className="border-b border-line bg-paper">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8 space-y-6">
          <div className="max-w-3xl space-y-3">
            <div className="text-xs text-muted">
              Nền tảng dữ liệu PTSC · Giai đoạn 1: 8 hệ nguồn, 20/310 báo cáo · Giai đoạn 2: Mở rộng đơn vị
            </div>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-ink tracking-tight leading-[1.1] font-medium">
              Kết nối phần mềm rời rạc thành một nguồn dữ liệu chuẩn.
            </h1>
            <p className="text-base text-body leading-relaxed max-w-2xl">
              Giữ nguyên các phần mềm đang chạy tại đơn vị. Nền tảng đứng ở giữa để thu gom, kiểm duyệt qua Landing Zone, hợp nhất 9 bộ mã dùng chung và tự động xuất báo cáo.
            </p>
          </div>

          {/* Clean Editorial Underline Tabs */}
          <div className="flex items-center gap-8 border-t border-line pt-4 text-sm">
            <button
              type="button"
              onClick={() => setActiveTab('dag')}
              className={`pb-1 border-b-2 transition-colors duration-200 cursor-pointer ${
                activeTab === 'dag'
                  ? 'border-ink text-ink font-medium'
                  : 'border-transparent text-muted hover:text-ink'
              }`}
            >
              1. Bản chất & Sơ đồ kết nối
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveNodeId(null)
                setActiveTab('zones')
              }}
              className={`pb-1 border-b-2 transition-colors duration-200 cursor-pointer ${
                activeTab === 'zones'
                  ? 'border-ink text-ink font-medium'
                  : 'border-transparent text-muted hover:text-ink'
              }`}
            >
              2. Kiến trúc 10 vùng an ninh
            </button>
          </div>
        </div>
      </header>

      {activeTab === 'dag' && (
        <>
          {/* 2. INTERACTIVE 3-STATION RECORD SIMULATOR (INPUT -> CORE -> OUTPUT) */}
          <DataFlowSimulator
            scenarios={data.simulatorScenarios || []}
            onSyncDiagram={(nodeId, approvalStatus) => {
              setActiveNodeId(nodeId)
              if (approvalStatus) {
                setApprovalMap((prev) => ({
                  ...prev,
                  'ing-landing': approvalStatus,
                }))
              }
            }}
          />

          {/* 3. INTERACTIVE TOPOLOGY / DAG CANVAS */}
          <section className="py-12 bg-paper">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
              {/* Editorial Filter Bar (Plain text links separated by middle dot) */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-line text-xs">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <span className="text-muted">Điểm trọng tâm:</span>
                  {presets.map((preset, idx) => {
                    const isActive = activeNodeId === preset.nodeId
                    return (
                      <span key={preset.id} className="inline-flex items-center gap-3">
                        {idx > 0 && <span className="text-line">·</span>}
                        <button
                          type="button"
                          onClick={() =>
                            setActiveNodeId((prev) =>
                              prev === preset.nodeId ? null : preset.nodeId
                            )
                          }
                          className={`cursor-pointer transition-colors duration-200 underline underline-offset-4 ${
                            isActive
                              ? 'text-accent decoration-accent font-medium'
                              : 'text-body decoration-transparent hover:text-accent hover:decoration-accent'
                          }`}
                        >
                          {preset.label}
                        </button>
                      </span>
                    )
                  })}
                </div>

                <div className="flex items-center gap-4 text-muted">
                  <span>Bấm vào thành phần bất kỳ để xem luồng nối và thông số</span>
                  {activeNodeId && (
                    <>
                      <span>·</span>
                      <button
                        type="button"
                        onClick={() => setActiveNodeId(null)}
                        className="text-ink hover:text-accent underline underline-offset-4 cursor-pointer"
                      >
                        Bỏ chọn
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* MAIN CANVAS (SINGLE LAYER SURFACE, DIVIDED BY LINES & WHITESPACE) */}
              <div
                ref={canvasRef}
                onClick={() => setActiveNodeId(null)}
                className="relative bg-paper-sunken/45 border border-line rounded-md p-6 sm:p-8 select-none"
              >
                {/* Structural Scope Indicator (Simple Top Rule, No Colored Boxes) */}
                <div
                  className="hidden lg:grid lg:grid-cols-4 gap-8 pb-6 mb-6 border-b border-line"
                  style={{ zIndex: 2, position: 'relative' }}
                >
                  <div className="border-t border-line pt-2.5">
                    <div className="text-xs font-mono text-muted">01 · Đầu vào (Input)</div>
                    <div className="text-sm font-medium text-ink mt-0.5">
                      Phần mềm hiện hữu của đơn vị
                    </div>
                  </div>

                  <div className="col-span-2 border-t-2 border-ink pt-2.5">
                    <div className="text-xs font-mono text-accent">
                      02 · Bên trong ruột Data Platform (Vùng 5 & Cụm Hub Tầng 10 CQTCT)
                    </div>
                    <div className="text-sm font-medium text-ink mt-0.5">
                      Thu thập qua 4 kênh Vùng 5 → Duyệt tại Landing Zone → Lưu trữ gốc & Chuẩn hóa mã MDM
                    </div>
                  </div>

                  <div className="border-t border-line pt-2.5">
                    <div className="text-xs font-mono text-muted">
                      03 · Hub Phần B & Đầu ra (Output)
                    </div>
                    <div className="text-sm font-medium text-ink mt-0.5">
                      Cloud nhận bản sạch & Trả về 2 nhánh
                    </div>
                  </div>
                </div>

                {/* SVG CONNECTOR LINES */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none hidden lg:block"
                  style={{ zIndex: 1 }}
                >
                  {edges.map((edge) => {
                    const isConnectedToActive =
                      activeNodeId &&
                      (edge.sourceId === activeNodeId || edge.targetId === activeNodeId)

                    const isSourceRejected = approvalMap[edge.sourceId] === 'rejected'
                    const isDimmed = activeNodeId && !isConnectedToActive

                    return (
                      <g key={edge.id}>
                        <path
                          d={edge.path}
                          fill="none"
                          stroke={
                            isSourceRejected
                              ? '#b91c1c'
                              : isConnectedToActive
                              ? '#1C1B19'
                              : '#DED9CE'
                          }
                          strokeWidth={isConnectedToActive ? 1.75 : 1.15}
                          strokeOpacity={isDimmed ? 0.25 : 1}
                          className="transition-all duration-200"
                        />

                        {isConnectedToActive && !isSourceRejected && (
                          <path
                            d={edge.path}
                            fill="none"
                            stroke="#C2410C"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            className="animate-dag-flow"
                          />
                        )}
                      </g>
                    )
                  })}
                </svg>

                {/* FLOATING EDGE ACTION TEXT WHEN NODE IS SELECTED */}
                <div
                  className="absolute inset-0 pointer-events-none hidden lg:block"
                  style={{ zIndex: 3 }}
                >
                  {activeNodeId &&
                    edges
                      .filter(
                        (edge) =>
                          (edge.sourceId === activeNodeId || edge.targetId === activeNodeId) &&
                          edge.label
                      )
                      .map((edge) => {
                        const isRejected = approvalMap[edge.sourceId] === 'rejected'
                        return (
                          <div
                            key={`label-${edge.id}`}
                            style={{
                              left: `${edge.midX}px`,
                              top: `${edge.midY}px`,
                              transform: 'translate(-50%, -50%)',
                            }}
                            className={`absolute px-2 py-0.5 rounded bg-paper border text-[10px] font-mono whitespace-nowrap ${
                              isRejected
                                ? 'border-red-300 text-red-700'
                                : 'border-line text-ink'
                            }`}
                          >
                            {isRejected ? 'Giữ tại Quarantine' : edge.label}
                          </div>
                        )
                      })}
                </div>

                {/* 4 COLUMNS OF CLEAN EDITORIAL NODES (NO BOX IN BOX) */}
                <div
                  className="relative grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-10 items-stretch"
                  style={{ zIndex: 2 }}
                >
                  {layers.map((layer) => {
                    const layerNodes = nodes.filter((n) => n.layerId === layer.id)

                    return (
                      <div key={layer.id} className="flex flex-col">
                        {/* Column Header */}
                        <div className="pb-3 mb-4 border-b border-line">
                          <h3 className="font-display text-base text-ink font-medium">
                            {layer.name}
                          </h3>
                          <p className="text-xs text-muted mt-0.5 leading-snug">{layer.sub}</p>
                        </div>

                        {/* Node Cards (Single-layer card, max 3 text elements, zero nested boxes) */}
                        <div className="flex-1 flex flex-col justify-around gap-3.5">
                          {layerNodes.map((node) => {
                            const IconComponent = ICON_MAP[node.icon] || Database
                            const isSelected = activeNodeId === node.id
                            const isRelated = relatedNodeIds.has(node.id)
                            const isDimmed = activeNodeId && !isRelated
                            const nodeApproval = approvalMap[node.id] || 'approved'

                            return (
                              <div
                                key={node.id}
                                ref={(el) => {
                                  nodeRefs.current[node.id] = el
                                }}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setActiveNodeId(node.id)
                                }}
                                className={`group relative rounded-md border bg-paper p-3.5 transition-colors duration-200 cursor-pointer ${
                                  isSelected
                                    ? 'border-accent ring-1 ring-accent'
                                    : isRelated && activeNodeId
                                    ? 'border-ink'
                                    : 'border-line hover:border-ink/60'
                                } ${isDimmed ? 'opacity-30' : 'opacity-100'}`}
                              >
                                {/* Left Port Dot */}
                                {layer.id !== 'sources' && (
                                  <span
                                    className={`hidden lg:block absolute -left-1.5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full border border-paper ${
                                      isSelected ||
                                      incomingIds.has(node.id) ||
                                      outgoingIds.has(node.id)
                                        ? 'bg-accent'
                                        : 'bg-line'
                                    }`}
                                  />
                                )}

                                {/* Right Port Dot */}
                                {(node.connections || []).length > 0 && (
                                  <span
                                    className={`hidden lg:block absolute -right-1.5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full border border-paper ${
                                      nodeApproval === 'rejected'
                                        ? 'bg-red-600'
                                        : isSelected || incomingIds.has(node.id)
                                        ? 'bg-accent'
                                        : 'bg-line'
                                    }`}
                                  />
                                )}

                                {/* 3 Elements: Plain Role Meta · Node Title · Plain Mono Tech */}
                                <div className="space-y-1">
                                  <div className="flex items-center justify-between gap-2 text-[11px] text-muted">
                                    <span className="truncate">{node.roleTag}</span>
                                    <IconComponent className="w-3.5 h-3.5 text-muted shrink-0" />
                                  </div>

                                  <h4 className="text-xs font-semibold text-ink leading-snug underline decoration-transparent underline-offset-4 decoration-1 group-hover:decoration-accent transition-[text-decoration-color] duration-200">
                                    {node.name}
                                  </h4>

                                  <div className="text-[11px] font-mono text-muted truncate pt-0.5">
                                    {nodeApproval === 'rejected'
                                      ? 'Quarantine · Chờ sửa ở nguồn'
                                      : node.techBadge}
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* =====================================================================
          TAB 2: 10 SECURITY ZONES (EDITORIAL LAYOUT, NO COLORED CARDS)
         ===================================================================== */}
      {activeTab === 'zones' && (
        <section className="py-12 bg-paper">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-6">
            <div className="lg:col-span-3 space-y-2">
              <h2 className="font-display text-2xl text-ink tracking-tight font-medium">
                10 vùng an ninh mạng
              </h2>
              <p className="text-sm text-muted leading-relaxed">
                Phân tách luồng tích hợp (Vùng 5) và cụm máy chủ Lakehouse (Vùng 4) theo chuẩn bảo mật nội bộ.
              </p>
            </div>

            <div className="lg:col-span-9 divide-y divide-line border-t border-b border-line">
              {(data.securityZones || []).map((z) => (
                <div
                  key={z.zone}
                  className="py-4 grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-baseline"
                >
                  <div className="sm:col-span-2 text-xs font-mono text-muted">
                    {z.zone}
                    {z.isHighlight ? ' · Trọng tâm' : ''}
                  </div>
                  <div className="sm:col-span-3 text-sm font-medium text-ink">{z.name}</div>
                  <div className="sm:col-span-7 text-sm text-body leading-relaxed">{z.role}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =====================================================================
          SLIDE-OVER DRAWER (EDITORIAL PAPER & INK, NO NESTED BOXES)
         ===================================================================== */}
      {activeNode && (
        <div
          onClick={() => setActiveNodeId(null)}
          className="fixed inset-0 bg-ink/10 z-40 lg:hidden transition-opacity"
        />
      )}

      <aside
        aria-hidden={!activeNode}
        className={`fixed top-16 right-0 bottom-0 z-50 w-full max-w-md bg-paper border-l border-line flex flex-col justify-between transition-transform duration-300 ease-out ${
          activeNode ? 'translate-x-0' : 'translate-x-full pointer-events-none'
        }`}
      >
        {activeNode && (
          <>
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* 1. Header */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-line">
                <div className="space-y-1">
                  <div className="text-xs text-muted">
                    {activeNode.statusBadge} ·{' '}
                    <span
                      className={
                        activeApprovalStatus === 'approved' ? 'text-emerald-700' : 'text-red-700'
                      }
                    >
                      {activeApprovalStatus === 'approved'
                        ? 'Luồng hợp lệ (Approved)'
                        : 'Đang giữ tại Quarantine'}
                    </span>
                  </div>
                  <h2 className="font-display text-2xl text-ink font-medium leading-snug">
                    {activeNode.name}
                  </h2>
                  <div className="text-xs font-mono text-muted">{activeNode.techBadge}</div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveNodeId(null)}
                  className="p-1.5 text-muted hover:text-ink transition-colors duration-200 cursor-pointer"
                  title="Đóng (Esc)"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* 2. Vai trò & Quy chuẩn */}
              <div className="space-y-3">
                <h3 className="text-xs text-muted">Vai trò trong kiến trúc</h3>
                <ul className="space-y-2.5 text-sm text-body leading-relaxed">
                  {activeNode.bullets.map((b, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="text-muted select-none">—</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 3. Thông số kỹ thuật (Divided by horizontal lines, no box) */}
              <div className="space-y-2">
                <h3 className="text-xs text-muted">Thông số đối chiếu</h3>
                <div className="divide-y divide-line border-t border-b border-line text-xs">
                  {Object.entries(activeNode.specs || {}).map(([key, val]) => (
                    <div key={key} className="py-2.5 grid grid-cols-12 gap-2 items-baseline">
                      <span className="col-span-5 text-muted">{key}</span>
                      <span className="col-span-7 font-mono text-ink text-right">{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Luồng kết nối trực tiếp (Plain underline links) */}
              <div className="space-y-2 pt-2">
                <h3 className="text-xs text-muted">
                  Luồng nối trực tiếp ({incomingIds.size} vào · {outgoingIds.size} ra)
                </h3>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs">
                  {[...incomingIds].map((id) => {
                    const n = nodes.find((item) => item.id === id)
                    if (!n) return null
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setActiveNodeId(id)}
                        className="text-body hover:text-accent underline underline-offset-4 cursor-pointer"
                      >
                        ← {n.name}
                      </button>
                    )
                  })}
                  {[...outgoingIds].map((id) => {
                    const n = nodes.find((item) => item.id === id)
                    if (!n) return null
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setActiveNodeId(id)}
                        className="text-ink hover:text-accent underline underline-offset-4 cursor-pointer font-medium"
                      >
                        {n.name} →
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Footer: Mô phỏng quyền Approve / Reject */}
            <div className="p-5 border-t border-line bg-paper-sunken/60 space-y-2.5">
              <div className="flex items-center justify-between text-xs text-muted">
                <span>Mô phỏng chốt chặn tại Landing Zone</span>
                <span className="font-mono">
                  {activeApprovalStatus === 'approved' ? 'Approved' : 'Rejected'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleToggleApproval(activeNode.id, 'approved')}
                  className={`py-2 px-3 rounded-md text-xs font-medium inline-flex items-center justify-center gap-1.5 transition-colors duration-200 cursor-pointer ${
                    activeApprovalStatus === 'approved'
                      ? 'bg-ink hover:bg-accent text-white'
                      : 'bg-paper border border-line text-body hover:text-ink'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Approve (Cho đi tiếp)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleToggleApproval(activeNode.id, 'rejected')}
                  className={`py-2 px-3 rounded-md text-xs font-medium inline-flex items-center justify-center gap-1.5 border transition-colors duration-200 cursor-pointer ${
                    activeApprovalStatus === 'rejected'
                      ? 'bg-red-50 border-red-300 text-red-700'
                      : 'bg-paper border-line text-body hover:text-red-700'
                  }`}
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Reject (Quarantine)</span>
                </button>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}
