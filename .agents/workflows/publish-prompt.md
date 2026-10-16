---
name: publish-prompt
description: Quy trình tự động biên tập và xuất bản bài prompt mới từ raw_notes
triggers:
  - "/publish"
  - "/ingest"
  - "đăng bài"
  - "xử lý raw_notes"
---

# Workflow: Ingest & Publish Prompt from Raw Notes
**ID**: `wf-publish-prompt`  
**Pipeline**: `4-content-editor` (Tier 2) ➔ `5-content-publisher` (Tier 2) ➔ `3-qa-verifier` (Tier 2)

---

## Các bước thực thi tự động:

1. **Quét thư mục nháp & Git Baseline**:
   - Quét tất cả các file có trong `raw_notes/*.md` hoặc `raw_notes/*.txt` (bỏ qua `README.md` và `archive/`).
   - Chạy `git status -s` để ghi nhận trạng thái ban đầu vào `.agents/state/current_task.md`.

2. **Phase 1: Biên tập & Giả lập (`4-content-editor` - Tier 2: Claude Haiku / Fallback Gemini Flash)**:
   - Tách lọc bài toán, phân loại phòng ban, đặt tiêu đề thu hút.
   - Trích xuất các biến số động dạng `[Tên_Biến]`.
   - Giả lập dữ liệu đầu vào (`inputSample`) và kết quả đầu ra (`outputSample`).
   - Viết phần lý do hiệu quả (`whyEffective`).
   - Áp dụng skill `data-sanitization`.

3. **Phase 2: Đóng gói & Phát hành (`5-content-publisher` - Tier 2: Gemini Flash / Fallback Claude Haiku)**:
   - Xác định file đích (`bod.json`, `finance.json`, `hr.json`, `legal.json`, `operations.json` hoặc Database MCP).
   - Sinh ID mới và Slug không trùng lặp.
   - Ghi prompt hoàn chỉnh vào cơ sở dữ liệu.
   - Di chuyển file nháp đã xử lý vào `raw_notes/archive/`.
   - Kiểm tra `git diff --stat` và tick `[x]` vào `.agents/state/current_task.md`.

4. **Phase 3: QA Verification (`3-qa-verifier` - Tier 2: Gemini Flash / Fallback Claude Haiku)**:
   - Chạy `npm run build` để xác nhận file dữ liệu không bị lỗi cú pháp và được biên dịch chuẩn.
   - Báo cáo URL đường dẫn mới của prompt: `/prompts/:slug`.
