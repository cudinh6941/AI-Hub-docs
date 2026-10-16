---
id: FEAT-XXX
title: "Tên tính năng hoặc nghiệp vụ mới"
status: idea # idea | spec-ready | in-progress | shipped
priority: medium # high | medium | low
target_agents:
  - 1-data-architect
  - 2-ui-developer
  - 3-qa-verifier
created: 2026-10-16
tags:
  - feature
  - spec
---

# [FEAT-XXX] Tên Tính Năng

> **Tóm tắt giá trị**: [Mô tả trong 1-2 câu giá trị mang lại cho người dùng hoặc hệ thống]  
> **Trạng thái**: `= this.status` | **Độ ưu tiên**: `= this.priority` | **Ngày tạo**: `= this.created`

---

## 1. Bài toán & Ý tưởng (Brainstorm)
- **Nỗi đau hiện tại (Problem Statement)**:
  - [Mô tả chi tiết vấn đề gặp phải hiện tại]
- **Giải pháp đề xuất (Proposed Solution)**:
  - [Mô tả giải pháp kiến trúc hoặc tính năng mới]
- **Phạm vi tác động (Scope & User Journey)**:
  - [Trang hoặc component bị ảnh hưởng]
  - [Trải nghiệm người dùng thay đổi như thế nào]

---

## 2. Thiết kế Dữ liệu & Service (`1-data-architect`)
*Phụ trách: `1-data-architect` (Tier 1: Claude Sonnet / Fallback Gemini Pro)*

### Mô hình dữ liệu & Schema:
- [ ] Xác định cấu trúc trường dữ liệu mới hoặc bảng DB liên quan.
- [ ] Đảm bảo tuân thủ chuẩn Enterprise Schema và `data-sanitization`.

### Service Layer (`src/services/contentService.js`):
- [ ] Bổ sung/cập nhật hàm async trong `contentService.js`.
- [ ] Đảm bảo backward compatibility (không gây lỗi cho các trang hiện hữu).
- [ ] Cập nhật kết nối MCP / DB query nếu áp dụng.

---

## 3. Thiết kế Giao diện & UI/UX (`2-ui-developer`)
*Phụ trách: `2-ui-developer` (Tier 1: Claude Sonnet / Fallback Gemini Flash)*

### Components & Layout:
- [ ] Thiết kế/cập nhật component theo chuẩn `ui-component-rules`.
- [ ] Áp dụng đúng Design Tokens (màu sắc, border slate, Gemini Shimmer nếu có).
- [ ] Xử lý đầy đủ 3 trạng thái: `loading`, `empty`, `error`.

### Tương tác & Responsive:
- [ ] Đảm bảo 60fps animations sử dụng GPU (`transform`, `opacity`).
- [ ] Nút tương tác chính (Copy CTA) có phản hồi trực quan (2s timer).
- [ ] Tương thích responsive 100% trên Mobile, Tablet, Desktop.
- [ ] 100% gọi data qua service async / hook `useContent()`, không import JSON trực tiếp.

---

## 4. Tiêu chí Nghiệm thu & Build (`3-qa-verifier`)
*Phụ trách: `3-qa-verifier` (Tier 2: Gemini Flash / Fallback Claude Haiku)*

### Acceptance Criteria Checklist:
- [ ] Kiểm tra toàn vẹn Schema dữ liệu (chạy `scripts/verify-prompts.js` nếu liên quan).
- [ ] Chạy lệnh `npm run build` hoàn thành với `exit code 0`.
- [ ] Đối chiếu `git diff --stat` kiểm tra đúng phạm vi file đã khai báo.
- [ ] Không có dead links, warning console nghiêm trọng hoặc lỗi JSX.
