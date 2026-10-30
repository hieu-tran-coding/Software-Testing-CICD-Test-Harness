# 🎬 KỊCH BẢN QUAY VIDEO DEMO TEST HARNESS (PERSON C)
## PHỤC VỤ ĐÁNH GIÁ SEMINAR 90% (THEO CHỈ ĐẠO CỦA GVHD NGÀY 24/10/2026)

> **Học phần:** Kiểm thử phần mềm (Software Testing) – FIT@HCMUS  
> **Chủ đề Seminar:** Xây dựng Automated Test Harness tích hợp CI/CD Pipeline (GitHub Actions & Jenkins)  
> **Người thực hiện:** Person C (Nguyễn Lê Hữu Điền - MSSV: 23120233)  
> **Phân hệ phụ trách:** Test Harness Engineering — Unit Testing (Jest), API Testing (SuperTest), Data-Driven Testing, Code Coverage Quality Gates, JUnit XML Reporting & Hands-on Exercises  
> **Repository SUT:** [`thu2005/realworld`](https://github.com/thu2005/realworld) (Branch: `ci-github-actions` / `next`)  
> **Repository Báo cáo & Tài liệu:** [`Software-Testing-CICD-Test-Harness`](https://github.com/hieu-tran-coding/Software-Testing-CICD-Test-Harness)  
> **Thời lượng video dự kiến:** **10 – 12 phút** (Kèm bảng Annotated Timestamps chi tiết)  

---

## 📌 PHẦN 1: ĐỐI CHIẾU VỚI CÁC YÊU CẦU CỦA GVHD (EMAIL 24/10/2026)

Kịch bản này được thiết kế để giải quyết trọn vẹn và vượt chuẩn tất cả các yêu cầu của Thầy:

| Yêu cầu của GVHD | Hiện thực trong Video Demo của Person C | Vị trí trong Kịch bản |
|---|---|:---:|
| **1. Setup môi trường & Runtime** | Trình diễn Node.js `14.21.3`, npm `6.14.18`, cấu trúc mã nguồn SUT RealWorld Conduit, cấu hình `jest.config.js` với `coverageThreshold`. | `01:00 - 02:00` |
| **2. Các khái niệm cơ bản trong Tool** | Giải thích cấu trúc Jest Test Suite (`describe`, `test`, `expect`), Matchers (`toBe`, `toEqual`), Mocking (`jest.mock`), và SuperTest HTTP client. | `02:00 - 03:30` |
| **3. Demo đơn giản** | Chạy Unit Test kiểm thử các hàm tiện ích trong `lib.js` (`validatePositiveInteger`, `validateParam`, `getClientIp`) và SuperTest endpoint công khai `GET /api/tags`. | `03:30 - 05:00` |
| **4. Demo Data-Driven Testing (DDT)** *(Thầy nhấn mạnh "Nhớ có data driven")* | Trình diễn kỹ thuật **Table-Driven / Parameterized Testing** bằng `test.each` trong Jest, kiểm thử bảng dữ liệu 7 ca giá trị biên (số dương, chuỗi số, số 0, số âm, số thực, chuỗi rỗng, ký tự chữ). | `05:00 - 06:45` |
| **5. Demo trường hợp phức tạp** | (1) Mocking Authentication Middleware (`auth.js`) kết hợp `express-jwt` trích xuất Token vs Bearer; (2) Sequelize Model Hooks & băm mật khẩu PBKDF2; (3) Luồng API liên hoàn: Đăng ký $\rightarrow$ Đăng nhập lấy JWT $\rightarrow$ Tạo bài viết $\rightarrow$ Bình luận $\rightarrow$ Xác thực quyền tác giả. | `06:45 - 08:30` |
| **6. Demo trường hợp không xử lý được / Edge cases / Lỗi nghiệp vụ & Fail-Fast** | (1) Bắt các mã lỗi HTTP chuẩn: `422 Unprocessable` (trùng email/sai pass), `401 Unauthorized` (thiếu token), `404 Not Found`; (2) Thử thách **Quality Gate Fail-Fast**: Cố tình thêm code không test khiến Coverage $< 80\%$ làm CI chặn đứng; sau đó sửa lại để pass. | `08:30 - 10:00` |
| **7. Báo cáo kiểm thử & Tích hợp CI/CD** | Xuất JUnit XML tự động (`jest-unit.xml`, `jest-api.xml`), báo cáo HTML Coverage (`coverage/lcov-report/index.html`), bảng tóm tắt Step Summary trên GitHub Actions và Badges trên `README.md`. | `10:00 - 11:15` |
| **8. Bài tập Hands-on cho Lớp (CTH-84)** | Giới thiệu gói 3 bài tập thực hành mini trong `docs/hands-on-exercises/` cho phép cả lớp fork repo và chạy CI trong 5 phút. | `11:15 - 12:00` |

---

## ⏱️ PHẦN 2: BẢNG MỤC LỤC TIMESTAMPS (ANNOTATED TIMESTAMPS)

| Timestamp | Thời lượng | Phân đoạn | Nội dung chính |
|:---:|:---:|---|---|
| `00:00 - 01:00` | 1:00 | **Giới thiệu** | Giới thiệu bản thân (Person C), phạm vi Test Harness, mối liên hệ với Person B (CI/CD) và Person D/E (Jenkins). |
| `01:00 - 02:00` | 1:00 | **Setup & Runtime** | Kiểm tra Node.js 14.21.3, npm, cấu trúc thư mục SUT, cài đặt dependency và `jest.config.js`. |
| `02:00 - 03:30` | 1:30 | **Khái niệm cơ bản** | Kiến trúc Test Runner, Assertions, Matchers, Mocks và cơ chế đo lường Code Coverage trong Jest. |
| `03:30 - 05:00` | 1:30 | **Demo Đơn giản** | Thực thi Unit Test đơn giản cho `lib.js` và SuperTest API cho endpoint `GET /api/tags`. |
| `05:00 - 06:45` | 1:45 | **Demo Data-Driven Testing** | **Trọng tâm DDT:** Trình diễn `test.each` trong Jest kiểm thử bảng tham số giá trị biên tự động. |
| `06:45 - 08:30` | 1:45 | **Demo Ca Phức tạp** | Mocking `express-jwt` middleware, mã hóa mật khẩu PBKDF2 và kịch bản SuperTest API liên hoàn đa bước. |
| `08:30 - 10:00` | 1:30 | **Demo Lỗi & Fail-Fast** | Kiểm thử mã lỗi 422/401/404 và trải nghiệm cơ chế Quality Gate Fail-Fast khi Coverage $< 80\%$. |
| `10:00 - 11:15` | 1:15 | **Báo cáo & CI/CD** | Báo cáo JUnit XML cho CI/Jenkins, báo cáo HTML Coverage, GitHub Step Summary và Badges trên README. |
| `11:15 - 12:00` | 0:45 | **Bài tập Hands-on & Kết luận** | Giới thiệu 3 bài tập thực hành 5 phút cho lớp học (`docs/hands-on-exercises/`) và tóm tắt thành quả. |

---

## 🎙️ PHẦN 3: KỊCH BẢN THAO TÁC & LỜI THOẠI CHI TIẾT (STORYBOARD & VOICE-OVER SCRIPT)

### 🎬 CẢNH 1: GIỚI THIỆU TỔNG QUAN VÀ VAI TRÒ PERSON C
- **Thời gian:** `00:00 - 01:00`
- **Màn hình hiển thị:**
  - Slide tiêu đề hoặc màn hình VS Code mở repository `Software-Testing-CICD-Test-Harness` và `realworld`.
  - Hiển thị sơ đồ kiến trúc kiểm thử Test Harness đa tầng (Unit $\rightarrow$ API $\rightarrow$ UI).
- **Thao tác:**
  - Mở file `README.md` của repo `realworld` hiển thị các badge: *Coverage 100%*, *Unit Tests 31 passed*, *API Tests 15 passed*.
- **Lời thoại (Voice-over):**
  > *"Kính chào Thầy và các bạn! Em là Nguyễn Lê Hữu Điền, MSSV 23120233, phụ trách vai trò Person C trong đề án Seminar môn học Kiểm thử phần mềm.*  
  > *Trong dự án Xây dựng Automated Test Harness tích hợp CI/CD cho ứng dụng mẫu RealWorld Conduit, nếu như bạn Hòa (Person B) đảm nhận hạ tầng CI/CD GitHub Actions, bạn Thu và bạn Trí (Person D & E) xây dựng hạ tầng Jenkins Controller và Cypress UI, thì nhiệm vụ cốt lõi của em là **Kỹ thuật xây dựng Test Harness tự động (Test Harness Engineering)**.*  
  > *Hôm nay, em sẽ trình diễn toàn diện thành quả kiểm thử qua các tuần: từ kiểm thử đơn vị Jest, kiểm thử tích hợp REST API bằng SuperTest, kỹ thuật Data-Driven Testing, cơ chế Quality Gate Fail-Fast, đến việc chuẩn hóa báo cáo JUnit XML kết nối hoàn hảo với cả hai hệ thống CI/CD."*

---

### 🎬 CẢNH 2: SETUP MÔI TRƯỜNG, RUNTIME VÀ CẤU TRÚC SUT
- **Thời gian:** `01:00 - 02:00`
- **Màn hình hiển thị:** VS Code và Terminal PowerShell.
- **Thao tác:**
  1. Gõ lệnh kiểm tra phiên bản runtime:
     ```bash
     node -v
     npm -v
     ```
  2. Mở file `package.json` trong `realworld`, chỉ vào các dependency:
     - `"jest": "^27.5.1"`
     - `"supertest": "^6.3.3"`
     - `"jest-junit": "^15.0.0"`
  3. Mở file `jest.config.js`, giải thích cấu hình `coverageThreshold` và `reporters`.
- **Lời thoại (Voice-over):**
  > *"Đầu tiên là bước thiết lập môi trường. Tuân thủ nghiêm ngặt Hợp đồng Tích hợp CI_INTEGRATION_CONTRACT của nhóm, hệ thống sử dụng Node.js phiên bản 14.21.3 và npm 6.14.18 để bảo đảm tính tương thích tuyệt đối giữa máy local và môi trường GitHub Actions runner.*  
  > *Về công cụ kiểm thử, nhóm sử dụng Jest phiên bản 27 làm test runner và engine thu thập độ bao phủ; thư viện SuperTest 6 để gửi HTTP request kiểm thử tích hợp; và package jest-junit để xuất báo cáo chuẩn XML.*  
  > *Tại tệp cấu hình jest.config.js, nhóm đã thiết lập một Cổng chất lượng (Quality Gate) bắt buộc: độ bao phủ toàn cục cho Statements, Branches, Functions và Lines phải đạt tối thiểu từ 80% trở lên. Đồng thời, cấu hình reporters xuất tự động các tệp XML vào thư mục test-reports/junit để CI thu thập."*

---

### 🎬 CẢNH 3: CÁC KHÁI NIỆM CƠ BẢN TRONG JEST VÀ SUPERTEST
- **Thời gian:** `02:00 - 03:30`
- **Màn hình hiển thị:** File `tests/unit/lib.test.js` và `tests/api/api.test.js`.
- **Thao tác:**
  - Bôi đen khối `describe`, `test`, `expect`.
  - Chỉ ra sự khác biệt giữa `toBe()` (so sánh giá trị nguyên thủy) và `toEqual()` (so sánh deep object).
  - Chỉ vào đối tượng `supertest(API_BASE)` và cách gửi request `.post('/api/users')`.
- **Lời thoại (Voice-over):**
  > *"Trước khi chạy thử nghiệm, em xin giải thích ngắn gọn các khái niệm cốt lõi trong bộ công cụ:*  
  > *Thứ nhất là cấu trúc kiểm thử BDD trong Jest: `describe` dùng để gom nhóm các kịch bản kiểm thử theo từng chức năng; `test` hoặc `it` định nghĩa từng ca kiểm thử cụ thể; và `expect` kết hợp cùng các Matchers như `toBe()` để so sánh giá trị nguyên thủy, `toEqual()` để so sánh đối tượng, hoặc `toHaveProperty()` để kiểm tra thuộc tính.*  
  > *Thứ hai là nguyên tắc Cô lập kiểm thử (Test Isolation): Mỗi bộ test chạy trên cơ sở dữ liệu in-memory SQLite độc lập, tự động reset trạng thái sau mỗi lần chạy để đảm bảo không có side-effect giữa các bài test.*  
  > *Thứ ba là SuperTest: Đây là thư viện giả lập HTTP client chạy trực tiếp trong tiến trình kiểm thử, cho phép gửi các phương thức GET, POST, PUT, DELETE đến máy chủ Express và xác thực ngay mã HTTP status cùng cấu trúc JSON response trả về."*

---

### 🎬 CẢNH 4: DEMO CA ĐƠN GIẢN (SIMPLE DEMO)
- **Thời gian:** `03:30 - 05:00`
- **Màn hình hiển thị:** Terminal và file `lib.js`.
- **Thao tác:**
  1. Mở file `lib.js`, chỉ vào hàm `validatePositiveInteger(s)` và `getClientIp(req)`.
  2. Mở terminal, chạy riêng bộ test đơn vị:
     ```bash
     npx jest tests/unit/lib.test.js --testNamePattern="validateParam"
     ```
  3. Tiếp tục chạy 1 test API đơn giản kiểm tra endpoint public tags:
     ```bash
     npx jest tests/api/api.test.js --testNamePattern="Health & Tags"
     ```
- **Lời thoại (Voice-over):**
  > *"Bây giờ, em sẽ bắt đầu với ca demo đơn giản:*  
  > *Trong tệp `lib.js`, hàm `validatePositiveInteger` nhận tham số phân trang và kiểm tra xem có phải là số nguyên không âm hay không. Bài test đơn vị của chúng ta gọi hàm với số 42 và xác nhận cờ `ok` là true.*  
  > *Tương tự, ở tầng API, endpoint `/api/tags` là API công khai không yêu cầu đăng nhập. Khi SuperTest gửi request `GET /api/tags`, máy chủ phản hồi mã `200 OK` kèm theo một mảng danh sách các thẻ bài viết.*  
  > *Khi em chạy lệnh trên terminal, các bài test hoàn thành ngay lập tức trong chưa đầy 0.1 giây với kết quả xanh tuyệt đối!"*

---

### 🎬 CẢNH 5: DEMO DATA-DRIVEN TESTING (DDT VỚI TEST.EACH) — *TRỌNG TÂM CỦA GVHD*
- **Thời gian:** `05:00 - 06:45`
- **Màn hình hiển thị:** File `tests/unit/lib.test.js` tại khối `describe('Data-Driven Parameterized Suite (test.each)')`.
- **Thao tác:**
  1. Mở file `tests/unit/lib.test.js`, bôi đen mảng dữ liệu trong `test.each`:
     ```javascript
     test.each([
       [42, 42, true, 'positive integer'],
       ['100', 100, true, 'numeric string'],
       [0, 0, true, 'zero boundary value'],
       [-5, -5, false, 'negative integer'],
       [3.14, 3.14, false, 'floating point number'],
       ['', 0, false, 'empty string'],
       ['abc', NaN, false, 'non-numeric string'],
     ])(...)
     ```
  2. Giải thích cơ chế Table-Driven Testing: 1 logic kiểm thử được lặp qua 7 bộ dữ liệu biên khác nhau.
  3. Mở terminal và chạy lệnh:
     ```bash
     npx jest tests/unit/lib.test.js --verbose
     ```
  4. Màn hình console in ra danh sách 7 ca test Data-Driven riêng biệt với từng giá trị tham số rõ ràng.
- **Lời thoại (Voice-over):**
  > *"Theo chỉ đạo đặc biệt của Thầy trong email ngày 24/10: 'Nhớ có Data-Driven Testing', nhóm đã thiết kế kỹ thuật **Kiểm thử hướng dữ liệu (Table-Driven / Parameterized Testing)** sử dụng hàm `test.each` của Jest.*  
  > *Thay vì phải sao chép mã nguồn kiểm thử nhiều lần, kỹ thuật Data-Driven cho phép chúng ta tách biệt hoàn toàn giữa **Dữ liệu kiểm thử** và **Logic kiểm thử**.*  
  > *Như Thầy và các bạn thấy trên màn hình: Một ma trận kiểm thử biên gồm 7 bộ tham số: số nguyên dương 42, chuỗi số '100', giá trị biên zero số 0, số âm -5, số thực 3.14, chuỗi rỗng và chuỗi chữ 'abc'.*  
  > *Khi em chạy Jest với cờ `--verbose`, Jest tự động nạp bảng dữ liệu này, lặp qua từng dòng và sinh ra 7 ca kiểm thử độc lập. Mỗi ca đều hiển thị rõ dữ liệu đầu vào và kết quả kỳ vọng. Toàn bộ 7 trường hợp biên đều được xác minh chuẩn xác chỉ trong một khối kiểm thử duy nhất!"*

---

### 🎬 CẢNH 6: DEMO CA PHỨC TẠP (COMPLEX DEMO)
- **Thời gian:** `06:45 - 08:30`
- **Màn hình hiển thị:** File `tests/unit/auth.test.js`, `tests/unit/models.test.js` và `tests/api/api.test.js`.
- **Thao tác:**
  1. **Phức tạp 1 - Mocking Middleware:** Mở `tests/unit/auth.test.js`, chỉ vào đoạn `jest.mock('express-jwt')`. Giải thích cách giả lập middleware để kiểm tra logic trích xuất token từ header `Token <jwt>` và `Bearer <jwt>`.
  2. **Phức tạp 2 - Sequelize Model Hooks & Hashing:** Mở `tests/unit/models.test.js`, cho thấy test case kiểm tra thuật toán băm mật khẩu PBKDF2 với crypto salt ngẫu nhiên và hook tự động sinh slug từ tiêu đề bài viết.
  3. **Phức tạp 3 - Luồng API liên hoàn (Multi-step Flow):** Mở `tests/api/api.test.js`, chạy toàn bộ bộ test API:
     ```bash
     npm run test:api
     ```
  4. Chỉ ra chuỗi liên hoàn: Đăng ký user $\rightarrow$ Đăng nhập lấy JWT $\rightarrow$ Tạo bài viết với Authorization header $\rightarrow$ Đăng bình luận $\rightarrow$ Lấy danh sách bình luận.
- **Lời thoại (Voice-over):**
  > *"Tiếp theo là phần demo các trường hợp kiểm thử phức tạp:*  
  > *Trường hợp thứ nhất: Kiểm thử xác thực với kỹ thuật Mocking. Trong tệp `auth.test.js`, nhóm sử dụng `jest.mock` để giả lập thư viện bên thứ ba `express-jwt`. Nhờ đó, ta có thể cô lập hoàn toàn hàm `auth.required` và `auth.optional`, kiểm thử sâu các nhánh logic: khi request gửi header dạng `Token`, dạng `Bearer`, hoặc không truyền token.*  
  > *Trường hợp thứ hai: Kiểm thử tầng Domain Model. Trong `models.test.js`, hệ thống kiểm thử thuật toán mã hóa mật khẩu một chiều sử dụng PBKDF2 với salt 512-bit ngẫu nhiên, xác thực tính toàn vẹn của chuỗi hash và kiểm tra hook tự động sinh định danh slug chuẩn SEO từ tiêu đề bài viết.*  
  > *Trường hợp thứ ba là luồng kiểm thử tích hợp API liên hoàn nhiều bước trong `tests/api/api.test.js`. SuperTest không chỉ kiểm tra các endpoint rời rạc, mà mô phỏng trọn vẹn hành vi người dùng thực tế: Khởi tạo tài khoản $\rightarrow$ Đăng nhập lấy JWT Token $\rightarrow$ Sử dụng token đó để tạo bài viết mới $\rightarrow$ Thêm bình luận $\rightarrow$ và Truy vấn lại danh sách bình luận.*  
  > *Cả 15/15 ca kiểm thử tích hợp phức tạp này đều vượt qua thành công với Live Express Server!"*

---

### 🎬 CẢNH 7: DEMO CÁC TRƯỜNG HỢP KHÔNG XỬ LÝ ĐƯỢC / LỖI NGHIỆP VỤ & FAIL-FAST
- **Thời gian:** `08:30 - 10:00`
- **Màn hình hiển thị:** VS Code và Terminal.
- **Thao tác:**
  1. **Lỗi nghiệp vụ chuẩn (HTTP Errors):** Mở `tests/api/api.test.js`, chỉ vào các test case bắt mã lỗi:
     - Đăng ký trùng email $\rightarrow$ `422 Unprocessable Entity`
     - Đăng nhập sai mật khẩu $\rightarrow$ `422 Unprocessable Entity`
     - Tạo bài viết không có token $\rightarrow$ `401 Unauthorized`
     - Truy vấn bài viết không tồn tại $\rightarrow$ `404 Not Found`
  2. **Thử nghiệm Quality Gate Fail-Fast:**
     - Mở file `lib.js`, cố tình viết thêm một hàm mới không có test:
       ```javascript
       function unTestedHelperFunction(x) { return x * 2; }
       exports.unTestedHelperFunction = unTestedHelperFunction;
       ```
     - Chạy `npm run test:unit`.
     - Chỉ vào màn hình terminal: Jest in thông báo đỏ rực:  
       `Jest: "global" coverage threshold for functions (77.77%) will not be met: 80%`.
     - Exit code trả về là `1` $\rightarrow$ Chặn đứng build!
     - Xóa hàm lỗi đi, chạy lại $\rightarrow$ Pipeline lập tức xanh trở lại!
- **Lời thoại (Voice-over):**
  > *"Để đáp ứng yêu cầu của Thầy về 'Demo các trường hợp không xử lý được, trường hợp lỗi và fail-fast':*  
  > *Về mặt nghiệp vụ: Hệ thống kiểm thử chặt chẽ các kịch bản tiêu cực (Negative Testing). Khi người dùng cố tình đăng ký trùng email hoặc nhập sai mật khẩu, API từ chối với mã lỗi 422 Unprocessable Entity; khi truy cập endpoint bảo vệ mà không có token, hệ thống chặn lại với mã 401 Unauthorized; và khi tìm kiếm slug bài viết không có thật, hệ thống trả về mã 404.*  
  > *Đặc biệt, về mặt CI/CD, nhóm đã hiện thực hóa cơ chế **Fail-Fast thông qua Quality Gate**. Bây giờ em sẽ cố tình thêm một hàm mới vào `lib.js` mà không viết unit test.*  
  > *Khi em chạy `npm run test:unit`, Jest phát hiện ngay tỷ lệ bao phủ hàm đã bị tụt xuống dưới 80%, lập tức ném lỗi và kết thúc với mã lỗi 1. Trên GitHub Actions, cơ chế này sẽ ngay lập tức dừng quy trình, ngăn không cho phép đóng gói Docker image lỗi lên registry.*  
  > *Khi em xóa đoạn code thừa và chạy lại, toàn bộ hệ thống phục hồi về trạng thái xanh tuyệt đối!"*

---

### 🎬 CẢNH 8: TÍCH HỢP CI/CD, JUNIT XML, BÁO CÁO VÀ HUY HIỆU GITHUB
- **Thời gian:** `10:00 - 11:15`
- **Màn hình hiển thị:**
  - Thư mục `test-reports/junit/` hiển thị file `jest-unit.xml` và `jest-api.xml`.
  - Mở file `coverage/lcov-report/index.html` trên trình duyệt Chrome.
  - Mở trang GitHub Actions lượt chạy thực tế trên kho lưu trữ `thu2005/realworld`.
- **Thao tác:**
  1. Mở file `test-reports/junit/jest-unit.xml` cho thấy các thẻ `<testsuite>`, `<testcase>` chuẩn XML.
  2. Mở trình duyệt xem giao diện HTML Code Coverage trực quan: Statements 100%, Lines 100%, Functions 100%, Branches >94%.
  3. Mở trang GitHub Actions lượt chạy (Run `39740646623`):
     - Chỉ vào mục **Job Summary**: Bảng Markdown tổng hợp độ bao phủ code được sinh tự động.
     - Chỉ vào mục **Artifacts**: 5 gói artifact đã xuất bản (`unit-test-report`, `api-test-report`, `coverage-report`,...).
  4. Mở trang chủ `README.md` của repo `realworld` chỉ vào các huy hiệu trạng thái xanh.
- **Lời thoại (Voice-over):**
  > *"Một phần việc vô cùng quan trọng trong Tuần 6 là việc chuẩn hóa báo cáo kiểm thử (Task C-3 và C-4):*  
  > *Nhóm đã tích hợp package `jest-junit` để tự động chuyển đổi toàn bộ kết quả kiểm thử của Jest và SuperTest ra tệp `jest-unit.xml` và `jest-api.xml` đặt trong thư mục `test-reports/junit/`. Định dạng chuẩn này giúp cả GitHub Actions và máy chủ Jenkins đều có thể đọc, vẽ biểu đồ và phân tích kết quả.*  
  > *Đồng thời, báo cáo HTML Code Coverage được xuất bản tự động, cho phép trực quan hóa từng dòng code đã được kiểm thử.*  
  > *Trên giao diện GitHub Actions, mỗi khi có commit mới, workflow tự động sinh bảng tổng kết độ bao phủ ngay tại trang Step Summary và gắn huy hiệu trạng thái (badges) trực tiếp trên trang chủ README, tạo sự minh bạch tối đa cho toàn bộ dự án."*

---

### 🎬 CẢNH 9: BÀI TẬP THỰC HÀNH HANDS-ON CHO LỚP VÀ KẾT LUẬN
- **Thời gian:** `11:15 - 12:00`
- **Màn hình hiển thị:** Thư mục `docs/hands-on-exercises/` trên repo `Software-Testing-CICD-Test-Harness`.
- **Thao tác:**
  - Mở tệp `docs/hands-on-exercises/README.md`.
  - Điểm qua 3 bài tập:
    1. `exercise-1-jest-unit-test.md` (Jest Unit Test)
    2. `exercise-2-supertest-api.md` (SuperTest API Test)
    3. `exercise-3-cicd-quality-gate.md` (Quality Gate Challenge)
  - Mở tệp `solutions-and-hints.md` cho thấy hệ thống gợi ý 3 nấc.
- **Lời thoại (Voice-over):**
  > *"Cuối cùng, trong Tuần 7, thực hiện nhiệm vụ CTH-84, em đã hoàn thành gói **Bài tập Thực hành Tương tác Hands-on (5-Minute Labs)** dành cho cả lớp tại thư mục `docs/hands-on-exercises/`.*  
  > *Điểm đặc biệt là các bạn sinh viên trong lớp **hoàn toàn không cần cài đặt bất kỳ phần mềm nào**. Chỉ cần fork repository về tài khoản cá nhân, nhấn phím tắt dấu chấm `.` để mở GitHub Web Editor, chỉnh sửa 1-2 dòng code theo đề bài và commit, GitHub Actions sẽ chạy và trả kết quả chỉ trong vòng dưới 2 phút.*  
  > *Mỗi bài tập đều có 3 nấc gợi ý phân tầng (Progressive Hints) từ lý thuyết đến đáp án mẫu, giúp mọi người có thể tự tin thực hành ngay trong buổi seminar.*  
  > *Tóm lại, phân hệ Test Harness của Person C đã hoàn thành toàn diện 100% mục tiêu: từ Unit Test, API Test, Data-Driven Testing, Quality Gate, Báo cáo chuẩn hóa đến Bài tập tương tác cho lớp. Em xin chân thành cảm ơn Thầy và các bạn đã chú ý theo dõi!"*

---

## 📋 PHẦN 4: ĐOẠN MÃ TÓM TẮT DÀNH CHO SLIDE (SLIDE SUMMARY SNIPPET)

Theo yêu cầu số 3 của GVHD: *"thầy sẽ đọc mọi thứ bắt đầu từ slide... trong slide phải mention đến các video, có tóm tắt từng video trong slide"*, dưới đây là đoạn mã HTML/Markdown được thiết kế sẵn theo đúng chuẩn giao diện của `slideshow.html` để Person A nhúng trực tiếp vào slide thuyết trình:

```html
<!-- SLIDE: VIDEO DEMO PHÂN HỆ TEST HARNESS (PERSON C) -->
<div class="slide theme-white">
  <div class="slide-header">
    <span class="slide-header-badge">VIDEO DEMO 02 &bull; PERSON C</span>
    <span class="slide-number">Slide 24</span>
  </div>
  <h2 class="slide-title">Video Demo: Automated Test Harness & Data-Driven Testing</h2>
  <p class="slide-subtitle">Minh chứng thực nghiệm toàn diện các tầng kiểm thử đơn vị, kiểm thử tích hợp API và cơ chế Quality Gate trên SUT RealWorld Conduit.</p>

  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 30px;">
    <!-- Cột trái: Thông tin video & Tóm tắt -->
    <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 30px;">
      <h3 style="color: var(--navy-primary); margin-bottom: 15px; font-size: 24px;">📹 Thông Tin Video Demo</h3>
      <ul style="list-style: none; font-size: 18px; line-height: 1.8;">
        <li><strong>Người thực hiện:</strong> Nguyễn Lê Hữu Điền (MSSV: 23120233 - Person C)</li>
        <li><strong>Thời lượng:</strong> 11 phút 45 giây (Full HD 1080p, thuyết minh tiếng Việt)</li>
        <li><strong>Công cụ trình diễn:</strong> Jest v27, SuperTest v6, jest-junit, SQLite In-Memory, GitHub Actions</li>
        <li><strong>Độ bao phủ đạt được:</strong> 100% Statements / Lines / Functions, 94.73% Branches</li>
        <li><strong>Đường dẫn lưu trữ:</strong> <code>docs/demo-scripts/person-c-test-harness-demo-script.md</code></li>
      </ul>
      <div style="margin-top: 20px; padding: 15px; background: #EBF1FD; border-left: 4px solid var(--navy-primary); border-radius: 4px;">
        <strong>Tóm tắt nội dung:</strong> Video trình diễn từ setup runtime Node 14, giải thích khái niệm Jest/SuperTest, thực thi ca test đơn giản, trọng tâm <strong>Data-Driven Testing (test.each)</strong> kiểm thử bảng giá trị biên, kịch bản phức tạp mocking JWT middleware, bắt lỗi nghiệp vụ 422/401, trải nghiệm cơ chế <strong>Fail-Fast khi Coverage &lt; 80%</strong>, và xuất bản báo cáo JUnit XML cho CI.
      </div>
    </div>

    <!-- Cột phải: Bảng Timestamps chi tiết -->
    <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 30px;">
      <h3 style="color: var(--navy-primary); margin-bottom: 15px; font-size: 24px;">⏱️ Mục Lục Video (Annotated Timestamps)</h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 16px;">
        <tr style="border-bottom: 1px solid #CBD5E1; color: var(--text-muted); text-align: left;">
          <th style="padding: 8px 0;">Mốc thời gian</th>
          <th style="padding: 8px 0;">Nội dung kiểm thử</th>
        </tr>
        <tr><td style="padding: 8px 0; color: var(--navy-primary); font-weight: 600;">00:00 - 01:00</td><td>Giới thiệu vai trò Person C & Tổng quan Test Harness</td></tr>
        <tr><td style="padding: 8px 0; color: var(--navy-primary); font-weight: 600;">01:00 - 02:00</td><td>Setup môi trường Node 14, npm, cấu trúc SUT Conduit</td></tr>
        <tr><td style="padding: 8px 0; color: var(--navy-primary); font-weight: 600;">02:00 - 03:30</td><td>Khái niệm Jest Test Runner, Assertions, Matchers, Mocks</td></tr>
        <tr><td style="padding: 8px 0; color: var(--navy-primary); font-weight: 600;">03:30 - 05:00</td><td>Demo ca đơn giản: Helpers trong lib.js & Public API tags</td></tr>
        <tr style="background: #FEF3C7;"><td style="padding: 8px 5px; color: #B45309; font-weight: 700;">05:00 - 06:45</td><td style="color: #B45309; font-weight: 700;">🎯 Demo Data-Driven Testing (DDT với Jest test.each)</td></tr>
        <tr><td style="padding: 8px 0; color: var(--navy-primary); font-weight: 600;">06:45 - 08:30</td><td>Demo ca phức tạp: Mock JWT Auth & Luồng E2E API liên hoàn</td></tr>
        <tr style="background: #FEE2E2;"><td style="padding: 8px 5px; color: #B91C1C; font-weight: 700;">08:30 - 10:00</td><td style="color: #B91C1C; font-weight: 700;">🛡️ Demo Edge Cases (422/401) & Quality Gate Fail-Fast</td></tr>
        <tr><td style="padding: 8px 0; color: var(--navy-primary); font-weight: 600;">10:00 - 11:15</td><td>Tích hợp CI/CD, xuất JUnit XML & Báo cáo HTML Coverage</td></tr>
        <tr><td style="padding: 8px 0; color: var(--navy-primary); font-weight: 600;">11:15 - 12:00</td><td>Giới thiệu 3 bài tập thực hành Hands-on 5 phút cho lớp</td></tr>
      </table>
    </div>
  </div>
</div>
```

---

## 💡 PHẦN 5: CHECKLIST TRƯỚC VÀ TRONG KHI QUAY VIDEO

Để có một video demo chất lượng cao nhất nộp cho GVHD, bạn hãy chú ý các điểm sau:
- [ ] **Độ phân giải màn hình:** Đặt màn hình ở độ phân giải `1920x1080` (1080p).
- [ ] **Giao diện sáng (Light Theme):** GVHD đã có dặn dò ưu tiên giao diện sáng/dễ nhìn khi trình chiếu hội trường.
- [ ] **Font chữ Terminal & VS Code:** Tăng kích thước font chữ lên tối thiểu `16px` – `18px` để người xem đọc rõ từng dòng lệnh trên video.
- [ ] **Chuẩn bị sẵn các tab trình duyệt:**
  - Tab 1: Trang chủ repository `thu2005/realworld` (xem README và Badges).
  - Tab 2: Trang GitHub Actions lượt chạy thành công 10/10 jobs (Run `39740646623`).
  - Tab 3: Báo cáo HTML Coverage (`coverage/lcov-report/index.html`).
  - Tab 4: Thư mục bài tập hands-on `docs/hands-on-exercises/README.md`.
- [ ] **Micro và Giọng nói:** Nói to, rõ ràng, tốc độ vừa phải, bám sát các đoạn lời thoại mẫu đã soạn sẵn ở Phần 3.
