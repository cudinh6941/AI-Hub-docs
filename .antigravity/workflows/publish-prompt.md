# Workflow: Ingest & Publish Prompt from Raw Notes
**ID**: `wf-publish-prompt`  
**Pipeline**: `4-content-editor` ➔ `5-content-publisher` ➔ `3-qa-verifier`

---

## Các bước thực thi tự động:

1. **Quét thư mục nháp**:
   - Quét tất cả các file có trong `raw_notes/*.md` hoặc `raw_notes/*.txt`.

2. **Phase 1: Biên tập & Giả lập (`4-content-editor`)**:
   - Tách lọc bài toán, phân loại phòng ban, đặt tiêu đề thu hút.
   - Trích xuất các biến số động dạng `[Tên_Biến]`.
   - Giả lập dữ liệu đầu vào (`inputSample`) và kết quả đầu ra (`outputSample`).
   - Viết phần lý do hiệu quả (`whyEffective`).

3. **Phase 2: Đóng gói & Phát hành (`5-content-publisher`)**:
   - Xác định file đích (`bod.json`, `finance.json`, `hr.json`, `legal.json`, `operations.json`).
   - Sinh ID mới và Slug không trùng lặp.
   - Ghi prompt hoàn chỉnh vào file JSON tương ứng.
   - Di chuyển file nháp đã xử lý vào `raw_notes/archive/` (hoặc dọn dẹp theo yêu cầu).

4. **Phase 3: QA Verification (`3-qa-verifier`)**:
   - Chạy `npm run build` để xác nhận file JSON không bị lỗi cú pháp và được biên dịch chuẩn.
   - Báo cáo URL đường dẫn mới của prompt: `/prompts/:slug`.
