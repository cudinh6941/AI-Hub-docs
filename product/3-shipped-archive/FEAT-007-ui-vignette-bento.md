---
id: FEAT-007
title: "UI Vignette: minh họa thao tác trên thẻ Bento trang chủ"
status: shipped # idea | spec-ready | in-progress | shipped
priority: medium
target_agents:
  - 6-product-psychologist
  - 2-ui-developer
  - 3-qa-verifier
created: 2026-11-06
tags:
  - feature
  - spec
  - homepage
  - micro-motion
---

# [FEAT-007] UI Vignette cho thẻ Bento trang chủ

> **Tóm tắt giá trị**: Thay đoạn chữ Before/After ở 4 thẻ nghiệp vụ trang chủ bằng khung giao diện thu nhỏ (UI Vignette) dựng bằng React + CSS, để người dùng lướt qua 1–3 giây là hình dung được công cụ làm gì.
> **Trạng thái**: `shipped` | **Độ ưu tiên**: `medium` | **Ngày tạo**: 2026-11-06

---

## 0. Quyết định thiết kế (đã thống nhất)

| Hạng mục | Quyết định | Lý do |
|---|---|---|
| Định dạng asset | **Component React/SVG/CSS**, không dùng video, WebP hay Lottie | 0 KB media, sắc nét mọi độ phân giải, sửa chữ tiếng Việt không cần quay lại, không dính autoplay |
| Phong cách | "Abstracted UI" như trang Google Docs AI: chữ phụ thành thanh skeleton xám, chỉ giữ 1 câu lệnh hoặc 1 menu làm điểm nhấn | Giảm tải nhận thức, đúng tinh thần tối giản |
| Chuyển động | Micro-motion CSS (`transform`, `opacity`), 1 vòng 3–4s, nhịp nghỉ ~1s | 60fps, GPU, không nặng |
| Số demo chuyển động cùng lúc | **Tối đa 1 vignette chạy tại một thời điểm** | Khuyến nghị của `6-product-psychologist` |
| Phạm vi | Chỉ `BentoSection` (4 thẻ). Hero **không** đổi ở phase này | Giữ phạm vi nhỏ, đo hiệu quả trước |

---

## 1. Chiến lược Hành vi & Trải nghiệm (`6-product-psychologist`)

- **Nỗi đau**: Người dùng lười đọc. 4 thẻ hiện tại là chữ monospace, phải đọc mới hiểu.
- **Giảm ma sát**:
  - Mỗi thẻ gồm: vignette, tiêu đề, 1 dòng. Vignette **thay** đoạn mô tả, không thêm vào.
  - Tầng 1 tối đa 3 thành phần (vignette, tiêu đề, 1 câu).
  - Caption dưới 8 từ.
  - Cùng nền, cùng con trỏ, cùng tốc độ cho cả 4 vignette.
- **Chuyển động**:
  - Ngoài viewport hoặc chưa kích hoạt: hiển thị **khung tĩnh đẹp nhất** (trạng thái kết quả).
  - Chạy khi thẻ vào giữa viewport (IntersectionObserver, ngưỡng 0.6) hoặc khi hover/focus. Khi vignette khác vào giữa, vignette cũ dừng.
  - Mobile: chạy theo viewport, không phụ thuộc hover.
  - Con trỏ chậm, ease-out, không giật.
- **Micro-copy** (nội dung từng vignette, dữ liệu minh họa, không có PII):

| Thẻ | Khung | Kịch bản chuyển động | Điểm nhấn |
|---|---|---|---|
| Excel Copilot, P&L | Lưới bảng tính + cột số skeleton | Hàng "Cloud" được tô sáng, popup hiện badge | `Cloud +28.3%` |
| Word Copilot, Hợp đồng | Văn bản skeleton | Một dòng được bôi, menu Copilot trồi lên, con trỏ chọn mục | `Trần phạt 8%` |
| Ban Giám Đốc, Giao ban | Biên bản skeleton | Thẻ checklist trượt lên | 2 đầu việc kèm hạn `25/10`, `28/10` |
| An toàn thông tin | Ô nhập prompt | Nhãn phân loại hiện lần lượt | `Công khai`, `Nội bộ`, `Tối mật` |

- **Đo lường** (sau khi phát hành): CTR thẻ có vignette so với trước đó, tỉ lệ bấm vào từng thẻ, thời gian đến tương tác đầu tiên. Guardrail: LCP, CLS, tổng KB trang.

---

## 2. Dữ liệu & Service (`1-data-architect`)

- Không cần schema hoặc DB mới.
- Nội dung vignette (nhãn, số liệu minh họa) khai báo thành **một mảng hằng số** trong `BentoSection.jsx`, giống cách `BentoSection` đang hardcode nội dung. Không import JSON trực tiếp vào UI.
- Nếu về sau cần quản lý nội dung bằng CMS thì mở FEAT riêng, đi qua `contentService.js`.
- Dữ liệu minh họa phải là số liệu giả, không có PII, tên đối tác hay số liệu thật (`data-sanitization`).

---

## 3. Giao diện & UI/UX (`2-ui-developer`)

### Components (đọc `ui-component-rules` trước khi code)
- [ ] Tạo `src/components/vignette/UIVignette.jsx`: nhận prop `type` (`excel | word | summary | governance`) và `active` (boolean), render khung tương ứng.
- [ ] Tạo hook `src/hooks/useActiveVignette.js`: một IntersectionObserver dùng chung, đảm bảo mỗi lúc chỉ một vignette `active`.
- [ ] Sửa `src/components/BentoSection.jsx`: thay `<BeforeAfter stacked>` bằng `<UIVignette>`. Giữ nguyên `Link`, tiêu đề, `border-t border-ink`. **Không xóa** `BeforeAfter` (Hero vẫn dùng).
- [ ] Dùng Design Tokens hiện có (`ink`, `paper`, `line`, `accent`, `muted`). Không thêm màu mới ngoài skeleton xám lấy từ token `line`.
- [ ] Khung: `aspect-ratio: 16/9`, bo góc, đổ bóng nhẹ, không gây layout shift.
- [ ] Dựng bằng DOM + Tailwind, hoặc SVG inline. Không thêm thư viện mới (không GSAP, Framer, Lottie).

### Chuyển động & Hiệu năng
- [ ] Keyframes CSS chỉ dùng `transform` và `opacity`. Tổng chu kỳ 3–4s, nghỉ ~1s, `animation-iteration-count: infinite` chỉ khi `active`.
- [ ] Con trỏ là SVG nhỏ, di chuyển bằng `transform: translate` với `cubic-bezier` mềm (ví dụ `0.4, 0, 0.2, 1`), đích là tâm phần tử bấm.
- [ ] Dừng animation khi: `prefers-reduced-motion: reduce`, tab ẩn (`visibilitychange`), vignette không `active`.
- [ ] Với reduced-motion: chỉ hiển thị khung tĩnh kết quả.
- [ ] Trạng thái `loading`, `empty`, `error`: không áp dụng vì dữ liệu tĩnh trong code. Ghi chú rõ trong PR.

### Accessibility & Responsive
- [ ] Vignette `aria-hidden="true"`, ý nghĩa nằm ở tiêu đề thẻ. Nếu bỏ chữ mô tả thì thêm `aria-label` ở `Link`.
- [ ] Có thể focus thẻ bằng bàn phím và kích hoạt animation khi `focus-visible`.
- [ ] Hiển thị tốt ở mobile, tablet, desktop (lưới 1 cột trên mobile, 2 cột từ `md`).

---

## 4. Tiêu chí Nghiệm thu & Build (`3-qa-verifier`)

- [ ] `npm run build` hoàn thành với `exit code 0` (hoặc `npm run agy:qa`).
- [ ] `git diff --stat` chỉ gồm các file: `BentoSection.jsx`, `vignette/UIVignette.jsx`, `useActiveVignette.js` và CSS keyframes liên quan. Không đụng `src/pages/**` ngoài nếu thật sự cần.
- [ ] Không import JSON trực tiếp trong `src/pages/**` và `src/components/**`.
- [ ] Không có thẻ `<video>`, không có asset ảnh mới, bundle tăng không quá ~10 KB gzip.
- [ ] Mỗi lúc chỉ 1 vignette chạy animation (kiểm tra bằng DevTools hoặc quan sát).
- [ ] Với `prefers-reduced-motion`, không có animation chạy.
- [ ] Không có CLS do vignette. Không có warning console nghiêm trọng.
- [ ] Dữ liệu minh họa không chứa PII hoặc số liệu nhạy cảm.

---

## 5. Hướng dẫn giao cho model tier 2

- Đọc spec này, `.agents/skills/ui-component-rules/SKILL.md` và `.agents/skills/behavioral-product-design/SKILL.md`.
- Làm tuần tự: (1) hook `useActiveVignette`, (2) một vignette mẫu `word`, chạy thử, (3) ba vignette còn lại, (4) tích hợp vào `BentoSection`, (5) `npm run build`, (6) đối chiếu `git status -s` và `git diff --stat`.
- Cập nhật tiến độ tại `.agents/state/current_task.md`.
- Ngoài phạm vi: Hero, trang khác, video, thư viện mới.
