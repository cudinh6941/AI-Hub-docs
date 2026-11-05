---
name: ui-component-rules
description: Quy chuẩn thiết kế và phát triển UI Component trong AI Hub Docs (Design Tokens, Typography, Copy Button states, Gemini animations, Responsive).
triggers:
  - "/ui-rules"
  - "/ui-components"
  - "thiết kế component"
  - "quy chuẩn ui"
---

# Skill: UI Component Design & Implementation Rules

Skill này quy định chuẩn thiết kế giao diện cho Subagent `2-ui-developer` khi tạo mới hoặc bảo trì bất kỳ Component hoặc Trang nào trong dự án AI Hub Docs.

---

## 1. Hệ thống Bảng màu & Design Tokens (Color Palette)

Website tuân theo phong cách **Tài liệu nghiệp vụ được làm kỹ (Refined Editorial & Quiet Minimal)**:

| Vai trò màu | Tailwind Utility | Mã màu thực tế | Mục đích sử dụng |
| :--- | :--- | :--- | :--- |
| **Nền chính (Canvas/Paper)** | `bg-paper` | `#FBFAF7` | Nền trang tổng thể |
| **Nền vùng phụ (Sunken)** | `bg-paper-sunken` | `#F3F1EA` | Nền vùng phụ, khối code, nền input |
| **Đường viền/kẻ (Line)** | `border-line` | `#E7E3DA` | Mọi đường kẻ phân cách và viền |
| **Chữ tiêu đề (Ink)** | `text-ink` | `#1C1B19` | Tiêu đề H1, H2, H3, nút chính |
| **Chữ nội dung (Body)** | `text-body` | `#4A4741` | Đoạn văn tóm tắt, mô tả |
| **Chữ phụ (Muted)** | `text-muted` | `#7A756B` | Meta, ngày, nhãn phụ (đạt tương phản AA trên `paper`) |
| **Màu nhấn duy nhất (Accent)** | `bg-accent` / `text-accent` | `#C2410C` | Điểm nhấn duy nhất, CTA phụ, link hover |
| **Màu nhấn Hover** | `bg-accent-hover` | `#9A3412` | Hover của nút nhấn |
| **Nền nhấn nhạt (Soft Accent)** | `bg-accent-soft` | `#FFF1E8` | Chip biến số chưa điền |
| **Trạng thái thành công** | `emerald-*` | Chuẩn Tailwind | Đã sao chép, biến đã điền |
| **Trạng thái lỗi** | `red-*` | Chuẩn Tailwind | Lỗi hệ thống, cảnh báo |

---

## 2. Tiêu chuẩn Typography & Code Block

- **Font chữ thường**: `font-sans` (`Inter`) cho body và UI.
- **Font tiêu đề**: `font-display` (`Newsreader`, fallback `Source Serif 4`, `Georgia`, `serif`).
- **Font câu lệnh & biến số**: `font-mono` (`JetBrains Mono`, `Fira Code`).
- **Thẻ hiển thị biến số `[Biến]`**:
  - Trạng thái chưa điền: `bg-accent-soft text-accent border border-accent/30 px-1.5 py-0.5 rounded font-mono text-xs font-semibold`.
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
- **Tương tác Hover**: Kiểu hover duy nhất toàn site: phần tử cha có `group`, tiêu đề thêm `underline decoration-transparent underline-offset-4 decoration-1 group-hover:decoration-accent transition-[text-decoration-color] duration-200`. Liên kết dạng "Xem tất cả" dùng `text-body hover:text-accent`. Nút giữ `transition-colors duration-200`. Tuyệt đối không dùng `hover:scale` hay `hover:shadow`.

---

## 5. Quy chuẩn Độc lập & Tái sử dụng (Component Modularity)
- Mỗi Component phải nhận dữ liệu qua `props` rõ ràng, không hardcode dữ liệu bên trong Component.
- Luôn gọi dữ liệu qua `src/services/contentService.js` hoặc hook `useContent()`.
- Luôn xử lý 3 trạng thái:
  1. `loading`: Skeleton hoặc hiệu ứng mờ nhấp nháy `animate-pulse`.
  2. `empty`: Hiển thị component `EmptyState.jsx` thân thiện, có gợi ý hành động.
  3. `error`: Thông báo lỗi lịch sự kèm nút thử lại.

---

## 6. Nguyên tắc Chống Rập khuôn (Anti-Generic Design)

> Bổ sung theo `product/1-specs-backlog/FEAT-005-ui-direction-refresh.md`. Khi mâu thuẫn với mục 1–2 (bảng màu, font mặc định), ưu tiên hướng thiết kế đã được chốt trong FEAT-005. Mục này không làm thay đổi triết lý tối giản của `behavioral-product-design`.

Trước khi viết bất kỳ giao diện nào, `2-ui-developer` phải trả lời được: *"Điều gì làm trang này khác một template SaaS thông thường?"* Nếu không có câu trả lời, chưa được code.

### 6.1. Dấu hiệu "đại trà" cần tránh
- Gradient tím/indigo/hồng, gradient mesh, chữ gradient đa sắc làm điểm nhấn mặc định.
- Nền chấm (dot pattern), hạt nhiễu, hình khối trang trí không mang thông tin.
- Cùng một công thức cho mọi khối: bo góc `rounded-xl` + viền mảnh + bóng đổ.
- Cùng một khuôn cho mọi section: eyebrow + H2 + link "Xem tất cả", nền xen kẽ trắng / xám.
- Hero chuẩn SaaS: badge nhỏ + H1 + subhead + 2 nút + dải số liệu + mockup bên phải.
- Phản hồi hover mặc định: phóng to, thêm bóng, đổi chữ sang màu thương hiệu.
- Hạ tầng font mặc định (Inter) cho cả tiêu đề lẫn nội dung mà không có chủ đích.

### 6.2. Cách tạo cá tính mà vẫn tối giản
1. **Typography trước.** Chọn cặp font có chủ đích (tiêu đề khác nội dung), dùng cỡ chữ chênh lệch lớn để tạo thứ bậc thay cho viền và màu.
2. **Một màu nhấn duy nhất**, dùng cho tối đa 1–2 thành phần trên mỗi màn hình.
3. **Khoảng trắng là vật liệu.** Dùng khoảng cách và đường kẻ để chia vùng thay cho hộp viền.
4. **Nhịp điệu không đều.** Xen kẽ khối dày và khối thưa, tránh lặp cùng một bố cục nhiều lần liên tiếp.
5. **Chuyển động có ý nghĩa.** Chỉ animate để báo trạng thái (đã sao chép, đang tải, đã chuyển trang). Tôn trọng `prefers-reduced-motion`.
6. **Bố cục phục vụ nội dung.** Đọc nội dung trước, chọn cấu trúc sau, không đổ nội dung vào khuôn có sẵn.

### 6.3. Luật bố cục chống đóng hộp (bổ sung sau khi rà soát P3)
- **Tối đa 1 lớp hộp** (viền hoặc nền khác màu) cho mỗi vùng nội dung. Cấm hộp trong hộp. Chia nhóm bằng khoảng trắng và đường kẻ ngang.
- **Chip và badge chỉ là chữ** (`text-xs text-muted`, ngăn cách bằng `·`), không viền, không nền, không bo góc. Ngoại lệ: chip biến số `[Biến]` trong khối prompt.
- **Bố cục section kiểu biên tập**: tiêu đề nằm cột trái (`lg:col-span-3`, có thể `sticky`), nội dung cột phải (`lg:col-span-9`), ngăn cách section bằng `border-t border-line`. Không xếp dọc eyebrow + H2 + link lặp lại ở mọi section.
- **Không icon mũi tên trang trí** trong liên kết điều hướng. Liên kết là chữ gạch chân.
- **Không tự chạy**: cấm carousel tự xoay, hiệu ứng quét, nhấp nháy. Nội dung chỉ đổi khi người dùng bấm.
- **Mockup dùng nội dung thật** (trích đoạn prompt hoặc kết quả mẫu), không dựng giao diện giả với dữ liệu bịa, mã số trang trí hay nhãn đỏ kiểu dashboard.
- **Không eyebrow viết hoa** (`uppercase tracking-wider`) và không badge có chấm tròn.
- **Nút chỉ có 2 kiểu**: nút chính `bg-ink hover:bg-accent text-white rounded-md` và liên kết chữ gạch chân. Nút viền chỉ dành cho nút Copy.
- **Nhịp bố cục**: không để 2 section liền nhau có cùng cấu trúc nội dung.

### 6.4. Ngân sách chữ và đơn vị hình ảnh (bổ sung sau khi rà soát chữ quá nhiều)
- **Mỗi section tối đa 1 đoạn văn, mỗi đoạn tối đa 20 từ.** Tiêu đề tối đa 10 từ.
- **Không lặp một thông điệp ở nhiều nơi**: một cặp ví dụ chỉ xuất hiện một lần trên mỗi trang.
- **Mỗi trang có đúng một đơn vị hình ảnh là nội dung thật**: component `BeforeAfter` (cặp "trước, sau" tương phản cỡ chữ và font), ảnh chụp kết quả thật đã ẩn danh, hoặc một câu trích cỡ lớn. Cấm ảnh stock, ảnh AI vẽ, icon trong vòng tròn, hình trang trí.
- **Cắt trước, thêm sau**: đoạn văn nào chỉ mô tả lại điều tiêu đề hoặc ví dụ đã thể hiện thì xóa, không viết lại ngắn hơn.

### 6.5. Bài kiểm tra trước khi bàn giao
- [ ] **Che logo**: trang vẫn nhận ra được là AI Hub Docs.
- [ ] **Đếm khuôn**: không có quá 2 section liên tiếp dùng cùng một bố cục.
- [ ] **Đếm màu**: ngoài trung tính chỉ có 1 màu nhấn (cộng trạng thái thành công / lỗi).
- [ ] **Đếm thông tin**: mỗi thẻ dưới 3 nhóm thông tin.
- [ ] **Hover**: dùng đúng một kiểu phản hồi thống nhất trên toàn site.
- [ ] **Đếm hộp**: không có hộp nằm trong hộp ở bất kỳ vùng nào.
- [ ] **Không tự chạy**: không có phần tử nào tự đổi nội dung hoặc tự chuyển động liên tục.
- [ ] **Đếm chữ**: không section nào có quá 1 đoạn văn hoặc đoạn quá 20 từ; mỗi trang có đúng một đơn vị hình ảnh là nội dung thật.
