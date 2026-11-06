import { useState } from 'react'
import { Check, XCircle } from 'lucide-react'

export default function DataFlowSimulator({ scenarios = [], onSyncDiagram }) {
  const [scenarioId, setScenarioId] = useState(scenarios[0]?.id || 'mismatch')
  // stage: 'input' | 'staged' | 'approved' | 'rejected'
  const [stage, setStage] = useState('staged')

  const currentScenario =
    scenarios.find((s) => s.id === scenarioId) || scenarios[0] || null

  if (!currentScenario) return null

  const handleSelectScenario = (nextId) => {
    setScenarioId(nextId)
    setStage('staged')
    onSyncDiagram?.('ing-landing', 'approved')
  }

  const handlePushToLanding = () => {
    setStage('staged')
    onSyncDiagram?.('ing-landing', 'approved')
  }

  const handleApprove = () => {
    setStage('approved')
    onSyncDiagram?.('onprem-mdm', 'approved')
  }

  const handleReject = () => {
    setStage('rejected')
    onSyncDiagram?.('ing-landing', 'rejected')
  }

  return (
    <section className="border-b border-line py-12 bg-paper">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-6">
        {/* Left Editorial Column (lg:col-span-3) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="space-y-2">
            <h2 className="font-display text-2xl text-ink tracking-tight font-medium">
              Mô phỏng 1 bản ghi đi qua hệ thống
            </h2>
            <p className="text-sm text-muted leading-relaxed">
              Thử đóng vai đơn vị đưa 3 dòng dữ liệu lệch mã vào trạm kiểm duyệt và xem kết quả đầu ra.
            </p>
          </div>

          {/* Scenario Switcher (Plain underline links per UI rules) */}
          <div className="space-y-2 pt-2 border-t border-line text-xs">
            <div className="text-muted">Chọn dữ liệu thử nghiệm:</div>
            <div className="flex flex-col items-start gap-2">
              {scenarios.map((sc) => {
                const isActive = sc.id === currentScenario.id
                return (
                  <button
                    key={sc.id}
                    type="button"
                    onClick={() => handleSelectScenario(sc.id)}
                    className={`text-left cursor-pointer transition-colors duration-200 underline underline-offset-4 ${
                      isActive
                        ? 'text-accent decoration-accent font-medium'
                        : 'text-body decoration-transparent hover:text-accent hover:decoration-accent'
                    }`}
                  >
                    {sc.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right 3-Station Interactive Pipeline (lg:col-span-9, divided by lines, no box-in-box) */}
        <div className="lg:col-span-9 grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-line border-t border-b border-line">
          {/* =================================================================
              TRẠM 01: ĐẦU VÀO TỪ PHẦN MỀM ĐƠN VỊ (INPUT)
             ================================================================= */}
          <div className="py-5 lg:pr-6 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-muted">
                <span>01 · Đầu vào (Input)</span>
                <button
                  type="button"
                  onClick={() => onSyncDiagram?.('src-fast', 'approved')}
                  className="text-muted hover:text-accent underline underline-offset-4 cursor-pointer"
                >
                  Xem trên sơ đồ
                </button>
              </div>

              <h3 className="font-display text-lg text-ink font-medium">
                3 phần mềm đang lệch mã
              </h3>

              {/* 3 Raw Input Rows divided by thin lines */}
              <div className="divide-y divide-line border-t border-b border-line text-xs">
                {currentScenario.inputRecords.map((rec) => (
                  <div key={rec.system} className="py-2.5 space-y-1">
                    <div className="flex items-center justify-between font-mono text-[11px]">
                      <span className="text-ink font-medium">{rec.system}</span>
                      <span className="text-muted">Mã: {rec.unitCode}</span>
                    </div>
                    <div className="flex items-center justify-between text-body">
                      <span className="truncate pr-2">“{rec.partnerName}”</span>
                      <span className="font-mono text-[11px] text-ink shrink-0">
                        {rec.amount}
                      </span>
                    </div>
                    <div
                      className={`font-mono text-[11px] ${
                        rec.isError ? 'text-red-700 font-medium' : 'text-muted'
                      }`}
                    >
                      MST: {rec.taxCode}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-1">
              <button
                type="button"
                onClick={handlePushToLanding}
                className="w-full py-2 px-3 rounded-md text-xs font-medium bg-ink hover:bg-accent text-white transition-colors duration-200 cursor-pointer"
              >
                Đẩy qua Vùng 5 vào Landing Zone →
              </button>
            </div>
          </div>

          {/* =================================================================
              TRẠM 02: DUYỆT TẠI LANDING ZONE & KHỚP MÃ MDM (CORE)
             ================================================================= */}
          <div className="py-5 lg:px-6 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-accent">02 · Ruột xử lý (Core)</span>
                <button
                  type="button"
                  onClick={() =>
                    onSyncDiagram?.(
                      stage === 'approved' ? 'onprem-mdm' : 'ing-landing',
                      stage === 'rejected' ? 'rejected' : 'approved'
                    )
                  }
                  className="text-muted hover:text-accent underline underline-offset-4 cursor-pointer"
                >
                  Xem trên sơ đồ
                </button>
              </div>

              <h3 className="font-display text-lg text-ink font-medium">
                Landing Zone & Khớp mã MDM
              </h3>

              {/* Step 2A: Automated Check at Landing Zone */}
              <div className="space-y-1.5 text-xs">
                <div
                  className={`font-mono text-[11px] ${
                    currentScenario.hasQualityError ? 'text-red-700' : 'text-ink'
                  }`}
                >
                  {currentScenario.landingCheck.statusText}
                </div>
                <p className="text-muted leading-relaxed">
                  {currentScenario.landingCheck.detail}
                </p>
              </div>

              {/* Step 2B: Decision Result (Golden Record OR Quarantine) */}
              <div className="border-t border-line pt-3 text-xs space-y-1.5">
                {stage === 'approved' && (
                  <>
                    <div className="font-mono text-[11px] text-emerald-700">
                      Đã Approve → Tạo Golden Record tại MDM (Tầng 10):
                    </div>
                    <div className="font-medium text-ink">
                      {currentScenario.mdmGoldenRecord.standardName}
                    </div>
                    <div className="font-mono text-[11px] text-muted">
                      Gộp 3 mã đơn vị: {currentScenario.mdmGoldenRecord.tier1UnitCodes}
                    </div>
                    <div className="font-mono text-[11px] text-muted">
                      Mã chuẩn PTSC / PVN: {currentScenario.mdmGoldenRecord.tier2PtscCode}
                    </div>
                  </>
                )}

                {stage === 'rejected' && (
                  <>
                    <div className="font-mono text-[11px] text-red-700">
                      Đã Reject → Giữ tại vùng Quarantine của Đơn vị:
                    </div>
                    <p className="text-body leading-relaxed">
                      Lô dữ liệu bị chặn lại, không đi vào Lakehouse hay MDM. Trả về cho Key User sửa tại phần mềm gốc rồi nộp lại.
                    </p>
                  </>
                )}

                {stage === 'staged' && (
                  <p className="text-body leading-relaxed">
                    Đang chờ Đơn vị (Data Owner) bấm quyết định bên dưới trước khi dữ liệu được phép vào Cụm Hub Tầng 10.
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons: Unit is Data Owner (Approve / Reject) */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                type="button"
                onClick={handleApprove}
                className={`py-2 px-2.5 rounded-md text-xs font-medium inline-flex items-center justify-center gap-1.5 transition-colors duration-200 cursor-pointer ${
                  stage === 'approved'
                    ? 'bg-ink hover:bg-accent text-white'
                    : 'bg-paper border border-line text-ink hover:border-ink'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>Approve</span>
              </button>

              <button
                type="button"
                onClick={handleReject}
                className={`py-2 px-2.5 rounded-md text-xs font-medium inline-flex items-center justify-center gap-1.5 border transition-colors duration-200 cursor-pointer ${
                  stage === 'rejected'
                    ? 'bg-red-50 border-red-300 text-red-700'
                    : 'bg-paper border-line text-body hover:text-red-700'
                }`}
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Reject</span>
              </button>
            </div>
          </div>

          {/* =================================================================
              TRẠM 03: HAI NHÁNH KẾT QUẢ ĐẦU RA (OUTPUT)
             ================================================================= */}
          <div className="py-5 lg:pl-6 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-muted">
                <span>03 · Đầu ra (Output)</span>
                {stage === 'approved' && (
                  <button
                    type="button"
                    onClick={() => onSyncDiagram?.('down-bi', 'approved')}
                    className="text-muted hover:text-accent underline underline-offset-4 cursor-pointer"
                  >
                    Xem trên sơ đồ
                  </button>
                )}
              </div>

              <h3 className="font-display text-lg text-ink font-medium">
                2 nhánh kết quả nhận về
              </h3>

              {stage === 'approved' ? (
                <div className="divide-y divide-line border-t border-b border-line text-xs">
                  {/* Branch 1: Direct from MDM */}
                  <div className="py-3 space-y-1">
                    <button
                      type="button"
                      onClick={() => onSyncDiagram?.('down-mdm', 'approved')}
                      className="font-mono text-[11px] text-ink hover:text-accent underline underline-offset-4 cursor-pointer text-left"
                    >
                      {currentScenario.outputBranch1.title} →
                    </button>
                    <p className="text-body leading-relaxed">
                      {currentScenario.outputBranch1.summary}
                    </p>
                  </div>

                  {/* Branch 2: Power BI & Data Products */}
                  <div className="py-3 space-y-1.5">
                    <button
                      type="button"
                      onClick={() => onSyncDiagram?.('down-bi', 'approved')}
                      className="font-mono text-[11px] text-ink hover:text-accent underline underline-offset-4 cursor-pointer text-left"
                    >
                      {currentScenario.outputBranch2.title} →
                    </button>
                    <div className="font-mono text-[11px] text-emerald-700 font-medium">
                      {currentScenario.outputBranch2.reportLine}
                    </div>
                    <p className="text-muted leading-relaxed">
                      {currentScenario.outputBranch2.summary}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="border-t border-b border-line py-6 text-xs text-muted space-y-2">
                  <div className="font-mono text-ink">
                    {stage === 'rejected'
                      ? 'Đầu ra bị khóa do Đơn vị đã bấm Reject'
                      : 'Đang chờ Đơn vị bấm Approve ở Trạm 02'}
                  </div>
                  <p className="leading-relaxed">
                    Khi Đơn vị chưa phê duyệt tại Landing Zone, dữ liệu không được đưa vào vùng chia sẻ và không phát sinh báo cáo sai lệch lên Tổng công ty.
                  </p>
                </div>
              )}
            </div>

            <div className="text-[11px] font-mono text-muted">
              {stage === 'approved'
                ? 'Trạng thái: Đã đồng bộ 2 nhánh Output'
                : 'Trạng thái: Chưa phát hành dữ liệu ra ngoài Đơn vị'}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
