# Ghi chú đã xử lý (Archived)
- Ngày xử lý: 2026-10-14
- Mã Prompt đã xuất bản: `FIN-004`
- Đường dẫn: `/prompts/trich-xuat-bang-bieu-tu-anh-scan-khong-lech-cot`

---

Hôm qua lội comment trên kênh Youtube của lão Tây kia thấy có trick này đỉnh vãi:
Bình thường quăng ảnh chụp bảng biểu hóa đơn hoặc bảng chấm công vào ChatGPT hay Claude là nó đọc lộn xộn hết cột nọ sang cột kia, nhất là mấy cái bảng bị mờ hoặc có ô gộp (merge cell).

Lão chỉ cách ép nó đọc theo tọa độ JSON trước rồi mới xuất Markdown:
Bảo nó: "Đóng vai chuyên gia OCR. Trước tiên hãy quét ảnh từ trên xuống dưới, chia lưới tọa độ ảo. Trích xuất từng ô theo cấu trúc hàng-cột dạng JSON thô, không được tự ý gộp ô. Sau đó từ JSON đó mới dựng lại thành bảng Markdown chuẩn".

Thử test với cái hóa đơn VAT của công ty TNHH May Mặc Thành Đạt (gửi cho kế toán huong.le@thanhdat.vn sđt 0988123456) kết quả ra chuẩn đét 100%, không bị lệch cột thành tiền!
Nên dùng với ChatGPT 4o hoặc Claude 3.5 Sonnet. Phòng Kế toán hay Hành chính xài cái này đỡ phải gõ tay cả tiếng đồng hồ.
