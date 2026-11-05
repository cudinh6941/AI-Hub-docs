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
  HelpCircle,
  Layers,
  Lock,
  Network,
  Receipt,
  RotateCcw,
  Shield,
  ShieldCheck,
  Users,
  Wrench,
  X,
  XCircle,
} from 'lucide-react'
import { useContent } from '../hooks/useContent'
import { getDataPlatformData } from '../services/contentService'
import EmptyState from '../components/EmptyState'

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
  Layers,
  Lock,
  Cloud,
  BarChart3,
  Bot,
}

export default function DataPlatformPage() {
  const { data, loading, error } = useContent(getDataPlatformData, [])

  // Active view tab: 'dag' (Interactive DAG Canvas) | 'zones' (10 Security Zones) | 'qng' (PTSC Quảng Ngãi GĐ2A & 3-tier Mapping)
  const [activeTab, setActiveTab] = useState('dag')

  // Selected node ID on the DAG canvas
  const [activeNodeId, setActiveNodeId] = useState(null)

  // Per-node simulated approval state ('approved' | 'rejected')
  const [approvalMap, setApprovalMap] = useState({})

  // Refs for calculating exact SVG Bezier curve coordinates between node ports
  const canvasRef = useRef(null)
  const nodeRefs = useRef({})
  const [edges, setEdges] = useState([])

  const layers = useMemo(() => data?.layers || [], [data])
  const nodes = useMemo(() => data?.nodes || [], [data])

  const activeNode = useMemo(
    () => nodes.find((n) => n.id === activeNodeId) || null,
    [nodes, activeNodeId]
  )

  // Determine incoming & outgoing neighbors of activeNode
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

  // Compute exact SVG cubic Bezier curves between connected DOM nodes
  const recomputeEdges = useCallback(() => {
    const container = canvasRef.current
    if (!container || nodes.length === 0 || activeTab !== 'dag') return

    const containerRect = container.getBoundingClientRect()
    const nextEdges = []

    for (const sourceNode of nodes) {
      const sourceEl = nodeRefs.current[sourceNode.id]
      if (!sourceEl) continue
      const sRect = sourceEl.getBoundingClientRect()

      // Right-center port of source node
      const x1 = sRect.right - containerRect.left
      const y1 = sRect.top - containerRect.top + sRect.height / 2

      for (const targetId of sourceNode.connections || []) {
        const targetEl = nodeRefs.current[targetId]
        if (!targetEl) continue
        const tRect = targetEl.getBoundingClientRect()

        // Left-center port of target node
        const x2 = tRect.left - containerRect.left
        const y2 = tRect.top - containerRect.top + tRect.height / 2

        const dx = Math.max(Math.abs(x2 - x1) * 0.46, 32)
        const path = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`

        nextEdges.push({
          id: `${sourceNode.id}->${targetId}`,
          sourceId: sourceNode.id,
          targetId,
          path,
        })
      }
    }

    setEdges(nextEdges)
  }, [nodes, activeTab])

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

  // Close drawer with Escape key
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
      <div className="max-w-7xl mx-auto px-6 py-10 animate-pulse space-y-6">
        <div className="h-7 w-72 bg-zinc-200/70 rounded" />
        <div className="h-[540px] bg-zinc-100 rounded-xl border border-zinc-200" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <EmptyState
          title="Không thể tải sơ đồ kiến trúc"
          description="Vui lòng tải lại trang để khởi tạo lại luồng dữ liệu."
        />
      </div>
    )
  }

  const activeApprovalStatus = activeNode
    ? approvalMap[activeNode.id] || 'approved'
    : 'approved'

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-zinc-50/70 text-slate-900 relative overflow-x-hidden">
      {/* TOP BAR: HEADER & VIEW SWITCHER */}
      <div className="border-b border-zinc-200/90 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
              <span>Nền tảng Dữ liệu PTSC</span>
              <span>·</span>
              <span>GĐ1: Cơ quan Tổng công ty (8 hệ nguồn, 20 báo cáo)</span>
              <span>·</span>
              <span>GĐ2: Mở rộng Đơn vị thành viên</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight mt-0.5">
              {data.title}
            </h1>
          </div>

          {/* 3 Clean View Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('dag')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'dag'
                  ? 'bg-slate-900 text-white'
                  : 'bg-zinc-100 text-slate-700 hover:bg-zinc-200/80'
              }`}
            >
              <Network className="w-3.5 h-3.5" />
              <span>1. Sơ đồ Luồng DAG (Vùng 5 & Hub)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveNodeId(null)
                setActiveTab('zones')
              }}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'zones'
                  ? 'bg-slate-900 text-white'
                  : 'bg-zinc-100 text-slate-700 hover:bg-zinc-200/80'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>2. Kiến trúc 10 Vùng An Ninh</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveNodeId(null)
                setActiveTab('qng')
              }}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'qng'
                  ? 'bg-slate-900 text-white'
                  : 'bg-zinc-100 text-slate-700 hover:bg-zinc-200/80'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>3. PTSC Quảng Ngãi (L3–L4 & Bảng Ánh xạ 3 Tầng)</span>
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================================
          TAB 1: MAIN HORIZONTAL DAG FLOW CANVAS
         ===================================================================== */}
      {activeTab === 'dag' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
          {/* Sub-bar legend */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-600 px-1">
            <span>
              Bấm vào bất kỳ node nào để xem luồng kết nối trực tiếp, thông số kỹ thuật và thử nghiệm quyền{' '}
              <strong className="text-slate-900">Approve / Reject</strong> tại Landing Zone.
            </span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-5 h-0.5 bg-emerald-600 inline-block rounded" />
                <span>Luồng đang hoạt động</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-5 h-0.5 bg-rose-500 inline-block rounded" />
                <span>Quarantine (Khi Reject)</span>
              </div>
              {activeNodeId && (
                <button
                  type="button"
                  onClick={() => setActiveNodeId(null)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-zinc-300 bg-white hover:bg-zinc-50 text-xs font-medium text-slate-800 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Bỏ chọn node</span>
                </button>
              )}
            </div>
          </div>

          <div
            ref={canvasRef}
            onClick={() => setActiveNodeId(null)}
            className="relative rounded-xl border border-zinc-200/90 bg-white p-6 sm:p-8 shadow-2xs select-none"
          >
            {/* SVG CURVED CONNECTOR LAYER */}
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
                          ? '#f43f5e'
                          : isConnectedToActive
                          ? '#0f172a'
                          : '#e4e4e7'
                      }
                      strokeWidth={isConnectedToActive ? 2 : 1.25}
                      strokeOpacity={isDimmed ? 0.25 : 1}
                      className="transition-all duration-200"
                    />

                    {isConnectedToActive && !isSourceRejected && (
                      <path
                        d={edge.path}
                        fill="none"
                        stroke="#10b981"
                        strokeWidth={2.25}
                        strokeDasharray="6 6"
                        className="animate-dag-flow"
                      />
                    )}
                  </g>
                )
              })}
            </svg>

            {/* 4 HORIZONTAL COLUMNS */}
            <div
              className="relative grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-11 items-stretch"
              style={{ zIndex: 2 }}
            >
              {layers.map((layer) => {
                const layerNodes = nodes.filter((n) => n.layerId === layer.id)
                return (
                  <div key={layer.id} className="flex flex-col">
                    {/* Column Header */}
                    <div className="pb-3 mb-5 border-b border-zinc-200/80 flex items-baseline justify-between">
                      <div>
                        <div className="text-[11px] font-mono font-semibold text-zinc-400 uppercase tracking-wider">
                          {layer.code}
                        </div>
                        <h2 className="text-sm font-semibold text-slate-900 mt-0.5">
                          {layer.name}
                        </h2>
                        <p className="text-[11px] text-zinc-500 mt-0.5">{layer.sub}</p>
                      </div>
                      <span className="text-[11px] font-mono text-zinc-400">
                        {layerNodes.length}
                      </span>
                    </div>

                    {/* Nodes Column Stack */}
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
                            className={`group relative rounded-lg border bg-white p-3.5 transition-all duration-200 cursor-pointer ${
                              isSelected
                                ? 'border-slate-900 ring-2 ring-slate-900/90 shadow-sm'
                                : isRelated && activeNodeId
                                ? 'border-slate-400 bg-zinc-50/60'
                                : 'border-zinc-200/90 hover:border-slate-400'
                            } ${isDimmed ? 'opacity-35' : 'opacity-100'}`}
                          >
                            {/* Left Input Port Dot */}
                            {layer.id !== 'sources' && (
                              <span
                                className={`hidden lg:block absolute -left-1.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border-2 border-white transition-colors ${
                                  isSelected || incomingIds.has(node.id) || outgoingIds.has(node.id)
                                    ? 'bg-slate-900'
                                    : 'bg-zinc-300 group-hover:bg-slate-500'
                                }`}
                              />
                            )}

                            {/* Right Output Port Dot */}
                            {(node.connections || []).length > 0 && (
                              <span
                                className={`hidden lg:block absolute -right-1.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border-2 border-white transition-colors ${
                                  nodeApproval === 'rejected'
                                    ? 'bg-rose-500'
                                    : isSelected || incomingIds.has(node.id)
                                    ? 'bg-emerald-600'
                                    : 'bg-zinc-300 group-hover:bg-slate-500'
                                }`}
                              />
                            )}

                            {/* ONLY 3 CLEAN ELEMENTS: ICON + TITLE + MONO TECH BADGE */}
                            <div className="flex items-start gap-3">
                              <div
                                className={`w-8 h-8 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                                  isSelected
                                    ? 'bg-slate-900 text-white border-slate-900'
                                    : 'bg-zinc-50 text-slate-700 border-zinc-200/80 group-hover:border-zinc-300'
                                }`}
                              >
                                <IconComponent className="w-4 h-4" />
                              </div>

                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-1.5">
                                  <h3 className="text-xs font-semibold text-slate-900 leading-snug truncate">
                                    {node.name}
                                  </h3>
                                  {nodeApproval === 'rejected' && (
                                    <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                                  )}
                                </div>
                                <div className="mt-1 inline-block font-mono text-[11px] text-zinc-500 bg-zinc-100/80 px-1.5 py-0.5 rounded border border-zinc-200/60 truncate max-w-full">
                                  {node.techBadge}
                                </div>
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
      )}

      {/* =====================================================================
          TAB 2: 10 SECURITY ZONES ARCHITECTURE (SLIDE PHIÊN SÁNG, TRANG 25)
         ===================================================================== */}
      {activeTab === 'zones' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div className="bg-white border border-zinc-200/90 rounded-xl p-6 space-y-5">
            <div className="border-b border-zinc-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="text-xs font-mono text-zinc-500 uppercase">
                  NGUỒN: SLIDE HỘI THẢO DATA PLATFORM PHIÊN SÁNG (08/2026) — TRANG 25
                </div>
                <h2 className="text-lg font-semibold text-slate-900 mt-0.5">
                  Kiến Trúc 10 Vùng An Ninh (10 Security Zones)
                </h2>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded bg-zinc-100 text-zinc-700 border border-zinc-200">
                Bắt buộc trong thiết kế trình lãnh đạo
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
              {(data.securityZones || []).map((z) => (
                <div
                  key={z.zone}
                  className={`p-4 rounded-lg border transition-colors ${
                    z.isHighlight
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-zinc-50/60 text-slate-900 border-zinc-200/90'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-mono font-semibold ${
                        z.isHighlight ? 'text-emerald-400' : 'text-zinc-500'
                      }`}
                    >
                      {z.zone}
                    </span>
                    {z.isHighlight && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/15 text-white">
                        Trọng tâm
                      </span>
                    )}
                  </div>
                  <div className="text-sm font-semibold mt-1">{z.name}</div>
                  <p
                    className={`text-xs mt-1.5 leading-relaxed ${
                      z.isHighlight ? 'text-zinc-300' : 'text-zinc-600'
                    }`}
                  >
                    {z.role}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 3: PTSC QUẢNG NGÃI (L3–L4 · BẢNG ÁNH XẠ 3 TẦNG · VIỆC CẦN LÀM)
         ===================================================================== */}
      {activeTab === 'qng' && data.quangNgaiContext && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          {/* Row 1: Positioning L3-L4 + 4 Graduation Criteria + Cost Principles */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-white border border-zinc-200/90 rounded-xl p-6 space-y-4">
              <div className="text-xs font-mono text-zinc-500 uppercase">
                SLIDE HỘI THẢO PHIÊN CHIỀU — TRANG 51, 56, 58
              </div>
              <h2 className="text-lg font-semibold text-slate-900">
                {data.quangNgaiContext.positioningTitle}
              </h2>
              <p className="text-xs text-slate-700 leading-relaxed">
                {data.quangNgaiContext.positioningSummary}
              </p>

              <div className="pt-2 border-t border-zinc-200 space-y-2">
                <div className="text-xs font-mono font-semibold text-slate-900 uppercase">
                  4 Tiêu chí xét tốt nghiệp từ L3 lên L4 (Spoke riêng):
                </div>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {data.quangNgaiContext.graduationCriteria.map((item, idx) => (
                    <li key={idx} className="bg-zinc-50 border border-zinc-200/80 px-3 py-2 rounded">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="lg:col-span-5 bg-white border border-zinc-200/90 rounded-xl p-6 space-y-4">
              <div className="text-xs font-mono text-zinc-500 uppercase">
                NGUYÊN TẮC PHÂN ĐỊNH CHI PHÍ (KHÔNG CÓ SỐ TIỀN CỐ ĐỊNH TRƯỚC KHẢO SÁT)
              </div>
              <h3 className="text-lg font-semibold text-slate-900">
                3 Nhóm Chi Phí Theo Phương Án 3
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-700 leading-relaxed">
                {data.quangNgaiContext.costRules.map((rule, idx) => (
                  <li key={idx} className="p-3 rounded-lg bg-zinc-50 border border-zinc-200/80">
                    {rule}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Row 2: 3-Tier MDM Code Mapping Table (Columns 2 & 3 MUST remain blank) */}
          <div className="bg-white border border-zinc-200/90 rounded-xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-200 pb-4">
              <div>
                <div className="text-xs font-mono text-zinc-500 uppercase">
                  QUY TẮC BẢNG ÁNH XẠ MÃ 3 TẦNG (9 DOMAIN DỮ LIỆU CHỦ MDM)
                </div>
                <h3 className="text-base font-semibold text-slate-900 mt-0.5">
                  Mã Đơn Vị → Mã Chuẩn PTSC (Để trống) → Mã Chung PVN (Để trống)
                </h3>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded bg-amber-50 text-amber-800 border border-amber-200">
                Đơn vị tuyệt đối không tự đặt mã chuẩn TCT / PVN
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-50 font-mono text-[11px] text-zinc-600">
                    <th className="py-2.5 px-3">Domain Dữ liệu chủ (MDM)</th>
                    <th className="py-2.5 px-3">Tầng 1: Mã đang dùng tại PTSC Quảng Ngãi</th>
                    <th className="py-2.5 px-3">Tầng 2: Mã chuẩn PTSC</th>
                    <th className="py-2.5 px-3">Tầng 3: Mã chung PVN</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {data.quangNgaiContext.mdmMappingSample.map((row) => (
                    <tr key={row.domain} className="hover:bg-zinc-50/70">
                      <td className="py-2.5 px-3 font-semibold text-slate-900">{row.domain}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-700">{row.unitCode}</td>
                      <td className="py-2.5 px-3 font-mono text-zinc-400 italic bg-zinc-50/50">
                        {row.ptscStandardCode}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-zinc-400 italic bg-zinc-50/50">
                        {row.pvnCode}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Row 3: 5 Actions Now + 3 Open Questions for Taskforce / Survey Team */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-white border border-zinc-200/90 rounded-xl p-6 space-y-3">
              <div className="text-xs font-mono text-zinc-500 uppercase">
                HÀNH ĐỘNG CHUẨN BỊ TẠI ĐƠN VỊ
              </div>
              <h3 className="text-base font-semibold text-slate-900">
                5 Việc Cần Làm Ngay (Và Nguyên Tắc Không Làm)
              </h3>
              <ul className="space-y-2 text-xs text-slate-700 leading-relaxed">
                {data.quangNgaiContext.actionsNow.map((act, idx) => (
                  <li
                    key={idx}
                    className={`p-3 rounded-lg border ${
                      idx === 4
                        ? 'bg-rose-50/60 border-rose-200 text-rose-900 font-medium'
                        : 'bg-zinc-50/70 border-zinc-200/80'
                    }`}
                  >
                    {act}
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-5 bg-white border border-zinc-200/90 rounded-xl p-6 space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-500 uppercase">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>CÂU HỎI MỞ CẦN GỬI TASKFORCE / ĐOÀN KHẢO SÁT TCT</span>
              </div>
              <h3 className="text-base font-semibold text-slate-900">
                3 Điểm Chưa Quy Định Trong Tài Liệu (Không Tự Bịa)
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-700 leading-relaxed">
                {data.quangNgaiContext.openQuestionsForSurveyTeam.map((q, idx) => (
                  <li key={idx} className="p-3 rounded-lg bg-zinc-50 border border-zinc-200/80">
                    {q}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          RIGHT SLIDE-OVER SHEET / DRAWER (DETAIL INSPECTOR)
         ===================================================================== */}
      {activeNode && (
        <div
          onClick={() => setActiveNodeId(null)}
          className="fixed inset-0 bg-slate-900/10 z-40 lg:hidden transition-opacity"
        />
      )}

      <aside
        aria-hidden={!activeNode}
        className={`fixed top-16 right-0 bottom-0 z-50 w-full max-w-md bg-white border-l border-zinc-200 shadow-xl flex flex-col justify-between transition-transform duration-300 ease-out ${
          activeNode ? 'translate-x-0' : 'translate-x-full pointer-events-none'
        }`}
      >
        {activeNode && (
          <>
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* 1. HEADER */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-zinc-200">
                <div className="flex items-start gap-3">
                  {(() => {
                    const HeaderIcon = ICON_MAP[activeNode.icon] || Database
                    return (
                      <div className="w-10 h-10 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center text-slate-900 shrink-0">
                        <HeaderIcon className="w-5 h-5" />
                      </div>
                    )
                  })()}
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 border border-zinc-200 font-medium">
                        {activeNode.statusBadge}
                      </span>
                      <span
                        className={`text-[11px] font-mono px-2 py-0.5 rounded font-medium ${
                          activeApprovalStatus === 'approved'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {activeApprovalStatus === 'approved'
                          ? 'Flow: Approved'
                          : 'Quarantine (Rejected)'}
                      </span>
                    </div>
                    <h2 className="text-lg font-semibold text-slate-900 mt-1.5 leading-snug">
                      {activeNode.name}
                    </h2>
                    <div className="text-xs font-mono text-zinc-500 mt-0.5">
                      {activeNode.techBadge}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveNodeId(null)}
                  className="p-1.5 rounded-md text-zinc-400 hover:text-slate-900 hover:bg-zinc-100 transition-colors cursor-pointer"
                  title="Đóng (Esc)"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* 2. NGHIỆP VỤ CỐT LÕI & GIÁ TRỊ */}
              <div className="space-y-2.5">
                <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-500 font-semibold">
                  Nghiệp vụ cốt lõi & Quy chuẩn từ tài liệu gốc
                </h3>
                <ul className="space-y-2 text-xs text-slate-700 leading-relaxed">
                  {activeNode.bullets.map((b, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-900 mt-1.5 shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 3. THÔNG SỐ KỸ THUẬT (Tech Specs) */}
              <div className="space-y-2.5">
                <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-500 font-semibold">
                  Thông số kỹ thuật & Nguồn đối chiếu
                </h3>
                <div className="rounded-lg border border-zinc-200 divide-y divide-zinc-200 bg-zinc-50/50 text-xs">
                  {Object.entries(activeNode.specs || {}).map(([key, val]) => (
                    <div key={key} className="px-3.5 py-2.5 grid grid-cols-12 gap-2 items-center">
                      <span className="col-span-5 text-zinc-500 font-medium">{key}</span>
                      <span className="col-span-7 font-mono text-[11px] text-slate-900 text-right">
                        {val}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Connected Upstream & Downstream Quick Navigation */}
              <div className="space-y-2 pt-2 border-t border-zinc-200/80">
                <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-500 font-semibold">
                  Luồng kết nối trực tiếp ({incomingIds.size} vào · {outgoingIds.size} ra)
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {[...incomingIds].map((id) => {
                    const n = nodes.find((item) => item.id === id)
                    if (!n) return null
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setActiveNodeId(id)}
                        className="text-[11px] font-mono px-2.5 py-1 rounded border border-zinc-200 bg-zinc-50 hover:border-slate-400 text-slate-700 cursor-pointer"
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
                        className="text-[11px] font-mono px-2.5 py-1 rounded border border-zinc-200 bg-white hover:border-slate-900 text-slate-900 cursor-pointer"
                      >
                        {n.name} →
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* 4. ACTION FOOTER (MÔ PHỎNG QUYỀN KIỂM DUYỆT LUỒNG DỮ LIỆU) */}
            <div className="p-4 border-t border-zinc-200 bg-zinc-50/80 space-y-2.5">
              <div className="flex items-center justify-between text-[11px] text-zinc-500">
                <span className="font-mono uppercase">Mô phỏng chốt chặn Kiểm duyệt</span>
                <span className="font-mono">
                  {activeApprovalStatus === 'approved'
                    ? 'Cho phép vào vùng chia sẻ'
                    : 'Giữ tại Quarantine · Trả về sửa ở nguồn'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => handleToggleApproval(activeNode.id, 'approved')}
                  className={`py-2 px-3 rounded-md text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    activeApprovalStatus === 'approved'
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'bg-white border border-zinc-300 text-slate-700 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Approve</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleToggleApproval(activeNode.id, 'rejected')}
                  className={`py-2 px-3 rounded-md text-xs font-semibold inline-flex items-center justify-center gap-1.5 border transition-colors cursor-pointer ${
                    activeApprovalStatus === 'rejected'
                      ? 'bg-rose-50 border-rose-500 text-rose-700'
                      : 'bg-white border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-400'
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
