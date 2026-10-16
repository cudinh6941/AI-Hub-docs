---
id: FEAT-003
title: "Nâng cấp Video Learning Hub & Tích hợp YouTube Player Đa Tương Tác"
status: shipped
priority: high
target_agents:
  - 1-data-architect
  - 2-ui-developer
  - 3-qa-verifier
created: 2026-10-16
tags:
  - feature
  - video
  - youtube
  - interactive-learning
  - schema-fix
---

# [FEAT-003] Nâng Cấp Video Learning Hub & Tích Hợp YouTube Player Đa Tương Tác

> **Tóm tắt giá trị**: Tái cấu trúc toàn diện bảng `videos` trong cơ sở dữ liệu PostgreSQL/PGlite nhằm khắc phục triệt để tình trạng mất trường (lossy seed), đồng thời xây dựng trình phát **YouTube Player Đa Tương Tác** (tự động nhận diện YouTube ID, nhúng `youtube-nocookie.com`, click chapter tua video tức thì) và bộ công cụ **Admin Video Studio** để quản trị video trực tiếp trên giao diện Web.  
> **Trạng thái**: `= this.status` | **Độ ưu tiên**: `= this.priority` | **Ngày tạo**: `= this.created`

---

## 1. Bài toán & Ý tưởng (Brainstorm)
- **Nỗi đau hiện tại (Problem Statement)**:
  - Bảng `videos` trong DDL hiện tại ([`server/db/schema.sql`](file:///d:/AI-Hub-docs/server/db/schema.sql)) bị thiếu hầu hết các trường quan trọng từ [`src/data/videos.json`](file:///d:/AI-Hub-docs/src/data/videos.json) (mất `chapters`, `transcript`, `level`, `tool`, `department`, `durationMinutes`, `accent`, `tags`, `source`). Điều này khiến trang [`VideoPage.jsx`](file:///d:/AI-Hub-docs/src/pages/VideoPage.jsx) bị lỗi hiển thị khi truy xuất từ PostgreSQL.
  - Các video hiện tại đều ở dạng placeholder tĩnh (`source.type: 'placeholder'`), chưa hỗ trợ nhúng video thật từ **YouTube** một cách mượt mà và an toàn.
  - Các mốc thời gian chapters hiện chỉ là danh sách chữ thụ động, người xem không thể bấm vào mốc thời gian (VD: `02:30`) để video tự động tua đến đoạn cần xem.
  - Quản trị viên chưa có giao diện trực quan trên Web để Thêm/Sửa/Xóa video và liên kết các Prompt ID đi kèm.
- **Giải pháp đề xuất (Proposed Solution)**:
  1. **Tái cấu trúc Schema & Dữ liệu (`1-data-architect`)**:
     - Cập nhật DDL bảng `videos` chứa đầy đủ 100% thuộc tính theo chuẩn Enterprise.
     - Viết migration/re-seed nạp trọn vẹn dữ liệu từ [`src/data/videos.json`](file:///d:/AI-Hub-docs/src/data/videos.json) mà không suy hao bất kỳ trường nào.
     - Mở rộng Hono API (`/api/videos`) hỗ trợ đầy đủ các thao tác GET, POST, PUT, DELETE (kèm bảo vệ quyền Admin).
  2. **Trình phát YouTube Đa Tương Tác & Interactive Chapters (`2-ui-developer`)**:
     - Tích hợp YouTube IFrame Player (hỗ trợ `youtube-nocookie.com`, ẩn video liên quan `rel=0`).
     - Tự động bóc tách YouTube ID từ mọi định dạng link (`youtu.be/xxx`, `youtube.com/watch?v=xxx`, `youtube.com/embed/xxx`).
     - Cho phép click vào từng dòng Chapter để video tự động tua (`seekTo`) đến đúng giây mong muốn.
     - Đặt thẻ Prompt liên quan (`DocRecipeCard`) ngay cạnh video kèm nút 1-Click Copy để người học vừa xem vừa thực hành.
  3. **Admin Video Studio (`2-ui-developer`)**:
     - Bổ sung nút **`+ Thêm Video Mới`** trên trang [`LearnPage.jsx`](file:///d:/AI-Hub-docs/src/pages/LearnPage.jsx) và nút **`Sửa` / `Xóa`** trên [`VideoPage.jsx`](file:///d:/AI-Hub-docs/src/pages/VideoPage.jsx) khi đang ở chế độ Admin (`isAdminAuthenticated`).
     - Form cho phép dán link YouTube, tự động lấy thumbnail mặc định của YouTube (`img.youtube.com/vi/{id}/maxresdefault.jpg`), nhập chapters và chọn prompt liên kết.

---

## 2. Thiết kế Dữ liệu & Service (`1-data-architect`)
*Phụ trách: `1-data-architect` (Tier 1: Claude Sonnet / Fallback Gemini Pro)*

### Mô hình Dữ liệu Chi tiết Bảng `videos` (`server/db/schema.sql`):
```sql
CREATE TABLE IF NOT EXISTS videos (
    id VARCHAR(30) PRIMARY KEY,              -- 'VID-001'
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    summary TEXT NOT NULL,
    duration_minutes INTEGER DEFAULT 5,
    level VARCHAR(50) NOT NULL,              -- 'Cơ bản', 'Trung cấp', 'Nâng cao'
    department VARCHAR(100) NOT NULL,        -- 'Ban Giám Đốc', 'Tài chính - Kế toán', 'Chung'...
    tool VARCHAR(100) NOT NULL,              -- 'M365 Copilot', 'Excel Copilot'...
    updated_at VARCHAR(20) NOT NULL,
    accent VARCHAR(100) DEFAULT 'from-indigo-500 to-purple-500',
    source_type VARCHAR(50) DEFAULT 'youtube', -- 'youtube' | 'mp4' | 'embed' | 'placeholder'
    source_url TEXT,
    chapters JSONB NOT NULL DEFAULT '[]'::jsonb,      -- Mảng [{ time: '02:30', title: '...' }]
    transcript TEXT,
    related_prompt_ids JSONB NOT NULL DEFAULT '[]'::jsonb, -- Mảng ['BOD-001']
    tags JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Checklist Nhiệm vụ:
- [ ] Cập nhật [`server/db/schema.sql`](file:///d:/AI-Hub-docs/server/db/schema.sql) và hàm `mapRowToVideo()` trong [`server/db/index.js`](file:///d:/AI-Hub-docs/server/db/index.js).
- [ ] Cập nhật logic seed trong [`server/db/index.js`](file:///d:/AI-Hub-docs/server/db/index.js) để nạp 100% trường dữ liệu từ [`src/data/videos.json`](file:///d:/AI-Hub-docs/src/data/videos.json). Nếu bảng đã tồn tại schema cũ, tự động migrate cột hoặc recreate bảng videos.
- [ ] Bổ sung các endpoints trong [`server/app.js`](file:///d:/AI-Hub-docs/server/app.js):
  - `GET /api/videos/:idOrSlug` (Chi tiết video kèm danh sách `relatedPrompts` đầy đủ).
  - `POST /api/videos` (Tạo video mới — Yêu cầu Admin).
  - `PUT /api/videos/:id` (Cập nhật video — Yêu cầu Admin).
  - `DELETE /api/videos/:id` (Xóa video — Yêu cầu Admin).
- [ ] Cập nhật [`src/services/contentService.js`](file:///d:/AI-Hub-docs/src/services/contentService.js):
  - Hàm `createVideo(payload)`, `updateVideo(id, payload)`, `deleteVideo(id)` có đính kèm admin header.

---

## 3. Thiết kế Giao diện & UI/UX (`2-ui-developer`)
*Phụ trách: `2-ui-developer` (Tier 1: Claude Sonnet / Fallback Gemini Flash)*

### Components & Layout:
- [ ] **Interactive YouTube Player ([`src/pages/VideoPage.jsx`](file:///d:/AI-Hub-docs/src/pages/VideoPage.jsx))**:
  - Viết helper hàm `parseYouTubeId(url)` trích xuất ID video YouTube chính xác.
  - Sử dụng IFrame API với `enablejsapi=1` để điều khiển tua video khi bấm vào mốc chapter (`time: "MM:SS"` đổi ra giây `seekTo(seconds)`).
  - Khi chưa có URL YouTube (vẫn là placeholder), hiển thị giao diện Thumbnail gradient đẹp mắt như hiện tại.
- [ ] **Admin Video Controls**:
  - Trên [`LearnPage.jsx`](file:///d:/AI-Hub-docs/src/pages/LearnPage.jsx): Thêm nút **`+ Thêm Video Mới`** khi `isAdmin === true`.
  - Trên [`VideoPage.jsx`](file:///d:/AI-Hub-docs/src/pages/VideoPage.jsx): Thêm cụm nút **`Chỉnh sửa Video`** và **`Xóa Video`** khi `isAdmin === true`.
- [ ] **Video Form Modal (`src/components/admin/VideoFormModal.jsx`)**:
  - Nhập Tiêu đề, Tóm tắt, Phòng ban, Công cụ, Thời lượng.
  - Ô dán Link YouTube (tự preview thumbnail).
  - Bộ nhập danh sách Chapters linh hoạt (thêm/xóa dòng `time` và `title`).
  - Chọn các Prompt ID liên quan từ danh sách prompts hiện có.
  - Ô nhập Transcript nội dung.

---

## 4. Tiêu chí Nghiệm thu & Build (`3-qa-verifier`)
*Phụ trách: `3-qa-verifier` (Tier 2: Gemini Flash / Fallback Claude Haiku)*

### Acceptance Criteria Checklist:
- [ ] Gọi `GET /api/videos` và `GET /api/videos/:idOrSlug` trả về đầy đủ 100% các trường: `chapters`, `transcript`, `relatedPromptIds`, `source`, `level`, `tool`, `durationMinutes` (không còn bất kỳ trường `undefined` nào).
- [ ] Nhập link YouTube (VD: `https://www.youtube.com/watch?v=dQw4w9WgXcQ` hoặc `https://youtu.be/dQw4w9WgXcQ`), trình phát hiển thị đúng video và phát được.
- [ ] Bấm vào mốc thời gian trong danh sách Chapters (VD: `02:30`) tua chính xác video tới giây 150.
- [ ] Quyền Admin: Thêm/Sửa/Xóa video hoạt động mượt mà; chặn 401 Unauthorized nếu không có passkey.
- [ ] Chạy `npm run agy:qa` (hoặc `npm run build`) hoàn tất với `exit code 0`.


