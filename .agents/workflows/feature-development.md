---
description: Quy trình tự động phát triển tính năng mới và tinh chỉnh giao diện người dùng
---

# Workflow: Feature Development & UI Enhancement
**ID**: `wf-feature-development`  
**Pipeline**: `6-product-psychologist` (Tier 1) ➔ `1-data-architect` (Tier 1) ➔ `2-ui-developer` (Tier 1) ➔ `3-qa-verifier` (Tier 2)

---

## Các bước thực thi tự động:

1. **Khảo sát yêu cầu & Git Baseline**:
   - Main Orchestrator phân tích yêu cầu tính năng từ User.
   - Chạy `git status -s` để ghi nhận trạng thái ban đầu vào `.agents/state/current_task.md`.
   - Xác định: Cần dữ liệu gì mới? Có cần hàm service mới trong `src/services/contentService.js` không? Cần component/page nào?

2. **Phase 0: Behavioral Strategy & Apple UX Spec (`6-product-psychologist` - Tier 1: Claude Opus / Fallback Claude Sonnet)**:
   - Áp dụng skill `behavioral-product-design` để thiết kế điểm chạm nhận diện (Quiet Recognition), luồng giảm ma sát (Zero Friction) và cấu trúc bóc tách thông tin (Progressive Disclosure).
   - Chốt toàn bộ câu chữ mẫu (Headline, Subhead, CTA) theo tinh thần điềm tĩnh, sạch sẽ kiểu Apple (cấm emoji rác, cấm từ ngữ đa cấp) vào bản vẽ Spec trong `product/1-specs-backlog/`.
   - Kiểm tra `git diff --stat` và tick `[x]` vào `.agents/state/current_task.md`.

3. **Phase 1: Data & Service (`1-data-architect` - Tier 1: Claude Sonnet / Fallback Gemini Pro)**:
   - Nếu có data model mới: Định nghĩa schema, tạo mock data hoặc cập nhật `src/services/contentService.js`.
   - Đảm bảo interface xuất ra là `Promise` async tương thích React 19.
   - Kiểm tra `git diff --stat` và tick `[x]` vào `.agents/state/current_task.md`.

4. **Phase 2: UI Implementation (`2-ui-developer` - Tier 1: Claude / Fallback Gemini Flash)**:
   - Viết component hoặc cập nhật trang trong `src/pages/` hoặc `src/components/` bám sát bản thiết kế hành vi và câu chữ từ Phase 0.
   - Đảm bảo 100% UI gọi dữ liệu qua `src/services/contentService.js` hoặc hook `useContent()`.
   - Đảm bảo: Responsive di động, tailwind styling, GPU micro-animations, icons từ `lucide-react`.
   - Kiểm tra `git diff --stat` và tick `[x]` vào `.agents/state/current_task.md`.

5. **Phase 3: QA Verification (`3-qa-verifier` - Tier 2: Gemini Flash / Fallback Claude Haiku)**:
   - Chạy `npm run build` và lint trong terminal.
   - Nếu exit code khác 0 ➔ Bắt buộc quay lại Phase tương ứng để sửa lỗi ngay.
   - Nếu exit code = 0 ➔ Hoàn thành, thông báo kết quả cho người dùng.