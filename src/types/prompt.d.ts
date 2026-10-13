export interface PromptRecipe {
  id: string;                      // Mã định danh duy nhất (vd: 'FIN-001', 'BOD-002')
  title: string;                   // Tên tác vụ cụ thể, rõ ràng
  slug: string;                    // Đường dẫn URL thân thiện
  department: 'Ban Giám Đốc' | 'Tài chính - Kế toán' | 'Nhân sự' | 'Pháp chế' | 'Kinh doanh' | 'Vận hành' | 'Chung';
  tool: 'M365 Copilot' | 'Excel Copilot' | 'Word Copilot' | 'Teams' | 'ChatGPT / Claude';
  difficulty: 'Cơ bản' | 'Trung cấp' | 'Nâng cao';
  
  // Tín hiệu chất lượng & Đánh giá (Quality & Social Proof)
  verified: boolean;               // Đã được AI Champion/Trưởng phòng kiểm chứng
  verifiedBy?: string;             // Tên chuyên gia hoặc phòng ban kiểm duyệt
  rating: number;                  // Điểm đánh giá (1.0 - 5.0)
  copyCount: number;               // Lượt sao chép thực tế
  updatedAt: string;               // Ngày cập nhật gần nhất (YYYY-MM-DD)
  
  // Nội dung cốt lõi
  summary: string;                 // Tóm tắt công dụng trong 1-2 câu
  promptTemplate: string;          // Khung câu lệnh với biến số dạng [BIẾN_CẦN_ĐIỀN]
  variables: string[];             // Danh sách các biến cần thay thế (vd: ['DỮ_LIỆU', 'THỜI_HẠN'])
  
  // Phân tích học tập (Cookbook / Knowledge)
  whyEffective: string;            // Giải thích logic kỹ thuật tại sao prompt này ra kết quả tốt
  inputSample: string;             // Ví dụ dữ liệu thô đầu vào
  outputSample: string;            // Kết quả thực tế AI sinh ra (Before/After)
  commonPitfalls?: string;         // Lỗi thường gặp hoặc điểm AI dễ nhầm lẫn
  tags: string[];                  // Từ khóa tìm kiếm ngữ nghĩa (Synonyms/Keywords)
}
