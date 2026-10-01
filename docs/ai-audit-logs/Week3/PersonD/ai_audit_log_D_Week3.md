# 🤖 AI AUDIT LOG - TUẦN 3

**Họ và tên:** Trần Trọng Trí  
**MSSV:** 20120221  
**Phần việc:** Thành viên D - API Testing, Data-driven & Checkpoints  
**Vị trí commit:** `docs/ai-audit-logs/Week3/PersonD/ai_audit_log_D_Week3.md`  
**Công cụ AI sử dụng:** Antigravity AI Assistant  
**Mục đích chung:** Hỗ trợ nghiên cứu lý thuyết chuyên môn (API Testing, Data-driven Testing, Checkpoints), mở rộng phạm vi kiểm thử Backend (Database Seeding, Security/RBAC, Concurrent Testing, Stress Testing), khảo sát công cụ kiểm thử tự động qua dòng lệnh (Newman, k6), so sánh công cụ CI/CD, và lập kế hoạch kiểm thử cho hệ thống ứng dụng mẫu `eshop-sut`.

---

## Lần 1: Tổng hợp yêu cầu và nhiệm vụ của Member D từ tài liệu dự án

*   **Prompt (Tóm tắt câu hỏi):**
    > "Dựa trên các dữ liệu có sẵn hãy tổng hợp những yêu cầu của member D"
*   **Kết quả AI trả về (Tóm tắt):**
    *   *Nhiệm vụ chung:* So sánh 2 công cụ CI/CD (GitHub Actions, GitLab CI, Jenkins), đưa ra nhận xét kế hoạch tổng thể và vote công cụ cho nhóm.
    *   *Nhiệm vụ chuyên môn của Member D:* Phụ trách mảng **API Testing, Data-driven Testing & Checkpoints** trong hệ thống Test-Harness; khảo sát và đề xuất 1 công cụ kiểm thử API có thể chạy tự động qua CLI (ví dụ: Postman/Newman) để tích hợp vào pipeline CI/CD; chuẩn bị áp dụng kịch bản kiểm thử lên hệ thống mẫu `eshop-sut`.
    *   *Quy định bắt buộc:* Ghi chép AI Audit Log, cập nhật tiến độ trên Jira, chuẩn bị bài tập thực hành (Hands-on exercise) kèm gợi ý cho lớp ở các tuần tiếp theo.
*   **Cách sử dụng kết quả:** 
    *   Định hình khung cấu trúc và các đầu việc cần triển khai cho bản báo cáo cá nhân [Week3_report.md](file:///d:/Projects/Code/school/ktpm/New%20folder/Software-Testing-CICD-Test-Harness/docs/weekly-docs/Week3/PersonD/Week3_report.md).

---

## Lần 2: So sánh công cụ CI/CD và nghiên cứu lý thuyết chuyên môn cốt lõi

*   **Prompt (Tóm tắt câu hỏi):**
    > "Hỗ trợ so sánh gh actions và jenkins đối với bài seminar ngắn hạn và hệ thống test runner CLI. Giải thích chi tiết các khái niệm cốt lõi: api testing trong test pyramid, data-driven testing, các loại checkpoint phổ biến và các thuật ngữ quan trọng"
*   **Kết quả AI trả về (Tóm tắt):**
    *   *So sánh CI/CD:* 
        *   GitHub Actions: Tích hợp sẵn trong GitHub, không tốn tài nguyên dựng server riêng, Marketplace phong phú, tối ưu cho việc fork repo làm bài tập áp dụng của lớp.
        *   Jenkins: Mạnh mẽ, tự host, nhưng quá cồng kềnh, cấu hình phức tạp, tốn thời gian bảo trì.
        *   Vote: GitHub Actions.
    *   *Lý thuyết cốt lõi:*
        *   API Testing: Vị trí ở Service layer, kiểm tra request/response, HTTP status code, tính toàn vẹn nghiệp vụ và bảo mật token không qua GUI.
        *   Data-driven Testing: Tách test logic khỏi test data (JSON/CSV), chạy lặp lại kịch bản với nhiều tập giá trị (biên, hợp lệ, ngoại lệ).
        *   Checkpoints: Điểm kiểm định kết quả thực tế vs kết quả kỳ vọng (Status code, response time, JSON schema/contract, giá trị trường cụ thể trong body, headers).
*   **Cách sử dụng kết quả:** 
    *   Chắt lọc, tổng hợp và đưa vào Mục 1 và Mục 3.1 của file [Week3_report.md](file:///d:/Projects/Code/school/ktpm/New%20folder/Software-Testing-CICD-Test-Harness/docs/weekly-docs/Week3/PersonD/Week3_report.md).

---

## Lần 3: Khảo sát các khía cạnh kiểm thử Backend còn thiếu để hoàn thiện hệ thống

*   **Prompt (Tóm tắt câu hỏi):**
    > "Theo bạn thì để test backend ngoài những thứ này ra còn thiếu gì không"
*   **Kết quả AI trả về (Tóm tắt):**
    *   *Database Seeding & Test Isolation:* Cần cơ chế dọn dẹp và reset database sạch trước mỗi lần chạy test trên CI để tránh lỗi trùng dữ liệu (`UNIQUE constraint`) giữa các lần commit.
    *   *Security & Negative Testing:* Kiểm tra phân quyền RBAC (Role-Based Access Control) để người dùng thường không gọi được API Admin (`403 Forbidden`); kiểm thử token giả mạo hoặc hết hạn (`401 Unauthorized`).
    *   *Contract Testing & JSON Schema Validation:* Khóa cứng cấu trúc dữ liệu JSON trả về nhằm đảm bảo thay đổi ở Backend không làm hỏng giao diện Frontend.
    *   *Unit/Integration Test & Code Coverage:* Kiểm tra logic nội bộ không cần bật server mạng và đo độ bao phủ mã nguồn (Quality Gate).
*   **Cách sử dụng kết quả:** 
    *   Bổ sung cơ chế Reset Database và kiểm thử bảo mật phân quyền vào Mục 2 và Mục 3.1 của báo cáo cá nhân.

---

## Lần 4: Định vị Stress Test và Concurrent Test trong kiểm thử Backend & SQLite

*   **Prompt (Tóm tắt câu hỏi):**
    > "Stress test và concurrent test sẽ nằm ở đâu đối với hệ thống backend Express + SQLite của eshop-sut"
*   **Kết quả AI trả về (Tóm tắt):**
    *   *Vị trí phân loại:* Cả hai loại test này đều thuộc trực tiếp tầng Backend / API Testing (không thể chạy qua UI vì giao diện trình duyệt rất nặng tài nguyên, không giả lập được tải cao).
    *   *Concurrent Testing (Kiểm thử tương tranh):* Kiểm tra tính toàn vẹn nghiệp vụ và bắt lỗi Race Condition khi nhiều người cùng thao tác vào một tài nguyên tại cùng một thời điểm (ví dụ: cùng đặt món hàng cuối cùng trong kho). Phân tích nguy cơ SQLite bị khóa file (`SQLITE_BUSY: database is locked`) do cơ chế Single-writer.
    *   *Stress Testing (Kiểm thử áp lực):* Thuộc nhóm Non-functional / Performance testing, đẩy tải vượt ngưỡng thiết kế để tìm điểm gãy (breaking point) và kiểm tra khả năng tự phục hồi của server.
*   **Cách sử dụng kết quả:** 
    *   Đưa định nghĩa Concurrency và Stress Test vào Mục 3.1; phân tích thách thức SQLite và đề xuất giải pháp vào Mục 3.2 của báo cáo cá nhân.

---

## Lần 5: Khảo sát bộ công cụ thực thi CLI và giải pháp tích hợp pipeline cho `eshop-sut`

*   **Prompt (Tóm tắt câu hỏi):**
    > "Đề xuất bộ công cụ chạy CLI trên gh actions để bao phủ cả functional API test, data-driven, checkpoints, concurrent và stress test cho eshop-sut và thiết kế mẫu pipeline"
*   **Kết quả AI trả về (Tóm tắt):**
    *   *Bộ công cụ đề xuất:*
        *   **Postman + Newman CLI:** Xử lý API Functional, DDT (`-d data.json`), Checkpoints, Quản lý chuỗi JWT Token, xuất báo cáo HTML/Allure.
        *   **k6 CLI:** Xử lý Concurrent Test (kiểm tra Race condition) và Smoke Stress Test trực tiếp trên GitHub Actions runner.
        *   **Allure Reporter:** Làm định dạng báo cáo thống nhất với các thành viên khác.
    *   *Đoạn mã pipeline minh họa:* Thứ tự Reset DB $\rightarrow$ Newman API Test $\rightarrow$ k6 Test $\rightarrow$ Publish Report.
*   **Cách sử dụng kết quả:** 
    *   Đưa vào Mục 3.2 trong báo cáo cá nhân tuần 3 làm đề xuất kỹ thuật chính thức gửi cho Leader và nhóm.

---

## Ghi chú & Đánh giá cá nhân

*   Toàn bộ nội dung lý thuyết và phân tích kỹ thuật do AI hỗ trợ đều được đối chiếu cẩn thận với yêu cầu môn học Kiểm thử phần mềm và đặc tả hệ thống của dự án `eshop-sut`.
*   Tài liệu đã được thành viên rà soát, kiểm chứng tính khả thi của các lệnh Newman và k6 trên môi trường Node.js thực tế trước khi hoàn thiện báo cáo.
