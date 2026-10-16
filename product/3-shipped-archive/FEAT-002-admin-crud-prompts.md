---
id: FEAT-002
title: "Hệ thống Admin CRUD Prompts & Smart R-C-T-C-F Studio (Hono + PostgreSQL/PGlite)"
status: shipped
priority: high
target_agents:
  - 0-meta-architect
  - 1-data-architect
  - 2-ui-developer
  - 3-qa-verifier
created: 2026-10-16
tags:
  - feature
  - crud
  - postgresql
  - pglite
  - hono
  - rctcf-studio
  - sanitization
---

# [FEAT-002] Hệ Thống Admin CRUD Prompts & Smart R-C-T-C-F Studio

> **Tóm tắt giá trị**: Xây dựng hệ thống quản trị Prompt trực quan dành riêng cho Admin trên nền tảng Backend Hono + PostgreSQL (kèm cơ chế tự động fallback về PGlite nhúng khi chưa có `DATABASE_URL`). Tích hợp bộ công cụ **Smart R-C-T-C-F Context Builder**, tự động trích xuất biến `[Biến]` và hàng rào kiểm duyệt dữ liệu nhạy cảm (**Real-time PII Guardrail**) ngay trên giao diện trước khi lưu trữ.  
> **Trạng thái**: `= this.status` | **Độ ưu tiên**: `= this.priority` | **Ngày tạo**: `= this.created`

---

## 1. Bài toán & Ý tưởng (Brainstorm)
- **Nỗi đau hiện tại (Problem Statement)**:
  - Kho dữ liệu hiện tại là Read-only từ các file JSON tĩnh, gây bất tiện khi Admin muốn thêm mới, cập nhật nội dung hoặc xóa các Prompt lỗi thời trực tiếp trên giao diện Web.
  - Người dùng và cả Admin thường gặp khó khăn trong việc đưa đầy đủ ngữ cảnh (Context) theo chuẩn 5 thành tố **R-C-T-C-F** và lười nhập tay đủ 17 trường dữ liệu của Enterprise Schema.
  - Rủi ro bảo mật nếu cho phép chỉnh sửa trực tiếp mà thiếu bước kiểm duyệt dữ liệu nhạy cảm (`data-sanitization`: lộ Email nội bộ, SĐT, IP, số liệu tài chính thực tế).
- **Giải pháp đề xuất (Proposed Solution)**:
  1. **Kiến trúc Backend Hono + Dual PostgreSQL Engine**:
     - Xây dựng tầng API Backend (`server/`) bằng **Hono** tích hợp trực tiếp vào chu trình chạy của Vite (`vite.config.js` middleware / dev server) và sẵn sàng chạy độc lập khi deploy.
     - **Chế độ kết nối PostgreSQL thông minh (`server/db/index.js`)**:
       - **Ưu tiên 1 (`process.env.DATABASE_URL`)**: Nếu có biến môi trường `DATABASE_URL`, kết nối tới PostgreSQL Server thực tế (Local port 5432 hoặc Cloud Postgres như Supabase/Neon) qua driver `pg`.
       - **Ưu tiên 2 (Auto-Fallback PGlite)**: Nếu không có `DATABASE_URL` hoặc port 5432 đang đóng, tự động khởi chạy **PGlite** (`@electric-sql/pglite`) lưu trữ bền vững ngay trong thư mục dự án (`./database/pgdata`). Tự động chạy DDL khởi tạo bảng và seed toàn bộ 16 prompts + videos từ JSON gốc trong lần chạy đầu tiên.
  2. **Phân quyền Admin (Admin Auth Guard)**:
     - Người dùng thông thường truy cập Web ở chế độ Read-only 100%.
     - Chỉ khi đăng nhập Admin (qua cổng Admin Modal xác thực với `/api/auth/login` bằng `ADMIN_PASSKEY` hoặc tài khoản Admin) thì các nút **`+ Tạo Prompt Mới`**, **`Chỉnh sửa`**, **`Xóa`** mới hiển thị và gọi được các API `POST / PUT / DELETE`.
  3. **Smart R-C-T-C-F Studio & Real-time Sanitization Guardrail**:
     - Hỗ trợ chế độ nhập liệu **Guided R-C-T-C-F Builder** (gợi ý 5 ô: *Role, Context, Task, Constraints, Format* rồi tự động tổng hợp thành `promptTemplate`).
     - **Auto-Variable Extractor**: Tự động quét mọi cụm `[Tên_Biến]` trong `promptTemplate` để sinh danh sách cấu hình `variables`.
     - **Real-time PII Guardrail**: Quét trực tiếp trên Form và tại tầng API Middleware theo bộ quy tắc `data-sanitization` (phát hiện SĐT, Email thật, IP nội bộ) kèm nút **"Ẩn danh tự động (Auto-Sanitize)"**.

---

## 2. Thiết kế Dữ liệu & Service (`1-data-architect`)
*Phụ trách: `1-data-architect` (Tier 1: Claude Sonnet / Fallback Gemini Pro)*

### Mô hình dữ liệu PostgreSQL (`server/db/schema.sql`):
- [ ] Chuẩn hóa bảng `departments`, `prompts` (đầy đủ 17 trường Enterprise Schema, dùng kiểu `JSONB` cho `variables` và `tags`), và `videos`.
- [ ] Xây dựng `server/db/index.js` hỗ trợ giao diện truy vấn đồng nhất giữa `pg` (khi có `DATABASE_URL`) và `@electric-sql/pglite` (lưu tại `./database/pgdata`).
- [ ] Xây dựng module tự động Seed dữ liệu (`server/db/seed.js`) nạp 16 prompts từ 5 file JSON và danh sách videos nếu bảng `prompts` đang trống, đồng thời có hàm đồng bộ ngược về JSON hoặc xuất bản.

### Backend API (`server/index.js` & `src/services/`):
- [ ] Các endpoints RESTful trên Hono:
  - `GET /api/prompts` (Lấy danh sách prompts, lọc theo department).
  - `GET /api/prompts/:idOrSlug` (Lấy chi tiết prompt theo ID hoặc Slug).
  - `POST /api/auth/verify` (Xác thực quyền Admin qua header `x-admin-key` / passkey).
  - `POST /api/prompts` (Tạo mới prompt — Yêu cầu quyền Admin + vượt qua `sanitizationGuard` & `validatePrompt`).
  - `PUT /api/prompts/:id` (Cập nhật prompt — Yêu cầu quyền Admin + kiểm duyệt PII).
  - `DELETE /api/prompts/:id` (Xóa prompt — Yêu cầu quyền Admin).
- [ ] Tạo `src/services/sanitizationService.js`: Hàm quét phát hiện PII (`scanSensitiveData(text)`) và tự động làm sạch (`autoSanitizeText(text)`), dùng chung cho cả UI và Server.
- [ ] Tạo `src/services/authService.js`: Quản lý trạng thái đăng nhập Admin (`loginAdmin`, `logoutAdmin`, `isAdminAuthenticated`, `getAdminHeaders`).
- [ ] Cập nhật `src/services/contentService.js`:
  - Giữ nguyên 100% chữ ký các hàm đọc hiện có (`getPrompts`, `getAllPrompts`, `getPromptById`, `getPromptBySlug`, `getPromptsByDepartment`, `getHomeData`) gọi qua `/api/prompts` (kèm fallback an toàn về dữ liệu tĩnh nếu chạy môi trường build tĩnh).
  - Bổ sung các hàm async CRUD: `createPrompt(payload)`, `updatePrompt(id, payload)`, `deletePrompt(id)`.

---

## 3. Thiết kế Giao diện & UI/UX (`2-ui-developer`)
*Phụ trách: `2-ui-developer` (Tier 1: Claude Sonnet / Fallback Gemini Flash)*

### Components & Layout:
- [ ] **Admin Access Toggle / Modal (`src/components/admin/AdminAuthModal.jsx`)**: Nút biểu tượng ổ khóa tinh tế trên `Header.jsx` cho phép bật chế độ Quản trị viên (Admin Mode).
- [ ] **Smart Prompt Studio Modal / Drawer (`src/components/admin/PromptFormModal.jsx`)**:
  - Hỗ trợ cả **Tạo mới (Create)** và **Chỉnh sửa (Edit)**.
  - Chế độ **R-C-T-C-F Context Assistant**: Cho phép nhập theo 5 gợi ý thành tố (*Vai trò, Bối cảnh, Nhiệm vụ, Ràng buộc, Định dạng*) để ghép tự động vào `promptTemplate`, hoặc sửa trực tiếp `promptTemplate`.
  - Tự động sinh mã ID (`BOD-00X`, `FIN-00X`...) và `slug` theo tiêu đề + phòng ban.
  - Tự động bóc tách các biến `[Biến]` từ `promptTemplate` thành bảng chỉnh sửa `variables` (`name`, `label`, `placeholder`).
  - Cảnh báo trực quan thời gian thực nếu phát hiện PII (Email thật, SĐT, IP nội bộ) và nút **Auto-Sanitize** 1-click.
- [ ] **Tích hợp nút điều khiển Admin trên UI**:
  - Trên `PromptsPage.jsx`: Hiển thị nút **`+ Thêm Prompt Mới`** khi đang ở chế độ Admin.
  - Trên `PromptDetailPage.jsx` (và thẻ Prompt): Hiển thị nút **`Chỉnh sửa`** và **`Xóa`** (có hộp thoại xác nhận trước khi xóa).

### Tương tác & Responsive:
- [ ] Đảm bảo 60fps animations sử dụng GPU (`transform`, `opacity`), tuân thủ `ui-component-rules`.
- [ ] Tương thích responsive 100% trên Mobile, Tablet, Desktop.
- [ ] 100% gọi data qua `src/services/contentService.js`, `src/services/authService.js`, `src/services/sanitizationService.js` (tuyệt đối không import JSON trực tiếp trong UI).

---

## 4. Tiêu chí Nghiệm thu & Build (`3-qa-verifier`)
*Phụ trách: `3-qa-verifier` (Tier 2: Gemini Flash / Fallback Claude Haiku)*

### Acceptance Criteria Checklist:
- [ ] Khi không cấu hình `DATABASE_URL` (port 5432 đóng), hệ thống tự động khởi chạy **PGlite** tại `./database/pgdata` và nạp đủ 16/16 prompts ban đầu mà không báo lỗi.
- [ ] Khi có `DATABASE_URL`, hệ thống tự động ưu tiên kết nối qua PostgreSQL (`pg`).
- [ ] Kiểm tra API & UI CRUD: Tạo mới, sửa, xóa prompt khi có quyền Admin hoạt động tức thì; chặn `401 Unauthorized` nếu không có quyền Admin.
- [ ] Kiểm tra hàng rào `data-sanitization`: Phát hiện chính xác SĐT/Email/IP nhạy cảm trên Form và chặn lưu nếu chưa ẩn danh.
- [ ] Chạy `scripts/verify-prompts.js` và `npm run build` hoàn thành với `exit code 0`.

