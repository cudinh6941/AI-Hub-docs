---
name: prompt-crafting
description: Quy chuẩn kỹ thuật Prompt Engineering nâng cao cho doanh nghiệp theo cấu trúc R-C-T-C-F và hệ thống biến số động.
---

# Skill: Prompt Crafting & Engineering Standard (R-C-T-C-F)

Skill này cung cấp quy chuẩn bắt buộc để chuyển đổi bất kỳ ý tưởng thô sơ, câu lệnh vắn tắt hoặc mẹo lượm lặt nào thành một **Enterprise Prompt Recipe** chuẩn mực của AI Hub Docs.

---

## 1. Cấu trúc Khung 5 Thành tố (R-C-T-C-F Framework)

Mọi câu lệnh hoàn chỉnh bắt buộc phải xây dựng dựa trên 5 thành tố sau:

| Thành tố | Tên gọi | Mục đích & Tiêu chuẩn |
| :--- | :--- | :--- |
| **R** | **Role (Vai trò)** | Đặt vai trò chuyên gia cao cấp, xác định rõ góc nhìn và thâm niên (VD: *"Bạn là Chuyên gia Kiểm toán nội bộ cấp cao với 15 năm kinh nghiệm..."*). |
| **C** | **Context (Bối cảnh)** | Mô tả tình huống nghiệp vụ thực tế của công ty, môi trường làm việc, tệp dữ liệu đầu vào. |
| **T** | **Task (Nhiệm vụ cụ thể)** | Mô tả chính xác việc cần làm, chia thành từng bước rõ ràng (Step 1, Step 2...). |
| **C** | **Constraints (Ràng buộc)** | Ranh giới an toàn: Cấm bịa đặt số liệu (Zero Hallucination), giới hạn độ dài, quy tắc ẩn danh dữ liệu nội bộ. |
| **F** | **Format (Định dạng đầu ra)** | Quy định hình thức kết quả mong muốn: Bảng Markdown, Bullet points, Báo cáo Executive 1 trang, hoặc JSON. |

---

## 2. Quy tắc Đặt tên Biến số Động (Dynamic Variables)

Biến số cho phép người dùng thay thế dữ liệu cá nhân vào template mà không làm hỏng cấu trúc câu lệnh.

1. **Cú pháp bắt buộc**: Đặt trong cặp ngoặc vuông đơn: `[Tên_Biến]`.
2. **Quy tắc đặt tên**:
   - Dùng tiếng Việt có dấu hoặc gạch dưới không dấu rõ nghĩa: `[Tên_Khách_Hàng]`, `[Kỳ_Báo_Cáo]`, `[Ngưỡng_Chênh_Lệch]`.
   - **CẤM** đặt tên chung chung như `[data]`, `[text]`, `[input]`, `[x]`.
   - Đặt tên gợi ý định dạng nếu cần: `[Tỷ_Lệ_Phần_Trăm_%]`, `[Hạn_Chót_DD/MM/YYYY]`.
3. **Khai báo mảng `variables` trong Schema**:
   Mọi biến số xuất hiện trong `promptTemplate` đều phải được định nghĩa trong mảng `variables`:
   ```json
   {
     "name": "Ngưỡng_Chênh_Lệch",
     "label": "Ngưỡng chênh lệch ngân sách",
     "placeholder": "Ví dụ: 10% hoặc 50.000.000 VNĐ",
     "description": "Khoản vượt định mức bắt đầu cần giải trình"
   }
   ```

---

## 3. Quy chuẩn Giả lập Dữ liệu Mẫu (Simulation Protocol)

Một bài đăng chất lượng trên AI Hub Docs không thể thiếu **Ví dụ thực tế**:

- **`inputSample` (Đầu vào mẫu)**: Phải là dữ liệu thô, có phần lộn xộn giống thực tế (ví dụ: một đoạn email dài, một bảng số liệu chưa tính toán, một đoạn trích điều khoản hợp đồng).
- **`outputSample` (Đầu ra giả lập)**: Phải thể hiện kết quả AI xử lý xuất sắc, sạch sẽ, chuẩn xác theo đúng định dạng `Format` đã yêu cầu trong prompt.
- **`whyEffective`**: Luôn giải thích rõ vì sao prompt này hiệu quả (VD: "Sử dụng kỹ thuật Few-shot giúp AI không bị nhầm lẫn giữa chi phí cố định và chi phí biến đổi").
