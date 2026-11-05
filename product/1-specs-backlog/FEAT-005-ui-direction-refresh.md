---
id: FEAT-005
title: "UI Direction Refresh — Thoát khỏi giao diện đại trà"
status: spec-ready # idea | spec-ready | in-progress | shipped
priority: high
target_agents:
  - 6-product-psychologist
  - 2-ui-developer
  - 3-qa-verifier
created: 2026-11-05
tags:
  - feature
  - spec
  - ui
---

# [FEAT-005] UI Direction Refresh

> **Tóm tắt giá trị**: Giữ triết lý tối giản và giảm ma sát, nhưng cho giao diện một cá tính riêng, để AI Hub Docs không còn giống mọi template SaaS/AI khác.
> **Trạng thái**: `spec-ready` (đã chốt hướng ở mục 1.4) | **Độ ưu tiên**: `high` | **Ngày tạo**: 2026-11-05

---

## 0. Audit hiện trạng (nguồn: `HomePage`, `Navbar`, `DocRecipeCard`, `index.css`)

| # | Dấu hiệu đại trà | Bằng chứng trong code | Hướng xử lý |
|---|---|---|---|
| 1 | Công thức "Inter + slate + indigo" | `--font-sans: Inter`, `text-slate-*` mọi nơi, `indigo-600` là accent, `stripe-blue #635BFF` | Đổi cặp font, bảng trung tính ấm, 1 accent riêng |
| 2 | Hero kiểu SaaS mẫu | Badge nhỏ trên cùng, H1 `extrabold`, subhead, ô search, chip "Tìm nhanh", stats strip 3 số; nền `dot-pattern` + `hero-gradient` nhiều màu | Bỏ dot pattern và gradient mesh. Dựng hero bằng typography và khoảng trắng, không dùng trang trí |
| 3 | Mọi section cùng một khuôn | `SectionHeader` (eyebrow indigo + H2 + link) lặp 3 lần, xen kẽ nền `white` / `#FAFAFA`, cùng `py-14` | Đổi nhịp: có section dày, có section thưa, không bắt buộc eyebrow |
| 4 | Card nhồi thông tin | `DocRecipeCard` có 6 lớp: tool + id, verified, title, summary, khung output, chip tham số, rating, lượt dùng, "Chi tiết", nút copy. Vượt quy tắc "dưới 3 nhóm thông tin" của `behavioral-product-design` | Rút còn: tool, title, 1 câu mô tả, nút copy. Phần còn lại chuyển sang tầng 2 (drawer) |
| 5 | Viền và bóng đồng loạt | `border-slate-200/80` + `rounded-xl` + `shadow` ở hầu hết khối | Dùng đường kẻ và khoảng cách thay cho viền. Chỉ giữ viền ở nơi cần tách vùng |
| 6 | Hover mặc định | `hover:scale`, `hover:shadow-md`, đổi màu chữ sang indigo | Một kiểu phản hồi riêng, nhất quán, ví dụ đường gạch chân hoặc dịch chuyển nhẹ |
| 7 | Gemini gradient chữ | `animate-gemini-gradient` (indigo → tím → hồng) là dấu hiệu "AI slop" rõ nhất | Bỏ khỏi UI chung, chỉ để lại ở đúng một điểm chạm nếu thật sự cần |
| 8 | Thông điệp thương hiệu bị chìm | Câu chủ đề "Luôn có cách nhanh hơn để xử lý việc bạn đang làm." không xuất hiện ở hero, thay bằng "Chuẩn hóa tác vụ với AI." | Dùng lại câu North Star làm headline |
| 9 | Đóng hộp quá nhiều (rà soát sau P3) | `FeatureSpotlightBanner` có 4 lớp hộp lồng nhau; `BentoSection` mỗi tile là hộp chứa mockup có viền chứa chip có viền | Tối đa 1 lớp hộp mỗi vùng, chip chỉ là chữ, chia nhóm bằng đường kẻ |
| 10 | Mockup bịa dữ liệu kiểu dashboard | Mã `FIN-001`, `+28.3%`, nhãn đỏ "Vượt định mức", tên file giả | Thay bằng trích đoạn prompt hoặc kết quả mẫu thật |
| 11 | Chuyển động tự chạy | Carousel đổi nội dung mỗi 5 giây (`setInterval`), tia quét, shimmer | Bỏ hoàn toàn, nội dung chỉ đổi khi người dùng bấm |
| 12 | Mũi tên và badge chấm tròn trang trí | `ArrowRight` ở mọi liên kết "Xem tất cả"; badge "• Bắt đầu từ lợi ích thực tế" | Liên kết là chữ gạch chân, bỏ badge |
| 13 | Ô tìm kiếm và nút chuẩn SaaS | Ô input bo góc có nút "Tìm kiếm" nằm trong; chip `Ctrl K` có viền | Ô tìm chỉ còn đường kẻ dưới, Enter để gửi |
| 14 | Bố cục section lặp một khuôn | Tiêu đề xếp dọc rồi lưới card ở mọi section | Bố cục biên tập: tiêu đề cột trái, nội dung cột phải; xen kẽ danh sách và lưới thưa |
| 15 | Chữ quá nhiều ở mọi trang (rà soát sau P3b) | Số chữ ước tính: `AssistantsPage` 964, `FeatureSpotlightBanner` 315, `BentoSection` 263; trang chủ lặp cùng ví dụ ở Bento và Banner | Ngân sách chữ (mỗi section tối đa 1 đoạn 20 từ), bỏ section lặp, thêm đơn vị hình ảnh `BeforeAfter` bằng nội dung thật thay cho đoạn mô tả |

---

## 1. Chiến lược Hành vi & Trải nghiệm (`6-product-psychologist`)

### 1.1. Nguyên tắc giữ nguyên
- Tối giản, điềm tĩnh, không emoji, không `!`, không từ blacklist.
- 3 giây để hiểu, tối đa 3 nhóm thông tin mỗi thẻ, luôn có mẫu để sao chép.

### 1.2. Nguyên tắc thêm mới
- **Một ý tưởng thị giác duy nhất** cho toàn site, dùng nhất quán. Cá tính đến từ sự chắc tay, không từ số lượng hiệu ứng.
- **Typography là nhân vật chính.** Hầu hết sự khác biệt đến từ font, cỡ chữ và nhịp dòng.
- **Một màu nhấn**, dùng ít, có chủ đích (CTA chính, trạng thái đã sao chép, liên kết đang chọn).

### 1.3. Hướng thiết kế đề xuất: "Tài liệu nghiệp vụ được làm kỹ"
Cảm giác của một cuốn sổ tay nghiệp vụ biên tập tốt, không phải dashboard công nghệ.

| Hạng mục | Hiện tại | Đề xuất (cần chốt) |
|---|---|---|
| Font tiêu đề | Inter extrabold | Font serif hiện đại hỗ trợ tiếng Việt (ứng viên: Newsreader, Source Serif 4, Fraunces) |
| Font nội dung | Inter | Giữ sans trung tính (Inter hoặc Geist), chỉ dùng cho body và UI |
| Font code | JetBrains Mono | Giữ |
| Trung tính | slate (xanh lạnh) | Trắng ngà / xám ấm, ví dụ nền `#FBFAF7`, chữ `#1C1B19` |
| Màu nhấn | indigo `#4F46E5` | Một màu riêng, ví dụ đỏ gạch `#C2410C` hoặc xanh rêu đậm. **Cần chốt** |
| Hero | Split 2 cột + mockup + stats | Headline lớn căn trái, ô tìm kiếm, bỏ mockup và stats ở hero |
| Card | Hộp viền + bóng | Danh sách có đường kẻ ngang, mỗi dòng: tool, tiêu đề, mô tả, copy |
| Chuyển động | Fade-up so le + gradient + scan beam | Chỉ giữ fade-up nhẹ khi vào trang và phản hồi nút Copy |

### 1.4. Quyết định đã chốt (2026-11-05, chủ dự án ủy quyền cho Product Architect)
1. **Serif cho tiêu đề: CÓ.** Font `Newsreader` (dự phòng `Source Serif 4`). Body giữ `Inter`.
2. **Màu nhấn: đỏ gạch `#C2410C`** (hover `#9A3412`, nền nhạt `#FFF1E8`). Trạng thái thành công vẫn dùng emerald theo `ui-component-rules` mục 3.
3. **`HeroLiveShowcase`: bỏ khỏi `HomePage`**, giữ nguyên file, không xóa. Stats strip và badge ở hero cũng bỏ.
4. **Headline hero**: dùng lại câu North Star *"Luôn có cách nhanh hơn để xử lý việc bạn đang làm."*
5. **Kiểu hover duy nhất toàn site**: tiêu đề được gạch chân màu nhấn (`underline-offset-4`). Không scale, không shadow.

Kế hoạch thực thi chi tiết cho model tiết kiệm: `.agents/state/FEAT-005-execution-plan.md`.

---

## 2. Thiết kế Dữ liệu & Service (`1-data-architect`)
- Không thay đổi. Phạm vi chỉ gồm tầng trình bày.

---

## 3. Thiết kế Giao diện & UI/UX (`2-ui-developer`)

### Lộ trình theo giai đoạn (mỗi giai đoạn build xanh mới sang giai đoạn sau)
- [ ] **P1 — Nền tảng**: cập nhật design tokens trong `src/index.css` (font, màu, bỏ `dot-pattern`, `hero-gradient`, `animate-gemini-gradient` khỏi dùng chung). Cập nhật `ui-component-rules` mục 1–2 theo hướng đã chốt.
- [ ] **P2 — Khung**: `Navbar`, `AppLayout`, footer.
- [ ] **P3 — Trang chủ**: hero, `BentoSection`, `FeatureSpotlightBanner`, `SectionHeader`.
- [ ] **P4 — Thẻ nội dung**: `DocRecipeCard`, `VideoCard` rút gọn, chuyển chi tiết sang tầng 2.
- [ ] **P5 — Trang trong**: `PromptsPage`, `PromptDetailPage`, `AssistantsPage`, `LearnPage`, `GovernancePage`.

### Ràng buộc
- [ ] Giữ nguyên quy tắc: UI không import JSON, dữ liệu qua `contentService` / `useContent()`.
- [ ] Giữ 3 trạng thái `loading`, `empty`, `error` và nút Copy có phản hồi 2 giây.
- [ ] Animation chỉ dùng `transform` và `opacity`. Tôn trọng `prefers-reduced-motion`.
- [ ] Responsive 100% trên mobile, tablet, desktop.

---

## 4. Tiêu chí Nghiệm thu & Build (`3-qa-verifier`)
- [ ] `npm run build` exit code 0 sau mỗi giai đoạn.
- [ ] `git diff --stat` chỉ nằm trong `src/components`, `src/pages`, `src/index.css` và skill liên quan.
- [ ] Kiểm tra "bài kiểm tra che logo": che logo và tên site, trang vẫn phải nhận ra được là AI Hub Docs.
- [ ] Mỗi thẻ có không quá 3 nhóm thông tin.
- [ ] Không còn gradient đa sắc, dot pattern và hover `scale` ở phần giao diện chung.
