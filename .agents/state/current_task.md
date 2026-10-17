# Task Scratchpad & Stateless Hand-off State
**Trạng thái**: SPEC_READY (Sẵn sàng thực thi Phase 1, 2, 3 cho phiên tối)  
**Cập nhật lần cuối**: 2026-10-17 16:22:00  
**Agent phụ trách**: `6-product-psychologist` (Product Strategist & Behavioral UX Architect)  
**Tệp Spec hoàn chỉnh**: `product/1-specs-backlog/FEAT-004-ai-feature-spotlight.md`  
**Git Baseline**: 75bbbc6  

---

## 1. Mục tiêu Tác vụ Hiện tại (Current Goal)
- Hoàn thiện Bản vẽ Thiết kế Spec & Kế hoạch Thực thi cho **[FEAT-004] AI Feature Spotlight & Advanced Workflows** theo kiến trúc đã được phê duyệt:
  1. **Bento Visual Tiles ngoài Trang chủ (`src/components/FeatureSpotlightBento.jsx`)**: Rất ít chữ, giàu tính thị giác chuẩn Apple, bố cục Bento Grid 4 ô đặt ngay dưới Hero section. Mỗi ô chứa đúng 3 thành phần (Nhãn công cụ nhỏ gọn, Câu Title ngắn sắc 8–12 chữ, Mini UI Visual Preview dựng bằng CSS/Tailwind). Bấm vào chuyển hướng sang `/guides/:slug`.
  2. **Trang Chi Tiết Tiện Ích (`src/pages/GuideDetailPage.jsx` — `/guides/:slug`)**: Bố cục 5 phần thoáng đãng, tách biệt hoàn toàn với trang Prompt:
     - Phần 1: Định nghĩa bản chất & Sơ đồ cơ chế hoạt động 3 khối (`Lớp cài cố định 1 lần` + `Lớp làm việc mỗi ngày` = `Đầu ra chuẩn`).
     - Phần 2: So sánh trực diện (Chat thường vs Bật tính năng) & 3 Kịch bản doanh nghiệp theo phòng ban.
     - Phần 3: Quy trình tích hợp 3 bước kèm gợi ý vị trí nút bấm và danh mục file cần chuẩn bị.
     - Phần 4: Bộ khung cài đặt mẫu (`starterBlueprint`), nút Sao chép phản hồi 2s, nút Mở công cụ thực hành.
     - Phần 5: Hộp nhắc an toàn dữ liệu công ty và 2–3 thẻ Prompt (`DocRecipeCard`) dùng phối hợp.
  3. **Trang Danh mục Tiện Ích (`src/pages/GuidesPage.jsx` — `/guides`)**: Danh mục toàn bộ 6 tiện ích AI nâng cao.

---

## 2. Kế hoạch Thực thi Từng bước cho Phiên Tối (Execution Plan)

- [x] **Phase 0: Chiến lược Trải nghiệm & Soạn thảo Spec (`6-product-psychologist`)** - *ĐÃ HOÀN TẤT*
  - [x] Soạn thảo `product/1-specs-backlog/FEAT-004-ai-feature-spotlight.md` (`status: spec-ready`).
  - [x] Định nghĩa kiến trúc Bento Visual Tiles ngoài Home và Trang Chi Tiết 5 phần.
  - [x] Thiết lập chuẩn mực micro-copy chuẩn Apple (0 emoji rác, 0 từ ngữ phóng đại, 0 dấu chấm than).
  - [x] Cập nhật `.agents/state/current_task.md` sang trạng thái `SPEC_READY`.

- [ ] **Phase 1: Dữ liệu & Service Layer (`1-data-architect`)** - *DÀNH CHO PHIÊN TỐI*
  - [ ] Bổ sung bảng `guides` vào `server/db/schema.sql` (hỗ trợ cả PostgreSQL & PGlite).
  - [ ] Tạo tệp dữ liệu tĩnh `src/data/guides.json` với 6 bản ghi chuẩn mực doanh nghiệp (Gemini Gems, ChatGPT Projects, NotebookLM, Canvas, M365 Copilot BizChat, Claude Projects).
  - [ ] Cập nhật `server/db/index.js`: Khai báo mapper `mapRowToGuide`, thêm logic tự động seed 6 tiện ích vào database khi khởi động.
  - [ ] Cập nhật `server/app.js`: Bổ sung 2 endpoints `GET /api/guides` (hỗ trợ `?featured=true`) và `GET /api/guides/:idOrSlug` (kết hợp `relatedPrompts`).
  - [ ] Cập nhật `src/services/contentService.js`: Bổ sung `getGuides()`, `getFeaturedGuides()`, `getGuideBySlug(slug)` kèm fallback tĩnh.

- [ ] **Phase 2: Giao diện & Trải nghiệm UI/UX (`2-ui-developer`)** - *DÀNH CHO PHIÊN TỐI*
  - [ ] Xây dựng `src/components/FeatureSpotlightBento.jsx` chuẩn Bento Visual Tiles với Mini UI Visual Preview cho 4 tiện ích nổi bật.
  - [ ] Xây dựng `src/pages/GuideDetailPage.jsx` theo cấu trúc 5 phần thoáng đãng, tích hợp nút sao chép cấu hình mẫu (timer 2s) và lưới gợi ý prompt liên quan.
  - [ ] Xây dựng `src/pages/GuidesPage.jsx` liệt kê đầy đủ 6 tiện ích AI kèm bộ lọc nền tảng.
  - [ ] Cập nhật `src/App.jsx`: Khai báo 2 routes `/guides` và `/guides/:slug`.
  - [ ] Cập nhật `src/pages/HomePage.jsx`: Nhúng `FeatureSpotlightBento` ngay dưới Hero section.

- [ ] **Phase 3: Kiểm thử, Thẩm định & Nghiệm thu (`3-qa-verifier`)** - *DÀNH CHO PHIÊN TỐI*
  - [ ] Tạo tệp script `scripts/verify-guides.js` kiểm định: Schema đầy đủ 5 phần, 0 emoji rác, 0 từ phóng đại đa cấp, 0 dấu chấm than (`!`).
  - [ ] Chạy `node scripts/verify-guides.js` đạt Exit Code 0.
  - [ ] Chạy `npm run build` xác nhận Vite build production thành công không lỗi (Exit Code 0).
  - [ ] Chạy `git diff --stat` đối chiếu phạm vi chỉnh sửa.
  - [ ] Di chuyển Spec sang `product/3-shipped-archive/` và cập nhật roadmap sau khi hoàn tất.

---

## 3. Checklist Bàn Giao Nhanh Cho User
1. Máy ở nhà chỉ cần pull git mới nhất hoặc mở workspace `D:\AI-Hub-docs`.
2. Khởi chạy dev server: `npm run dev`.
3. Phân công Subagents tiếp theo chạy lần lượt: `1-data-architect` ➔ `2-ui-developer` ➔ `3-qa-verifier`.
