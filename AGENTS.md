# AI Hub Docs — Workspace Agent Guidelines & Orchestration Rules

Tài liệu này chứa các quy tắc điều phối và quy ước cốt lõi cho AI Hub Docs (`d:/AI-Hub-docs`).
Chi tiết hệ sinh thái Multi-Agent, ma trận Model Tiering và SOP kỹ năng được lưu trữ tại `.agents/`.
Toàn bộ bản vẽ thiết kế tính năng và lộ trình R&D được quản lý tại thư mục `product/`.

---

## 1. Hệ Thống Subagents & Model Tiering
- **Tier 1 (High Reasoning - Claude Opus / Sonnet)**:
  - `0-meta-architect`: Thiết kế kiến trúc agent, mở rộng nhân sự AI & SOP.
  - `6-product-psychologist`: Nghiên cứu tâm lý học hành vi, thiết kế chiến lược tính năng, bố cục thị giác & giọng văn tối giản chuẩn Apple.
  - `1-data-architect`: Mô hình hóa Schema dữ liệu, quản lý tầng Service trừu tượng, tích hợp Database MCP/ORM.
  - `2-ui-developer`: Kỹ sư Frontend & UI/UX, chỉ đọc dữ liệu qua `src/services/contentService.js`.
- **Tier 2 (Fast & High Quota - Claude Haiku / Gemini Flash)**:
  - `3-qa-verifier`: Automated tester & build verifier (`npm run build`, schema check, return exit 0/1).
  - `4-content-editor`: Chuẩn hóa prompt R-C-T-C-F, tách biến `[Biến]`, giả lập kết quả Before/After.
  - `5-content-publisher`: Đóng gói dữ liệu JSON/Database, sinh ID/slug, lưu trữ file nháp.

---

## 2. Quy Tắc Bắt Buộc
1. **Nguồn Sự Thật Thiết Kế (`product/`)**: Mọi tính năng lớn bắt buộc phải có bản vẽ Spec tại `product/1-specs-backlog/` theo đúng template `product/_templates/feature-spec-template.md` trước khi kích hoạt viết code.
2. **Tầng UI Thuần Khiết**: Tuyệt đối không import trực tiếp file JSON trong `src/pages/**` và `src/components/**`. Toàn bộ dữ liệu phải truy xuất thông qua các hàm async trong `src/services/contentService.js` hoặc hook `useContent()`.
3. **Đối Chiếu Git State Thực Tế**: Trước và sau mỗi tác vụ, phải đối chiếu `git status -s` và `git diff --stat` thay vì chỉ đánh dấu `[x]` giả lập.
4. **Stateless Scratchpad & Failover**: Tiến độ được đồng bộ tại `.agents/state/current_task.md`. Khi chạm lỗi 429 / Quota, tự động failover sang model dự phòng khác họ và tiếp tục từ bước dở dang.
5. **Gatekeeper QA**: Mọi thay đổi phải vượt qua `npm run agy:qa` (hoặc `npm run build`) thành công trước khi hoàn tất.
6. **Data Sanitization**: Loại bỏ 100% PII, email và số liệu nhạy cảm trước khi lưu trữ vào cơ sở dữ liệu.
