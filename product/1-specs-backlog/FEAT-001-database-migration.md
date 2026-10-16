---
id: FEAT-001
title: "Chuyển đổi dữ liệu Prompts từ JSON tĩnh sang Database chuẩn hóa (SQLite/PostgreSQL)"
status: spec-ready
priority: high
target_agents:
  - 0-meta-architect
  - 1-data-architect
  - 2-ui-developer
  - 3-qa-verifier
created: 2026-10-16
tags:
  - feature
  - database
  - migration
  - mcp
---

# [FEAT-001] Chuyển Đổi Dữ Liệu Prompts Từ JSON Tĩnh Sang Database Chuẩn Hóa

> **Tóm tắt giá trị**: Thay thế kho dữ liệu file JSON tĩnh (`src/data/prompts/*.json`) bằng cơ sở dữ liệu quan hệ chuẩn hóa (hỗ trợ SQLite cục bộ và PostgreSQL qua MCP Server), tăng tốc độ truy vấn, bảo đảm toàn vẹn dữ liệu ACID và cho phép các Agent truy vấn/ghi dữ liệu thời gian thực.  
> **Trạng thái**: `= this.status` | **Độ ưu tiên**: `= this.priority` | **Ngày tạo**: `= this.created`

---

## 1. Bài toán & Ý tưởng (Brainstorm)
- **Nỗi đau hiện tại (Problem Statement)**:
  - Hiện tại, 16 bài toán prompt được lưu rải rác trong 5 file JSON tĩnh (`bod.json`, `finance.json`, `hr.json`, `legal.json`, `operations.json`).
  - Khi Subagent `5-content-publisher` thêm prompt mới, agent phải đọc toàn bộ file JSON, chèn mảng, tính toán lại ID bằng regex, và format lại file trên đĩa. Điều này dễ gây xung đột Git (merge conflict) hoặc lỗi cú pháp JSON.
  - Không thể thực hiện truy vấn phức tạp (tìm kiếm đa tiêu chí, đếm thống kê động, phân trang offset/limit, quan hệ Prompt - Video).
- **Giải pháp đề xuất (Proposed Solution)**:
  - Chuẩn hóa Schema quan hệ gồm 3 bảng: `departments`, `prompts`, và `videos`.
  - Hỗ trợ 2 chế độ:
    1. **SQLite cục bộ** (`src/data/ai_hub.db`): Nhẹ, không cần cài server, hoàn toàn tự chạy trên máy trạm của người dùng.
    2. **PostgreSQL MCP**: Thông qua `.agents/mcp_config.json` để các subagents (`1-data-architect`, `5-content-publisher`) dùng tool MCP (`read_query`, `execute_query`).
  - Giữ nguyên 100% chữ ký hàm async trong `src/services/contentService.js` (`getAllPrompts`, `getPromptById`, `getPromptBySlug`, `getPromptsByDepartment`, `getHomeData`) để tầng UI không bị xáo trộn.

---

## 2. Thiết kế Dữ liệu & Service (`1-data-architect`)
*Phụ trách: `1-data-architect` (Tier 1: Claude Sonnet / Fallback Gemini Pro)*

### Mô hình Dữ liệu Chi tiết (DDL):

#### Bảng `departments`:
```sql
CREATE TABLE IF NOT EXISTS departments (
    id VARCHAR(50) PRIMARY KEY,          -- 'bod', 'finance', 'hr', 'legal', 'operations'
    name VARCHAR(100) NOT NULL,          -- 'Ban Giám Đốc', 'Tài chính - Kế toán', ...
    prefix VARCHAR(10) NOT NULL UNIQUE,  -- 'BOD', 'FIN', 'HR', 'LEG', 'OPS'
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Bảng `prompts`:
```sql
CREATE TABLE IF NOT EXISTS prompts (
    id VARCHAR(20) PRIMARY KEY,          -- 'FIN-001', 'BOD-002', ...
    department_id VARCHAR(50) REFERENCES departments(id),
    department VARCHAR(100) NOT NULL,    -- Denormalized for rapid query display
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    tool VARCHAR(100) NOT NULL,          -- 'M365 Copilot', 'Excel Copilot', ...
    difficulty VARCHAR(50) NOT NULL,     -- 'Cơ bản', 'Trung cấp', 'Nâng cao'
    verified BOOLEAN DEFAULT TRUE,
    rating NUMERIC(3, 1) DEFAULT 5.0,
    copy_count INTEGER DEFAULT 0,
    updated_at VARCHAR(20),              -- 'YYYY-MM-DD'
    summary TEXT NOT NULL,
    prompt_template TEXT NOT NULL,       -- Câu lệnh 5 thành tố RCTCF có biến [Biến]
    variables JSON NOT NULL,             -- Mảng [{name, label, placeholder, description}]
    why_effective TEXT NOT NULL,         -- Phân tích kỹ thuật lý do hiệu quả
    input_sample TEXT NOT NULL,          -- Dữ liệu đầu vào mẫu Before
    output_sample TEXT NOT NULL,         -- Kết quả giả lập mẫu After
    tags JSON NOT NULL,                  -- Mảng tags ["tag1", "tag2"]
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_prompts_slug ON prompts(slug);
CREATE INDEX IF NOT EXISTS idx_prompts_dept ON prompts(department_id);
```

#### Bảng `videos`:
```sql
CREATE TABLE IF NOT EXISTS videos (
    id VARCHAR(20) PRIMARY KEY,          -- 'VID-001'
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    duration VARCHAR(50),
    thumbnail TEXT,
    video_url TEXT,
    summary TEXT,
    related_prompt_ids JSON              -- Mảng ['FIN-001', 'FIN-002']
);
```

### Checklist Nhiệm vụ Thực thi:
- [ ] Viết script khởi tạo cơ sở dữ liệu và DDL schema: `scripts/init-db.js`.
- [ ] Viết script nạp dữ liệu di chuyển (ETL/Migration): `scripts/migrate-to-db.js` đọc 5 file JSON trong `src/data/prompts/` và `src/data/videos.json`, nạp đầy đủ 100% 16 prompts vào database mà không suy hao trường nào.
- [ ] Cập nhật `src/services/contentService.js` hỗ trợ adapter DB:
  - Đọc từ DB (SQLite / API) nếu database file tồn tại.
  - Fallback về JSON tĩnh dự phòng nếu DB chưa được khởi tạo (Zero-downtime transition).
- [ ] Cập nhật cấu hình `.agents/mcp_config.json` liên kết trực tiếp đường dẫn file DB `./src/data/ai_hub.db`.

---

## 3. Thiết kế Giao diện & UI/UX (`2-ui-developer`)
*Phụ trách: `2-ui-developer` (Tier 1: Claude Sonnet / Fallback Gemini Flash)*

### Checklist Tương thích & Bảo toàn Giao diện:
- [ ] Kiểm tra toàn bộ các trang: `HomePage.jsx`, `PromptsPage.jsx`, `PromptDetailPage.jsx`, `LearnPage.jsx`, `VideoPage.jsx`.
- [ ] Đảm bảo 100% components tiếp tục sử dụng hook `useContent()` gọi qua `contentService.js`.
- [ ] Đảm bảo giữ nguyên các hiệu ứng micro-animations, styling Tailwind v4 và các trạng thái nút Copy (2s timer).
- [ ] Kiểm tra trạng thái tải (`loading skeleton`) hiển thị mượt mà khi dữ liệu truy xuất từ DB bất đồng bộ.

---

## 4. Tiêu chí Nghiệm thu & Build (`3-qa-verifier`)
*Phụ trách: `3-qa-verifier` (Tier 2: Gemini Flash / Fallback Claude Haiku)*

### Acceptance Criteria Checklist:
- [ ] Số lượng bản ghi sau migration: Đúng 16/16 prompts và 100% video từ file gốc.
- [ ] Toàn vẹn cấu trúc R-C-T-C-F: Tất cả các biến số `[Biến]` và input/output sample còn nguyên vẹn 100%.
- [ ] Kiểm tra API service: Hàm `getAllPrompts()`, `getPromptById('FIN-001')`, `getPromptBySlug(...)` trả về kết quả chính xác.
- [ ] Chạy lệnh `npm run agy:qa`: Toàn bộ kiểm tra schema và lệnh `npm run build` vượt qua với `exit code 0`.
- [ ] Báo cáo nghiệm thu kiểm thử kèm đối chiếu `git diff --stat`.
