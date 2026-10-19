import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, ArrowRight } from 'lucide-react'

const SOLUTIONS = [
  {
    id: 'contract',
    category: 'Tạo trợ lý AI riêng cho công việc',
    title: 'Trợ lý Rà soát Hợp đồng & Văn bản Pháp lý',
    curiosity: 'Mình cũng có một trợ lý riêng cho công việc hàng ngày à?',
    hook: 'Bạn có ngay một trợ lý riêng đã nắm trọn vẹn quy chế nội bộ, biểu mẫu của phòng ban và quy định pháp luật liên quan.',
    pain: 'Mỗi lần kiểm tra hợp đồng phải đọc lại hàng chục trang và tra cứu từng điều khoản quy chế thủ công.',
    benefit: 'Chỉ cần đưa dự thảo vào, trợ lý chỉ ra ngay điều khoản vượt mức quy định và gợi ý câu chữ điều chỉnh hợp lệ.',
    guideSlug: 'gemini-gems-tro-ly-chuyen-sau',
    platformNote: 'Công nghệ đứng sau: Gemini Gems / ChatGPT Projects',
    before: {
      label: 'Điều khoản gốc trong dự thảo đối tác',
      text: 'Điều 6.2: Bên B chịu phạt 1.0% mỗi ngày trễ hạn và không bị giới hạn tổng mức phạt tối đa.',
    },
    after: {
      label: 'Trợ lý riêng phát hiện & Đề xuất sửa đổi',
      text: 'CẢNH BÁO: Mức phạt 1%/ngày vượt trần quy định. Cần sửa thành: "Mức phạt vi phạm nghĩa vụ hợp đồng không vượt quá 8% giá trị phần nghĩa vụ bị vi phạm theo Điều 301 Luật Thương mại."',
    },
  },
  {
    id: 'summary',
    category: 'Biến tài liệu dài thành bản tóm tắt',
    title: 'Trợ lý Rút gọn Hồ sơ & Báo cáo Dày cộp',
    curiosity: 'Cái này tiết kiệm được bao nhiêu thời gian đọc tài liệu nhỉ?',
    hook: 'Biến tập hồ sơ dày hàng chục trang thành bản tóm tắt một trang gồm ý chính, điểm rủi ro và việc cần xử lý ngay.',
    pain: 'Mất cả buổi đọc tài liệu kỹ thuật, quy chế hoặc hồ sơ mời thầu dày cộp chỉ để lọc ra vài con số quan trọng.',
    benefit: 'Đặt câu hỏi bằng tiếng Việt thông thường, hệ thống trích xuất đúng thông tin cần tìm kèm số trang gốc để đối chiếu.',
    guideSlug: 'notebooklm-tra-cuu-tai-lieu-chuyen-sau',
    platformNote: 'Công nghệ đứng sau: Google NotebookLM / Microsoft 365',
    before: {
      label: 'Hồ sơ mời thầu kỹ thuật 92 trang',
      text: 'Hàng chục trang quy chuẩn, phụ lục, điều kiện thương mại dày đặc chữ và các thông số kỹ thuật nằm rải rác.',
    },
    after: {
      label: 'Bản tóm tắt cô đọng kèm vị trí trang gốc',
      text: '1. Bảo lãnh thực hiện hợp đồng: 5% giá trị hợp đồng [Trang 24]\n2. Thời gian thi công hoàn tất: 180 ngày [Trang 58]\n3. Điều khoản phạt tiến độ: Áp dụng sau 7 ngày chậm trễ [Trang 63]',
    },
  },
  {
    id: 'rewrite',
    category: 'Viết lại văn bản chỉ trong vài giây',
    title: 'Trợ lý Chuẩn hóa Email & Công văn Doanh nghiệp',
    curiosity: 'Hóa ra mình không cần biết viết câu lệnh phức tạp à?',
    hook: 'Chuyển những dòng ghi chú gõ vội, lủng củng thành thư trao đổi trang trọng, rõ ý và giữ vững lập trường đàm phán.',
    pain: 'Muốn soạn công văn, tờ trình hay email gửi Ban Giám đốc và đối tác nhưng mất nhiều thời gian cân nhắc từng câu chữ.',
    benefit: 'Bôi đen đoạn văn cần sửa, trợ lý lập tức viết lại theo đúng văn phong thương mại lịch thiệp mà không làm lệch ý chính.',
    guideSlug: 'canvas-artifacts-chinh-sua-truc-tiep',
    platformNote: 'Công nghệ đứng sau: Không gian soạn thảo Canvas / Artifacts',
    before: {
      label: 'Nội dung ghi chú ban đầu (Gõ vội)',
      text: '"Bên mình đang bận kiểm tra lại số liệu nên chắc tuần sau mới gửi tài liệu được, phía đối tác thông cảm đợi thêm nhé."',
    },
    after: {
      label: 'Văn bản sau khi được viết lại chuẩn mực',
      text: '"Để đảm bảo độ chính xác của số liệu thẩm định, chúng tôi dự kiến hoàn tất và gửi bộ hồ sơ chính thức trước ngày 25. Rất mong nhận được sự phối hợp từ Quý đối tác."',
    },
  },
  {
    id: 'automation',
    category: 'Tự động hóa một việc đang làm thủ công',
    title: 'Trợ lý Tự động hóa Đối soát & Báo cáo Định kỳ',
    curiosity: 'Việc lặp đi lặp lại này có thể khỏi làm tay thật à?',
    hook: 'Gom toàn bộ bảng biểu và quy tắc kiểm tra của một đầu việc định kỳ vào một nơi để máy tự xử lý theo khuôn mẫu.',
    pain: 'Mỗi tuần phải mở nhiều bảng tính, sao chép dữ liệu qua lại, tự cộng trừ số ngày quá hạn và soạn từng thư nhắc nợ.',
    benefit: 'Đưa bảng dữ liệu mới vào không gian làm việc đã thiết lập, hệ thống tự động phân nhóm công nợ và soạn sẵn dự thảo đôn đốc.',
    guideSlug: 'chatgpt-projects-khong-gian-du-an',
    platformNote: 'Công nghệ đứng sau: ChatGPT Projects / Excel Copilot',
    before: {
      label: 'Quy trình làm tay lặp lại hàng tuần',
      text: 'Mở từng tệp theo dõi kế toán, lọc thủ công số ngày quá hạn, tự đối chiếu hạn mức và gõ lại email nhắc thanh toán cho từng đơn vị.',
    },
    after: {
      label: 'Kết quả sau khi tự động hóa quy trình',
      text: 'Tự động phân loại 4 nhóm tuổi nợ, đánh dấu rõ danh sách quá hạn trên 60 ngày và tạo sẵn dự thảo công văn nhắc thanh toán tương ứng.',
    },
  },
]

const CATEGORIES = [
  'Tất cả bài toán',
  'Tạo trợ lý AI riêng cho công việc',
  'Biến tài liệu dài thành bản tóm tắt',
  'Viết lại văn bản chỉ trong vài giây',
  'Tự động hóa một việc đang làm thủ công',
]

export default function AssistantsPage() {
  const [selectedCat, setSelectedCat] = useState('Tất cả bài toán')

  const filteredSolutions = selectedCat === 'Tất cả bài toán'
    ? SOLUTIONS
    : SOLUTIONS.filter((s) => s.category === selectedCat)

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-6">
        <Link to="/" className="hover:text-slate-900">Trang chủ</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="font-medium text-slate-900">Trợ lý AI theo công việc</span>
      </nav>

      {/* Page Header */}
      <header className="mb-10 pb-8 border-b border-slate-200/80">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60 mb-3">
          <span>Bắt đầu từ kết quả thực tế</span>
          <span className="text-indigo-300">•</span>
          <span>Công nghệ phục vụ công việc</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-3">
          Nhìn Thấy Lợi Ích Thực Tế Trước Khi Tìm Hiểu Công Nghệ
        </h1>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
          Bạn không cần bận tâm tới các thuật ngữ kỹ thuật hay cách viết câu lệnh phức tạp. Hãy chọn đầu việc bạn muốn giải quyết dưới đây, đối chiếu kết quả Trước / Sau và lấy cấu hình mẫu đã được thẩm định để áp dụng ngay.
        </p>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 pt-6 overflow-x-auto max-w-full">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCat(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCat === cat
                  ? 'bg-slate-900 text-white font-semibold shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {/* Solutions Showcase List */}
      <div className="space-y-12">
        {filteredSolutions.map((sol) => (
          <article
            key={sol.id}
            className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-[0_2px_16px_rgba(0,0,0,0.04)] hover:border-slate-300 transition-all duration-200 space-y-6"
          >
            {/* Top Row: Category & Title */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                  {sol.category}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
                  {sol.title}
                </h2>
              </div>
              <span className="text-[11px] font-mono text-slate-500 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200/80 self-start sm:self-auto">
                {sol.platformNote}
              </span>
            </div>

            {/* Natural Curiosity Hook & Clear Value Answer */}
            <div className="p-4 rounded-2xl bg-indigo-50/40 border border-indigo-100/80 space-y-1.5">
              <div className="text-xs font-semibold text-indigo-700">
                Điều nhiều nhân viên thắc mắc: "{sol.curiosity}"
              </div>
              <p className="text-sm sm:text-base font-semibold text-slate-900 leading-relaxed">
                {sol.hook}
              </p>
            </div>

            {/* Pain vs Benefit Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
                <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                  Khi đang làm thủ công:
                </span>
                <p className="text-slate-700 leading-relaxed">{sol.pain}</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-100/80 border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 uppercase tracking-wider text-[10px]">
                  Kết quả đạt được ngay:
                </span>
                <p className="text-slate-800 font-medium leading-relaxed">{sol.benefit}</p>
              </div>
            </div>

            {/* Before vs After Visual Comparison Box */}
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 sm:p-5 space-y-3">
              <div className="text-xs font-bold text-slate-900 flex items-center justify-between">
                <span>Đối chiếu kết quả thực tế (Trước và Sau)</span>
                <span className="text-[11px] font-normal text-slate-500">Minh họa tình huống tại doanh nghiệp</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Before Box */}
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium">
                    <span>{sol.before.label}</span>
                    <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-mono">Trước khi xử lý</span>
                  </div>
                  <p className="text-slate-700 font-mono text-[11px] leading-relaxed whitespace-pre-wrap">
                    {sol.before.text}
                  </p>
                </div>

                {/* After Box */}
                <div className="p-3.5 rounded-xl border border-slate-300 bg-white shadow-2xs space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] text-slate-800 font-medium">
                    <span className="font-semibold text-slate-900">{sol.after.label}</span>
                    <span className="px-1.5 py-0.2 rounded bg-slate-900 text-white font-mono text-[10px] font-semibold">Sau khi xử lý</span>
                  </div>
                  <p className="text-slate-800 font-mono text-[11px] leading-relaxed whitespace-pre-wrap">
                    {sol.after.text}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Bottom Bar */}
            <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <span className="text-xs text-slate-500">
                Đã kiểm định nghiệp vụ để sử dụng an toàn trong công việc.
              </span>

              <Link
                to={`/guides/${sol.guideSlug}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs font-semibold transition-colors duration-200"
              >
                <span>Xem cách thiết lập công cụ đứng sau</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
