---
name: ui-component-rules
description: Quy chuẩn thiết kế và phát triển UI Component trong AI Hub Docs (Design Tokens, Typography, Copy Button states, Gemini animations, Responsive).
---

# Skill: UI Component Design & Implementation Rules

Skill này quy định chuẩn thiết kế giao diện cho Subagent `2-ui-developer` khi tạo mới hoặc bảo trì bất kỳ Component hoặc Trang nào trong dự án AI Hub Docs.

---

## 1. Hệ thống Bảng màu & Design Tokens (Color Palette)

Website tuân theo phong cách **Sleek Minimal Enterprise** kết hợp điểm nhấn **Gemini / Stripe AI**:

| Vai trò màu | Tailwind Utility | Mã màu thực tế | Mục đích sử dụng |
| :--- | :--- | :--- | :--- |
| **Nền chính (Canvas)** | `bg-[#FAFAFA]` / `bg-white` | `#FAFAFA` / `#FFFFFF` | Nền trang tổng thể, thẻ bài viết |
| **Đường viền (Border)** | `border-slate-200/80` | `rgba(226, 232, 240, 0.8)` | Viền thẻ, thanh phân chia tinh tế |
| **Chữ tiêu đề (Heading)** | `text-slate-900` | `#0F172A` | Tiêu đề H1, H2, H3 (Font weight: `font-bold` hoặc `font-extrabold`) |
| **Chữ nội dung (Body)** | `text-slate-600` | `#475569` | Đoạn văn tóm tắt, mô tả |
| **Chữ phụ (Muted)** | `text-slate-400` / `text-slate-500` | `#94A3B8` | Ngày tháng, meta info, thời lượng |
| **Màu thương hiệu (Brand Accent)** | `bg-indigo-600` / `text-indigo-600` | `#4F46E5` / `#635BFF` | Nút hành động chính (Primary CTA), Badge |
| **Gemini AI Shimmer** | `animate-gemini-gradient` | Gradient Đa sắc | Tiêu đề điểm nhấn AI, từ khóa vàng |

---

## 2. Tiêu chuẩn Typography & Code Block

- **Font chữ thường**: `font-sans` (`Inter`, fallback `-apple-system`, `sans-serif`).
- **Font câu lệnh & biến số**: `font-mono` (`JetBrains Mono`, `Fira Code`).
- **Thẻ hiển thị biến số `[Biến]`**:
  - Trạng thái chưa điền: `bg-indigo-50 text-indigo-700 border border-indigo-200/60 px-1.5 py-0.5 rounded font-mono text-xs font-semibold`.
  - Trạng thái đã điền: `bg-emerald-50 text-emerald-700 border border-emerald-200/70 px-1.5 py-0.5 rounded font-mono text-xs font-semibold`.

---

## 3. Quy chuẩn Nút Sao chép (Copy-to-Clipboard Button)

Nút Copy là hành động cốt lõi của website, **BẮT BUỘC** phải có 2 trạng thái phản hồi xúc giác (Haptic visual feedback):

1. **Trạng thái Mặc định (Idle)**:
   - Icon: `<Copy className="w-4 h-4 text-slate-500" />`
   - Nhãn: `"Sao chép prompt"` hoặc `"Copy"`
   - Style: Viền mềm, hover sáng nhẹ `hover:bg-slate-100 transition-colors duration-200`.
2. **Trạng thái Đã sao chép (Copied - Giữ 2 giây)**:
   - Icon: `<Check className="w-4 h-4 text-emerald-600" />`
   - Nhãn: `"Đã sao chép!"`
   - Style: Nền xanh lá nhạt `bg-emerald-50 text-emerald-700 border-emerald-200/80`.
   - Timeout: Tự động hồi về trạng thái Idle sau đúng `2000ms`.

---

## 4. Quy tắc Micro-Animations & Hiệu năng (Performance Rules)

- **Chỉ sử dụng GPU**: Tuyệt đối chỉ animate `transform` và `opacity`. Cấm animate `height`, `width`, `top`, `margin` vì sẽ gây giật layout (Reflow).
- **Stagger Fade-up**: Khi một trang hoặc danh sách hiển thị, các phần tử xuất hiện so le từ dưới lên:
  - Element 1: `animate-fade-up`
  - Element 2: `animate-fade-up delay-100`
  - Element 3: `animate-fade-up delay-200`
- **Tương tác Hover**: Phóng to nhẹ nhàng `hover:scale-[1.01] hover:shadow-md transition-all duration-200`.

---

## 5. Quy chuẩn Độc lập & Tái sử dụng (Component Modularity)
- Mỗi Component phải nhận dữ liệu qua `props` rõ ràng, không hardcode dữ liệu bên trong Component.
- Luôn xử lý 3 trạng thái:
  1. `loading`: Skeleton hoặc hiệu ứng mờ nhấp nháy `animate-pulse`.
  2. `empty`: Hiển thị component `EmptyState.jsx` thân thiện, có gợi ý hành động.
  3. `error`: Thông báo lỗi lịch sự kèm nút thử lại.
