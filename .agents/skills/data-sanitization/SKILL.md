---
name: data-sanitization
description: Quy trình kiểm duyệt và ẩn danh dữ liệu nhạy cảm (PII, bí mật kinh doanh, IP, số liệu tài chính) trước khi xuất bản lên AI Hub Docs.
triggers:
  - "/sanitize"
  - "/data-sanitization"
  - "kiểm duyệt dữ liệu"
  - "ẩn danh pii"
---

# Skill: Data Sanitization & Anonymization Standard

Skill này đóng vai trò là hàng rào phòng ngự bảo mật (Governance Guardrail). Mọi bài viết, prompt mẫu, hình ảnh hoặc ví dụ đầu vào/đầu ra (`inputSample`, `outputSample`) đều **BẮT BUỘC** phải trải qua quy trình rà soát này trước khi đưa vào cơ sở dữ liệu chính thức.

---

## 1. Danh mục Dữ liệu Nhạy cảm Bắt buộc Ẩn danh (Red-Flag Data)

Tuyệt đối **KHÔNG ĐƯỢC PHÉP** xuất hiện các thông tin sau trên AI Hub Docs:

| Loại thông tin | Ví dụ thực tế cần loại bỏ | Cách xử lý thay thế |
| :--- | :--- | :--- |
| **Thông tin cá nhân (PII)** | Họ tên thật (Nguyễn Văn A), CMND/CCCD, Số điện thoại cá nhân | Thay bằng: `[Họ_và_Tên_Ứng_Viên]`, `Nguyễn Văn A (Mẫu)` |
| **Tên đơn vị & Đối tác** | Tên công ty đối tác cụ thể, khách hàng VIP, nhà cung cấp thật | Thay bằng: `Công ty TNHH ABC`, `Khách hàng X`, `Tập đoàn M` |
| **Email & Liên lạc** | `nam.nguyen@congty.com.vn`, link chat Zalo riêng | Thay bằng: `user@example.com`, `contact@company.vn` |
| **Bí mật tài chính thực** | Doanh thu thực tế của quý này, biên lợi nhuận bí mật, lương cụ thể | Thay bằng: Tỷ lệ giả định (15%, 20%), số tiền tượng trưng (`100.000.000 VNĐ`) |
| **Hạ tầng kỹ thuật** | Địa chỉ IP nội bộ (`192.168.x.x`), Database connection string, API Keys | Thay bằng: `10.0.0.x`, `sk-proj-xxxxxxxx`, `your-api-key` |
| **Nội dung hợp đồng mật** | Điều khoản bảo mật độc quyền (NDA), vụ việc tranh chấp pháp lý đang xử lý | Tổng quát hóa thành bài toán lý thuyết điển hình |

---

## 2. Quy tắc 3 Bước Rà soát Tự động (Sanitization Protocol)

1. **Bước 1 - Pattern Scanning (Quét mẫu chuỗi)**:
   - Quét Regex tìm: Số điện thoại (`09\d{8}`, `03\d{8}`...), Email (`\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b`), Số tài khoản ngân hàng.
2. **Bước 2 - Entity Replacement (Thay thế thực thể)**:
   - Chuyển toàn bộ tên riêng thực tế thành danh từ chung hoặc biến số trong ngoặc vuông: `[Tên_Đối_Tác]`, `[Nhân_Viên_Phụ_Trách]`.
3. **Bước 3 - Value Normalization (Bình thường hóa số liệu)**:
   - Các bảng tính Excel mẫu: Làm tròn các con số thành số chẵn tròn trịa (ví dụ: thay vì `14.823.491 VNĐ` thì chuyển thành `15.000.000 VNĐ` hoặc `[Số_Tiền_Giải_Ngân]`).

---

## 3. Checklist Phê duyệt Xuất bản (Go / No-Go Checklist)

Trước khi chuyển prompt sang trạng thái `verified: true`:
- [ ] Không chứa bất kỳ địa chỉ email đuôi thật nào của công ty.
- [ ] Không chứa số liệu P&L hay công nợ thực tế của bất kỳ phòng ban nào.
- [ ] Mọi ví dụ hợp đồng đều là văn bản mẫu (Boilerplate / Mock template).
- [ ] Không để lộ thông tin mật hoặc đường dẫn file SharePoint nội bộ có chứa ID riêng tư.
