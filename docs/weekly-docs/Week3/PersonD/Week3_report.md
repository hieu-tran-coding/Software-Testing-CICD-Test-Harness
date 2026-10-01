# 📝 BÁO CÁO CÁ NHÂN - TUẦN 3

**Họ và tên:** Trần Trọng Trí  
**MSSV:** 20120221  
**Phần việc:** Thành viên D - API Testing, Data-driven & Checkpoints  

---

## 1. Khảo sát Công cụ CI/CD
*   **2 công cụ CI/CD so sánh:** GitHub Actions vs Jenkins
*   **So sánh nhanh (Ưu/Khuyết):** 
    *   **GitHub Actions:**
        *   *Ưu điểm:* Tích hợp sâu và liền mạch với GitHub repository; không cần cài đặt hoặc duy trì máy chủ riêng; hỗ trợ GitHub-hosted runners (Ubuntu, Windows, macOS); cấu hình đơn giản bằng cú pháp YAML trong thư mục `.github/workflows`; có chợ tiện ích mở rộng (GitHub Marketplace) phong phú với hàng nghìn action dựng sẵn; dễ dàng xuất và lưu trữ Test Artifacts/Reports.
        *   *Khuyết điểm:* Bị giới hạn số phút thực thi mỗi tháng đối với tài khoản miễn phí trên private repository; phụ thuộc vào hạ tầng đám mây của GitHub; khả năng tùy biến sâu hệ thống runner nội bộ không linh hoạt bằng Jenkins.
    *   **Jenkins:**
        *   *Ưu điểm:* Mã nguồn mở, hoàn toàn miễn phí; hệ sinh thái plugin đồ sộ và lâu đời, đáp ứng được mọi yêu cầu tùy biến pipeline phức tạp; toàn quyền kiểm soát môi trường thực thi (self-hosted).
        *   *Khuyết điểm:* Chi phí cài đặt, vận hành và bảo trì máy chủ cao; giao diện người dùng cũ kỹ, cấu hình ban đầu phức tạp; việc quản lý xung đột plugin dễ gây lỗi; không tối ưu cho bài seminar ngắn hạn và khó yêu cầu cả lớp dựng server để thực hành.
*   **Vote công cụ cho dự án:** **GitHub Actions**.  
    *Lý do:* Repository của nhóm đã lưu trữ trên GitHub; cấu hình nhanh gọn, sẵn sàng tích hợp với các công cụ CLI test runner (như Newman, k6); rất thuận tiện để cả lớp fork repo về và chạy thử nghiệm mà không cần cài đặt hạ tầng server.

---

## 2. Nhận xét Kế hoạch Tổng thể
*   **Đánh giá chung:**
    *   Kế hoạch tổng thể và lộ trình từ Tuần 3 đến Tuần 13 được phân chia rõ ràng, hợp lý và có tính khả thi cao.
    *   Cấu trúc phân chia nhiệm vụ chuyên môn (A: Quản lý & CI/CD trigger; B: Lý thuyết & Test-Harness; C: UI Test; D: API & Data-driven Test; E: Case study & Report) rất cân đối, bao phủ trọn vẹn mô hình Test Pyramid.
    *   Quy định bắt buộc về minh chứng (Jira proof, Git commit log, AI audit log) giúp đánh giá minh bạch và đúng thực chất đóng góp của từng thành viên.
*   **Đề xuất chỉnh sửa & Bổ sung:**
    *   **Đồng bộ dữ liệu & Cơ chế Reset Database:** Cần thống nhất ứng dụng mẫu `eshop-sut` (đã có sẵn Backend REST API, Auth JWT, Cart, Orders). Đồng thời, bắt buộc phải có cơ chế **Database Seeding / Reset** trước mỗi lần pipeline chạy test để đảm bảo tính độc lập (Test Isolation), tránh lỗi trùng dữ liệu (`UNIQUE constraint`) giữa các lần commit.
    *   **Chuỗi thứ tự thực thi trong Pipeline CI/CD:** Đề xuất pipeline chạy theo thứ tự tối ưu tài nguyên:
        $$\text{Build Backend} \rightarrow \text{Reset Test DB} \rightarrow \text{API Functional \& DDT} \rightarrow \text{Concurrent Test} \rightarrow \text{UI Automation} \rightarrow \text{Smoke Stress Test} \rightarrow \text{Publish Report}$$
    *   **Thiết kế bài tập thực hành (Tuần 9 - 11):** Bài tập API testing cho lớp nên được thiết kế dưới dạng 1 Postman Collection mẫu kèm file dữ liệu CSV/JSON, yêu cầu sinh viên bổ sung Checkpoint (Status code, JSON schema, Auth token) và chạy thử nghiệm qua dòng lệnh Newman CLI.

---

## 3. Báo cáo Chuyên môn

### 3.1. Lý thuyết cốt lõi

*   **API Testing (Kiểm thử giao diện lập trình ứng dụng):**
    *   Là kiểm thử ở tầng dịch vụ (Service/API layer trong Test Pyramid), kiểm tra trực tiếp các giao thức giao tiếp HTTP/HTTPS, RESTful API mà không qua giao diện người dùng (GUI).
    *   Tập trung kiểm tra tính đúng đắn của dữ liệu phản hồi, mã trạng thái HTTP, logic nghiệp vụ, tính toàn vẹn và cơ chế xác thực JWT.
    *   *Lợi ích:* Tốc độ thực thi cực nhanh so với UI test, dễ dàng tích hợp vào CI/CD để phát hiện lỗi logic từ sớm (Shift-left testing).

*   **Data-driven Testing (Kiểm thử hướng dữ liệu - DDT):**
    *   Tách biệt hoàn toàn kịch bản kiểm thử (Test logic) khỏi tập dữ liệu kiểm thử (Test data).
    *   Dữ liệu được nạp từ các tệp bên ngoài (JSON, CSV). Test runner sẽ lặp lại cùng một kịch bản test với các tham số đầu vào và kết quả kỳ vọng khác nhau.
    *   *Ứng dụng trong `eshop-sut`:* Kiểm thử chức năng Đăng ký / Đăng nhập với nhiều bộ dữ liệu (tài khoản hợp lệ, mật khẩu yếu, email sai định dạng, tài khoản trùng lặp); kiểm thử tìm kiếm/lọc sản phẩm theo nhiều danh mục.

*   **Checkpoints (Điểm kiểm định / Assertions):**
    *   Là các tiêu chuẩn kiểm tra so sánh kết quả thực tế (Actual result) với kết quả kỳ vọng (Expected result).
    *   *5 loại checkpoint API điển hình:*
        1.  *Status Code Checkpoint:* Kiểm tra mã phản hồi HTTP (`200 OK`, `201 Created`, `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`).
        2.  *Response Time Checkpoint:* Kiểm tra ngưỡng phản hồi chấp nhận được (VD: `< 500ms`).
        3.  *JSON Schema / Contract Checkpoint:* Khóa cứng cấu trúc JSON trả về (kiểm tra kiểu dữ liệu, các trường bắt buộc phải có) để tránh làm hỏng Frontend.
        4.  *Response Body & Field Values Checkpoint:* Kiểm tra giá trị cụ thể (token không được rỗng, số lượng tồn kho giảm đúng sau khi đặt hàng).
        5.  *Headers Checkpoint:* Kiểm tra Content-Type (`application/json`), Security headers.

*   **Concurrent Testing (Kiểm thử tương tranh / đồng thời):**
    *   Kiểm tra tính đúng đắn và toàn vẹn của hệ thống khi **nhiều request cùng thao tác vào một tài nguyên tại cùng một thời điểm** (cùng 1 mili-giây).
    *   *Mục tiêu:* Phát hiện lỗi **Race Condition (Tranh chấp dữ liệu)** hoặc **Deadlock**.
    *   *Ví dụ trong `eshop-sut`:* Khi kho chỉ còn **1 sản phẩm cuối cùng**, nếu 2 người dùng cùng lúc bấm đặt hàng (`POST /api/orders`), hệ thống phải đảm bảo chỉ 1 người thành công và 1 người nhận lỗi hết hàng; không được để kho bị âm (-1) hoặc văng lỗi sập server.

*   **Stress Testing & Load Testing (Kiểm thử áp lực & Tải):**
    *   Thuộc nhóm kiểm thử phi chức năng (Non-functional Testing).
    *   *Stress Testing:* Đẩy số lượng người dùng ảo/request tăng đột biến vượt xa ngưỡng thông thường để tìm **điểm gãy (breaking point)** của hệ thống, kiểm tra xem server có tự phục hồi (recovery) an toàn hay bị treo hẳn tiến trình.
    *   *Smoke Load Testing trong CI/CD:* Chạy một tải nhẹ (50-100 virtual users trong 10-15s) ngay trên pipeline để bắt sớm các lỗi rò rỉ bộ nhớ (memory leak) hoặc nghẽn cổ chai (bottleneck).

*   **Security & Negative Testing (Bảo mật & Phân quyền RBAC):**
    *   Kiểm thử với các dữ liệu bất thường: Token giả mạo, token hết hạn, thiếu header Authorization $\rightarrow$ Server phải trả về `401 Unauthorized`.
    *   Kiểm thử phân quyền (Role-Based Access Control): Dùng token của người dùng thông thường (`role: customer`) gọi API xóa sản phẩm của Admin (`DELETE /api/admin/products/:id`) $\rightarrow$ Server phải chặn với mã `403 Forbidden`.

*   **Thuật ngữ quan trọng:**
    *   **Endpoint:** Đường dẫn URI của tài nguyên trên server (VD: `/api/login`, `/api/orders`).
    *   **Payload:** Khối dữ liệu gửi từ client lên server (JSON body).
    *   **JWT (JSON Web Token):** Chuỗi mã hóa gồm 3 phần (Header, Payload, Signature) dùng để xác thực không lưu trạng thái (Stateless Authentication).
    *   **Newman:** CLI Test Runner chính thức của Postman, chạy kiểm thử API headless trong môi trường dòng lệnh và CI/CD.
    *   **k6:** Công cụ mã nguồn mở viết bằng Go/JavaScript, tối ưu cho việc chạy Load & Stress & Concurrent test dạng headless trên CI/CD.
    *   **Race Condition:** Tình trạng lỗi xảy ra khi hai hay nhiều luồng cùng đọc và ghi vào cùng một ô dữ liệu mà không có cơ chế khóa (locking) an toàn.
    *   **Database Seeding / Isolation:** Cơ chế nạp dữ liệu mẫu ban đầu và cô lập môi trường test để mỗi lần test chạy đều có kết quả nhất quán (Idempotency).

---

### 3.2. Đề xuất Công cụ / Giải pháp

*   **Bộ công cụ kiểm thử cốt lõi:**
    *   **Postman (Desktop App):** Thiết kế API Collection, viết Pre-request Script (tạo dữ liệu động), Tests Script (Checkpoints bằng ChaiJS), quản lý Environment Variables.
    *   **Newman CLI Runner (`npm install -g newman`):** Chạy toàn bộ kịch bản API Functional & Data-driven trên GitHub Actions runner.
    *   **k6 CLI:** Chạy các kịch bản Concurrent Test và Smoke Stress Test trực tiếp trên CI/CD với mức tiêu thụ tài nguyên siêu nhẹ.
    *   **Reporter:** `newman-reporter-htmlextra` (sinh báo cáo HTML trực quan) và `newman-reporter-allure` (tích hợp kết quả vào Allure Report chung của nhóm).

*   **Lý do chọn & Trả lời yêu cầu của Leader:**
    *   *Khả năng chạy dòng lệnh (Headless CLI):* Cả Newman và k6 đều chạy độc lập trong terminal qua 1 dòng lệnh duy nhất, không đòi hỏi giao diện đồ họa.
    *   *Quản lý chuỗi trạng thái (State Management):* Postman/Newman cho phép lưu token tự động sau khi gọi `/api/login` vào biến môi trường `pm.environment.set("jwt_token", token)` và tự động gắn vào Header của các request kế tiếp (`/api/cart`, `/api/orders`).
    *   *Hỗ trợ Data-driven mạnh mẽ:* Newman nhận cờ `-d test-data.json` hoặc `-d test-data.csv` rất mượt mà.
    *   *Độ phủ toàn diện cho Backend `eshop-sut`:* Kết hợp Newman (kiểm tra Functional, DDT, Checkpoints, Security RBAC) và k6 (kiểm tra Concurrency, Stress Test) giúp bài seminar bao phủ trọn vẹn cả kiểm thử chức năng lẫn phi chức năng của tầng Backend.

*   **Minh họa Cấu hình Pipeline CI/CD (GitHub Actions):**
    ```yaml
    # Trích đoạn cấu hình chạy Backend Test Harness trên GitHub Actions
    - name: 1. Reset & Seed Test Database
      run: npm --prefix eshop-sut/backend run db:reset

    - name: 2. Run API Functional & Data-driven Tests (Newman)
      run: |
        npx newman run test-harness/api/eshop-api.postman_collection.json \
          -e test-harness/api/environments/eshop-local.json \
          -d test-harness/api/test-data/auth-data.json \
          --reporters cli,htmlextra,allure \
          --reporter-htmlextra-export docs/test-reports/api-report.html

    - name: 3. Run Concurrent & Stress Test (k6)
      run: k6 run test-harness/performance/concurrency-order-test.js
    ```

*   **Điểm yếu / Khó khăn dự kiến & Giải pháp:**
    1.  *Khóa dữ liệu SQLite khi chạy Concurrent / Stress Test:*
        *   *Vấn đề:* Backend `eshop-sut` sử dụng SQLite (`database.sqlite`). SQLite là hệ quản trị cơ sở dữ liệu dạng file đơn, chỉ cho phép **1 tiến trình ghi tại một thời điểm**. Khi nhiều request đồng thời gửi tới API đặt hàng hoặc khi stress test, rất dễ dính lỗi `SQLITE_BUSY: database is locked`.
        *   *Giải pháp:* Thiết kế test case nhận diện ngưỡng này; kiến nghị cấu hình WAL mode (Write-Ahead Logging) cho SQLite trong test environment hoặc cơ chế retry tự động trong code backend.
    2.  *Sự phụ thuộc dữ liệu (Data Dependency & Isolation):*
        *   *Vấn đề:* Kịch bản test tạo đơn hàng, sửa thông tin người dùng làm thay đổi dữ liệu thật, khiến các lần chạy test tiếp theo bị fail (ví dụ trùng email đăng ký).
        *   *Giải pháp:* Viết script tự động copy đè file `database.sqlite` sạch (clean fixture) trước mỗi lần chạy test trên CI.
    3.  *Quản lý JWT Token hết hạn:*
        *   *Vấn đề:* Token JWT hết hạn làm chuỗi test phía sau fail dây chuyền.
        *   *Giải pháp:* Cấu hình thời gian sống của token trong môi trường test đủ dài, hoặc viết Pre-request script tự động refresh token khi token hết hạn.
    4.  *Đồng bộ báo cáo (Reporting):*
        *   *Vấn đề:* API test (Newman), Performance test (k6) và UI test (Cypress) dùng công cụ khác nhau.
        *   *Giải pháp:* Sử dụng Allure Report làm định dạng chuẩn để tổng hợp toàn bộ kết quả vào một Dashboard báo cáo duy nhất cho Thành viên E.

---
> 🚨 **AI AUDIT:** Prompt và kết quả AI dùng cho báo cáo này được lưu chi tiết trong file [ai_audit_log_D_Week3.md](file:///d:/Projects/Code/school/ktpm/New%20folder/Software-Testing-CICD-Test-Harness/docs/ai-audit-logs/Week3/PersonD/ai_audit_log_D_Week3.md) và commit lên `docs/ai-audit-logs/Week3/PersonD/`.
