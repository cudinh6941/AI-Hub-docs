---
name: behavioral-product-design
description: Quy chuẩn thiết kế sản phẩm dựa trên tâm lý học hành vi, triết lý tối giản tinh tế kiểu Apple và nguyên tắc loại bỏ ma sát nhận thức xuyên suốt dự án AI Hub Docs.
triggers:
  - "/behavior-design"
  - "/product-psychology"
  - "tâm lý học hành vi"
  - "thiết kế trải nghiệm"
  - "chất apple"
---

# Skill: Behavioral Product Design & Apple-Grade UX Standard

Skill này định hình tư duy thiết kế sản phẩm, ngôn ngữ giao tiếp và kiến trúc hành vi người dùng cho toàn bộ hệ sinh thái **AI Hub Docs**. Mọi tính năng mới, bố cục trang hay luồng tương tác đều phải tuân thủ bộ quy chuẩn này trước khi chuyển sang giai đoạn viết code.

---

## 1. Triết lý Thẩm mỹ & Ngôn ngữ "Quiet Confidence" (Tinh thần Apple)

Sản phẩm hướng tới sự **sạch sẽ, điềm tĩnh, thông minh và tôn trọng người đọc**. Sức hút đến từ việc nói trúng nhu cầu thực tế bằng câu chữ gãy gọn và bố cục thoáng đãng, không đến từ sự ồn ào.

### 1.1. Quy tắc Anti-AI-Slop & Anti-Hype (Cấm văn mẫu AI & Cấm giọng điệu đa cấp)
- **Không lạm dụng Emoji trong giao diện**:
  - Tuyệt đối không rải các ký tự như `🔥`, `🚀`, `⚡`, `🤯`, `✨`, `💡`, `🎁` vào tiêu đề, nhãn (badge) hoặc nút bấm để gây chú ý.
  - Chỉ sử dụng icon nét mảnh (`lucide-react`) ở những vị trí thực sự cần định hướng chức năng. Nếu chữ viết đã đủ rõ nghĩa, ưu tiên dùng thuần chữ (clean typography).
- **Danh sách từ ngữ bị cấm (Blacklist)**:
  - Cấm dùng các từ ngữ phô trương, sáo rỗng: *"Nóng hổi", "Bí mật", "Vũ khí tối thượng", "Đỉnh cao", "Siêu tốc", "Mở khóa", "X10 năng suất", "90% người dùng không biết", "Tuyệt chiêu", "Cực phẩm", "Bất ngờ chưa"*.
- **Kiểm soát dấu câu**:
  - Không dùng dấu chấm than (`!`) trong tiêu đề, mô tả thẻ hoặc nút hành động. Kết thúc câu bằng dấu chấm (`.`) điềm đạm hoặc câu hỏi gợi suy nghĩ (`?`).
- **Thước đo giọng văn chuẩn (North Star Copy)**:
  - Luôn lấy câu chủ đề của trang chủ làm chuẩn mực: ***"Luôn có cách nhanh hơn để xử lý việc bạn đang làm."***
  - Nói như một người đồng nghiệp giàu kinh nghiệm đang chỉ dẫn ngắn gọn, thực tế:

| Tình huống | ❌ Giọng văn "AI / Đa cấp" (Bị cấm) | ✅ Giọng văn chuẩn AI Hub Docs (Tinh thần Apple) |
| :--- | :--- | :--- |
| **Tiêu đề khu vực** | `🔥 Mẹo AI cực nóng hổi bạn không thể bỏ lỡ!` | `Tiện ích có sẵn giúp bớt việc lặp lại.` |
| **Giới thiệu tính năng** | `Khám phá bí mật Gemini Gems giúp X10 tốc độ làm việc ngay hôm nay!` | `Lưu sẵn vai trò và quy chuẩn một lần. Mở cuộc trò chuyện mới là làm việc ngay.` |
| **Nút hành động (CTA)** | `⚡ Mở khóa ngay trong 30s!` | `Xem cách thiết lập` hoặc `Dùng mẫu cấu hình này` |

---

## 2. Nguyên lý Tâm lý học Hành vi Ứng dụng (Behavioral Frameworks)

### 2.1. Quiet Recognition (Sự nhận diện đồng cảm)
Con người chú ý mạnh nhất khi thấy hình ảnh công việc hàng ngày của chính mình. Thay vì quảng cáo tính năng công nghệ, hãy đặt vấn đề bằng **một thao tác thủ công lặp đi lặp lại** mà người dùng đang phải chịu đựng:
- **Cấu trúc dẫn dắt**: `[Thao tác thừa đang làm mỗi ngày]` ➔ `[Cách công cụ giải quyết gọn hơn]` ➔ `[Bắt đầu dùng ngay với mẫu dựng sẵn]`.
- Khi người đọc tự gật đầu *"Đúng là mình đang tốn thời gian ở bước này"*, động lực tìm hiểu sẽ tự nhiên xuất hiện mà không cần thúc ép.

### 2.2. Mô hình Hành vi BJ Fogg ($B = M \times A \times P$) — Triệt tiêu ma sát (Zero Friction)
Nhân viên văn phòng bận rộn và rất ngại đọc tài liệu dài. Để hành vi xảy ra, phải tối đa hóa **Ability (Sự dễ dàng)**:
1. **Quy tắc 3 giây nhận thức**: Nhìn lướt qua một thẻ (Card) hoặc một khu vực trên trang trong 3 giây phải hiểu ngay: *Cái này dùng vào việc gì và tiết kiệm được bước nào*.
2. **Nguyên tắc "Đưa sẵn phần việc khó nhất" (No Blank Page)**:
   - Người dùng thường bỏ cuộc khi công cụ bắt họ tự thiết lập từ trang trắng (ví dụ: tự viết *System Instructions* cho Gemini Gems hay ChatGPT Projects).
   - Mọi tính năng hướng dẫn trên AI Hub Docs bắt buộc phải **đính kèm bản mẫu dựng sẵn (Pre-built Blueprint / Template)** để người dùng chỉ cần bấm `Sao chép` và dán vào công cụ.
3. **Giữ liền mạch sự tập trung (In-Context Flow)**:
   - Hạn chế bắt người dùng chuyển qua nhiều trang mới nếu nội dung chỉ cần 30–45 giây để nắm bắt. Ưu tiên sử dụng **khung trượt (Slide-over Drawer) hoặc Modal tinh gọn** ngay trên trang hiện tại, đồng thời vẫn hỗ trợ URL riêng (deep-link) khi cần chia sẻ.

### 2.3. Progressive Disclosure (Bóc tách thông tin theo tầng)
Không bao giờ đổ toàn bộ thông tin ra màn hình cùng một lúc (tránh quá tải nhận thức - Cognitive Overload):
- **Tầng 1 — Bề mặt (Bento / Card)**: Tối đa 3 thành phần: Nhãn công cụ nhỏ gọn + Câu tiêu đề chạm đúng vấn đề + 1 câu mô tả giải pháp & nút xem chi tiết.
- **Tầng 2 — Trải nghiệm nhanh (Drawer / Quick View)**: So sánh ngắn gọn *Cách thông thường* và *Cách tối ưu*, kèm 3 bước thao tác cô đọng và hộp sao chép cấu hình mẫu.
- **Tầng 3 — Chuyên sâu (Deep Dive)**: Liên kết tới các công thức Prompt liên quan hoặc Video bài giảng đầy đủ cho người muốn tìm hiểu sâu hơn.

---

## 3. Quy chuẩn Bố cục Thị giác & Nhịp điệu (Apple Visual Rhythm)

1. **Phân cấp chữ rõ ràng (Typographic Hierarchy)**:
   - **Eyebrow**: Chữ nhỏ, định vị ngữ cảnh (`text-xs font-semibold text-indigo-600 uppercase tracking-wider`).
   - **Headline**: Đanh gọn, độ tương phản cao (`text-slate-900 font-bold tracking-tight`).
   - **Body**: Dịu mắt, khoảng cách dòng thoáng (`text-slate-600 leading-relaxed`).
2. **Khoảng trắng có chủ đích (Generous Whitespace)**:
   - Giữa các thành phần phải có không gian thở (`p-6`, `gap-5`, `py-14`). Không nhồi nhét quá nhiều viền (border) chồng chéo.
3. **Tương phản Trước / Sau tinh tế (Subtle Contrast)**:
   - Khi so sánh hai cách làm, dùng nền trung tính (`bg-slate-50 text-slate-600`) cho cách thủ công và nền sáng viền nhẹ (`bg-white border-indigo-200/70`) cho cách tối ưu — sạch sẽ, trực quan ngay từ cái nhìn đầu tiên.

---

## 4. Checklist Thẩm định Hành vi (Behavioral Audit trước khi duyệt Spec)

Trước khi chuyển bất kỳ bản vẽ Spec nào sang trạng thái `spec-ready`, `6-product-psychologist` phải kiểm tra đạt 100% các tiêu chí sau:
- [ ] **Kiểm tra giọng văn**: Đã loại bỏ hết emoji thừa, dấu chấm than (`!`) và các từ ngữ kiểu quảng cáo/đa cấp chưa?
- [ ] **Kiểm tra điểm chạm tâm lý**: Tiêu đề có nói trúng thao tác thực tế của người làm việc thay vì dùng thuật ngữ kỹ thuật khô khan không?
- [ ] **Kiểm tra tải nhận thức**: Mỗi thẻ trên giao diện có giữ dưới 3 nhóm thông tin để đọc hiểu trong 3 giây không?
- [ ] **Kiểm tra rào cản hành động**: Đã cung cấp sẵn cấu hình mẫu / câu lệnh mẫu để người dùng sao chép dùng ngay mà không phải tự nghĩ từ đầu chưa?
- [ ] **Kiểm tra an toàn dữ liệu**: Có chỉ dẫn rõ ràng về mức độ an toàn dữ liệu công ty (Governance) một cách nhẹ nhàng, dễ hiểu không?
