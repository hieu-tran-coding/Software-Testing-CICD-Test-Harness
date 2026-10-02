# Lịch sử sử dụng AI - Tuần 3 (Thành viên C)

**Họ và tên:** Dương Trọng Hòa
**MSSV:** 23120127

---

## 1. Mục đích sử dụng AI
Sử dụng AI (Gemini/ChatGPT) để hỗ trợ tìm hiểu lý thuyết về UI Test, phương pháp Record/Playback, và so sánh các công cụ test giao diện (Katalon vs Cypress) nhằm chọn ra công cụ phù hợp với CI/CD pipeline (đặc biệt là khả năng chạy headless).

## 2. Chi tiết các Prompt đã sử dụng

### Prompt 1: Tìm hiểu lý thuyết UI Test và Record/Playback
- **Thời gian:** 07:54, 02/10/2026
- **Model:** Gemini 3.1 Pro
- **Prompt:** "Hãy giải thích ngắn gọn khái niệm UI Test và phương pháp Record & Playback trong kiểm thử phần mềm tự động. Giải thích thêm về thuật ngữ Headless mode, Locator và DOM trong ngữ cảnh UI Test."
- **Kết quả AI trả về:** AI đã giải thích khái niệm UI Test là kiểm thử giao diện mô phỏng thao tác người dùng, Record/Playback là phương pháp ghi lại và phát lại kịch bản. Headless mode là chạy trình duyệt ẩn, Locator là cách định vị phần tử, DOM là cấu trúc HTML của trang.
- **Cách xử lý:** Tôi đã đọc hiểu, chắt lọc các ý chính súc tích nhất để đưa vào phần 3.1 của báo cáo cá nhân.

### Prompt 2: So sánh Katalon và Cypress cho CI/CD
- **Thời gian:** 09:00, 02/10/2026
- **Model:** Gemini 3.1 Pro
- **Prompt:** "So sánh nhanh Katalon và Cypress trong việc viết test UI tự động. Đặc biệt tập trung vào 2 khía cạnh: khả năng Record/Playback và khả năng tích hợp CI/CD chạy chế độ headless (chạy ngầm không giao diện). Khuyên dùng tool nào cho project sinh viên dùng GitHub Actions?"
- **Kết quả AI trả về:** 
  - AI chỉ ra rằng Katalon mạnh về Record/Playback cho người ít kinh nghiệm code, nhưng bản Free giới hạn chạy CLI/CI và headless. 
  - Cypress yêu cầu code nhiều hơn bằng JavaScript nhưng hỗ trợ headless cực kỳ tốt, hoàn toàn miễn phí khi chạy qua command line, tích hợp GitHub Actions dễ dàng. Cypress cũng có plugin Cypress Studio hỗ trợ Record/Playback cơ bản.
- **Cách xử lý:** Tôi đã quyết định chọn Cypress làm công cụ đề xuất chính, do ưu điểm lớn nhất là hoàn toàn miễn phí khi tích hợp vào pipeline (điều kiện cốt lõi của môn học) và đáp ứng tốt tiêu chí chạy headless.

## 3. Xác nhận
Tôi xác nhận các nội dung do AI tạo ra đã được tôi đọc hiểu, chọn lọc, và tự tay biên tập lại trước khi đưa vào báo cáo chính thức. Tôi hiểu nội dung báo cáo và chịu trách nhiệm về kiến thức chuyên môn trong đó.
