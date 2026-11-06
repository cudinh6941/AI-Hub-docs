import { Link } from 'react-router-dom'
import UIVignette from './vignette/UIVignette'
import { useActiveVignette } from '../hooks/useActiveVignette'

export default function BentoSection() {
  const { currentActive, setItemRef, setHoveredIndex } = useActiveVignette()

  const items = [
    {
      index: 0,
      to: '/prompts?tool=Excel%20Copilot',
      eyebrow: 'Excel Copilot',
      title: 'Đối chiếu và phân tích biến động P&L',
      type: 'excel',
      caption: 'Tự động phát hiện chi phí vượt định mức thay vì rà soát thủ công.',
    },
    {
      index: 1,
      to: '/prompts?tool=Word%20Copilot',
      eyebrow: 'Word Copilot',
      title: 'Rà soát điều khoản phạt hợp đồng',
      type: 'word',
      caption: 'Tự động đối chiếu trần phạt 8% theo quy định Luật Thương mại.',
    },
    {
      index: 2,
      to: '/prompts?dept=Ban%20Gi%C3%A1m%20%C4%90%E1%BB%91c',
      eyebrow: 'Ban Giám Đốc',
      title: 'Trích xuất đầu việc giao ban tuần',
      type: 'summary',
      caption: 'Chuyển biên bản họp dài thành danh sách đầu việc có hạn chót rõ ràng.',
    },
    {
      index: 3,
      to: '/governance',
      eyebrow: 'An toàn thông tin',
      title: 'Ma trận kiểm soát và phân loại dữ liệu AI',
      type: 'governance',
      caption: 'Chốt chặn 3 cấp độ dữ liệu đảm bảo an toàn bí mật kinh doanh.',
    },
  ]

  return (
    <section className="border-t border-line py-16 bg-paper">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-6">
        <div className="lg:col-span-3">
          <h2 className="font-display text-2xl text-ink tracking-tight font-medium lg:sticky lg:top-24">
            Tác vụ tự động hóa theo nghiệp vụ
          </h2>
          <div className="mt-3 flex flex-col gap-2">
            <Link
              to="/prompts"
              className="text-sm text-body hover:text-accent underline underline-offset-4 decoration-line"
            >
              Tất cả công thức
            </Link>
            <Link
              to="/assistants"
              className="text-sm text-body hover:text-accent underline underline-offset-4 decoration-line"
            >
              Xem 4 trợ lý AI theo công việc
            </Link>
          </div>
        </div>

        <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-12">
          {items.map((item) => (
            <Link
              key={item.index}
              ref={setItemRef(item.index)}
              data-vignette-index={item.index}
              to={item.to}
              onMouseEnter={() => setHoveredIndex(item.index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onFocus={() => setHoveredIndex(item.index)}
              onBlur={() => setHoveredIndex(null)}
              className="group block border-t border-ink pt-4"
            >
              <div className="text-xs text-muted mb-1">{item.eyebrow}</div>
              <h3 className="font-display text-xl text-ink font-medium underline decoration-transparent underline-offset-4 decoration-1 group-hover:decoration-accent transition-[text-decoration-color] duration-200 mb-3">
                {item.title}
              </h3>
              
              {/* Visual UI Vignette */}
              <div className="mb-3">
                <UIVignette
                  type={item.type}
                  isActive={currentActive === item.index}
                />
              </div>

              {/* Minimalist Micro-copy */}
              <p className="text-xs text-muted leading-relaxed">
                {item.caption}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
