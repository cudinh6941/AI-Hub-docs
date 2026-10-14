# Workflow: Feature Development & UI Enhancement
**ID**: `wf-feature-development`  
**Pipeline**: `1-data-architect` ➔ `2-ui-developer` ➔ `3-qa-verifier`

---

## Các bước thực thi tự động:

1. **Khảo sát yêu cầu**:
   - Main Orchestrator phân tích yêu cầu tính năng từ User.
   - Xác định: Cần dữ liệu gì mới? Có cần hàm service mới không? Cần component/page nào?

2. **Phase 1: Data & Service (`1-data-architect`)**:
   - Nếu có data model mới: Định nghĩa schema, tạo mock data hoặc cập nhật `src/services/contentService.js`.
   - Đảm bảo interface xuất ra là `Promise` hoặc hook tương thích React 19.

3. **Phase 2: UI Implementation (`2-ui-developer`)**:
   - Viết component hoặc cập nhật trang trong `src/pages/` hoặc `src/components/`.
   - Đảm bảo: Responsive di động, tailwind styling, animation `heroFadeUp` / `animate-gemini-gradient`, icons từ `lucide-react`.

4. **Phase 3: QA Verification (`3-qa-verifier`)**:
   - Chạy `npm run build` trong terminal.
   - Nếu exit code khác 0 ➔ Bắt buộc quay lại Phase tương ứng để sửa lỗi ngay.
   - Nếu exit code = 0 ➔ Hoàn thành, thông báo kết quả cho người dùng.
