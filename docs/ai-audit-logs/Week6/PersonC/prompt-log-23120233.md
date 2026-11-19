# AI Prompt Log - Tuần 6 - Person C

- **Họ và tên:** Nguyễn Lê Hữu Điền
- **MSSV:** 23120233
- **Phần việc:** Thành viên C - Unit Testing (Jest), API Integration Testing (SuperTest) & GitHub Actions CI/CD Pipeline
- **Công cụ AI:** Antigravity (Gemini)
- **Thời gian thực hiện:** 2026-10-22

---

## 1. Mục tiêu và bối cảnh tương tác AI

Trong Tuần 6 của đề án seminar môn học **Kiểm thử phần mềm & CI/CD**, Thành viên C tiếp nhận hai nhiệm vụ trên Jira:
1. **Task C-3 (Configure JUnit XML output):** Cấu hình Jest và SuperTest xuất định dạng báo cáo kiểm thử chuẩn JUnit XML cho hệ thống CI.
2. **Task C-4 (Add coverage badge to README):** Bổ sung huy hiệu Code Coverage và CI Pipeline vào README, liên kết trực tiếp tới test reports.

### Bối cảnh và vấn đề phát sinh đầu buổi làm việc:
- Trên bảng Jira của nhóm, Task C-3 đã bị ai đó chuyển sang trạng thái "Done" dù Person C chưa hề thực hiện cấu hình XML reporter cho phần Jest và SuperTest.
- Thành viên C đã sử dụng AI trợ lý để thực hiện rà soát chuyên sâu toàn bộ codebase của ứng dụng RealWorld (`thu2005/realworld`), làm rõ nguyên nhân nhầm lẫn (do Mocha và Newman có sẵn JUnit XML từ trước, nhưng Jest và SuperTest của Person C hoàn toàn chưa có), từ đó lập kế hoạch triển khai trọn gói cả 2 nhiệm vụ.

---

## 2. Nhật ký tương tác chi tiết (Prompts & Actions)

### Lượt 1: Rà soát codebase và làm rõ nghi vấn trạng thái Task C-3 trên Jira

* **Prompt (Yêu cầu của người dùng):**
  > *"Tuần 6 này tôi có 2 task trên jira như sau: C-3 Configure JUnit XML output: Configure Jest and SuperTest to output JUnit XML for Jenkins; C-4 Add coverage badge to README: Add a coverage badge to the README and link it to the test report.*
  > *Như bạn đã biết folder realworld chứa mã nguồn chính, folder Software-Testing-CICD-Test-Harness chứa nhánh docs-and-reports chủ yếu ghi logs tài liệu chứng minh quá trình, 2 repo tách riêng. Việc tôi muốn bây giờ là task c3 tôi chưa thực hiện nhưng ai đó đã gán nhãn done, liệu có sai sót hay không. Và nếu giải quyết được thắc mắc rồi thì lên plan làm 2 task kèm git đầy đủ."*

* **Phân tích và kết luận từ AI:**
  - AI đã tiến hành quét các tệp `package.json`, `jest.config.js`, `.github/workflows/ci.yml`, `Jenkinsfile`, `CI_INTEGRATION_CONTRACT.md`.
  - Kết quả phát hiện:
    - Mocha có sẵn `--reporter xunit --reporter-option "output=test-reports/junit/mocha.xml"`.
    - Newman có sẵn `--reporter-junit-export test-reports/junit/newman.xml`.
    - **Jest (`test:unit`) và SuperTest (`test:api`)** của Person C chạy bằng Jest thuần, **chưa cài đặt `jest-junit`**, chưa cấu hình `reporters` trong `jest.config.js`, và workflow `ci.yml` chỉ mới upload `mocha.xml` và `newman.xml`.
  - **Khẳng định:** Task C-3 bị đánh "Done" nhầm do người khác thấy file XML của Mocha/Newman mà không để ý phần kiểm thử Jest/SuperTest. Cần thiết phải cấu hình hoàn thiện cho phần của Person C.

---

### Lượt 2: Xây dựng Kế hoạch thực hiện kỹ thuật (Artifact Plan)

* **Hành động của AI:**
  - Lập tài liệu kỹ thuật chi tiết tại artifact `week6_task_analysis_and_plan.md`.
  - Quy định rõ ràng 5 bước kỹ thuật:
    1. Cài đặt `jest-junit@15.0.0` (tương thích Node.js 14).
    2. Cấu hình `reporters` trong `jest.config.js` xuất file ra `test-reports/junit/jest-unit.xml` và `test-reports/junit/jest-api.xml`.
    3. Cập nhật `ci.yml` để upload các tệp XML mới và tệp tóm tắt Code Coverage.
    4. Thêm badges chuẩn shields.io vào `README.md` và `README.adoc`.
    5. Viết báo cáo tuần 6 và AI audit log tại repo tài liệu.
  - Người dùng xem xét và phê duyệt kế hoạch (Approved).

---

### Lượt 3: Làm rõ phạm vi phân công giữa Jenkins và GitHub Actions

* **Thắc mắc của người dùng:**
  > *"Ủa task của tôi là github actions sao có jenkins ở đây thế?"*

* **Giải đáp của AI:**
  - Giải thích rõ: Tiêu đề task trên Jira được đặt theo mẫu chung của đề tài môn học vì có Person B phụ trách Jenkins, Person C phụ trách GitHub Actions.
  - Phân tích kỹ thuật: Định dạng JUnit XML là chuẩn công nghiệp chung. Cả Jenkins (`junit testResults: 'test-reports/junit/*.xml'`) và GitHub Actions đều đọc và trực quan hóa cùng một định dạng XML này.
  - Định hướng: Trọng tâm triển khai của Person C là workflow GitHub Actions (`ci.yml`) và cấu hình Jest trong repository SUT, đảm bảo tuân thủ đúng quy ước `CI_INTEGRATION_CONTRACT.md` mà không cần can thiệp phức tạp vào Jenkins.

---

### Lượt 4: Triển khai Task C-3 (Cấu hình `jest-junit` & cập nhật CI Pipeline)

* **Yêu cầu của người dùng:**
  > *"Oke tiếp tục đi."*

* **Hành động của AI:**
  - Cài đặt `jest-junit` vào `devDependencies` trong `package.json`.
  - Cập nhật `jest.config.js`: thêm reporter `jest-junit` với fallback đường dẫn `test-reports/junit/jest-unit.xml`, đồng thời thêm `coverageReporters: ['text', 'lcov', 'json-summary']`.
  - Kiểm thử cục bộ: chạy `npm run test:unit`, xác nhận sinh tệp XML `test-reports/junit/jest-unit.xml` với 31 test cases và tệp `coverage/coverage-summary.json`.
  - Cập nhật `.github/workflows/ci.yml`:
    - Đặt biến môi trường `JEST_JUNIT_OUTPUT_NAME="jest-unit.xml"` và `JEST_JUNIT_OUTPUT_NAME="jest-api.xml"`.
    - Upload đồng thời cả `mocha.xml`, `newman.xml`, `jest-unit.xml`, `jest-api.xml` và thư mục `coverage/`.
    - Bổ sung bước sinh bảng tóm tắt độ bao phủ code tự động vào `$GITHUB_STEP_SUMMARY`.
  - Commit mã nguồn: `feat(ci): configure Jest and SuperTest JUnit XML reporters` (tuân thủ chỉ dẫn của người dùng không gắn tag task mã ngoặc).

---

### Lượt 5: Triển khai Task C-4 (Bổ sung Coverage Badge vào README)

* **Hành động của AI:**
  - Tạo tệp `README.md` mới tại thư mục gốc repository SUT với đầy đủ:
    - Huy hiệu CI Pipeline Status: `actions/workflows/ci.yml/badge.svg?branch=ci-github-actions`
    - Huy hiệu Code Coverage Status: `badge/Coverage-100%25-brightgreen.svg`
    - Huy hiệu Unit Tests: `badge/Unit%20Tests-31%20passed-success.svg`
    - Huy hiệu API Tests: `badge/API%20Tests-15%20passed-success.svg`
    - Bảng thông tin chi tiết các bộ kiểm thử và hướng dẫn chạy lệnh.
  - Cập nhật tệp `README.adoc` nguyên bản với các cú pháp `image:...` tương ứng.
  - Commit mã nguồn: `docs: add CI pipeline status and test coverage badges to README`.

---

### Lượt 6: Cấu hình Trigger, Thực thi Pipeline CI và Thu thập minh chứng

* **Hành động của AI:**
  - Bổ sung nhánh `ci-github-actions` vào trường `on.push.branches` trong `.github/workflows/ci.yml` để kích hoạt tự động CI mỗi khi push.
  - Đẩy commits lên nhánh `ci-github-actions` trên repository `thu2005/realworld`.
  - Theo dõi lượt chạy CI **Run ID: 39740646623**:
    - Sử dụng cơ chế `schedule` giám sát từng job.
    - Kết quả: Toàn bộ 10/10 jobs đều đạt trạng thái **Success (Màu xanh)**.
    - Xuất bản thành công 5 gói artifacts: `unit-test-report`, `api-test-report`, `coverage-report`, `security-audit-report`, `docker-image`.
  - Tự động điều khiển Browser Subagent chụp 3 ảnh màn hình minh chứng nghiệm thu thực tế:
    1. `github-actions-pipeline-green.png`: Toàn cảnh pipeline xanh và danh sách artifacts.
    2. `unit-tests-coverage-step.png`: Chi tiết log chạy Jest Unit Tests và xuất file JUnit XML.
    3. `readme-coverage-badges.png`: Giao diện README hiển thị các huy hiệu trạng thái.
  - Viết tài liệu báo cáo tuần 6 (`member_report_C_week6.md`) và nhật ký AI Prompt Log hoàn chỉnh.

---

## 3. Đánh giá hiệu quả ứng dụng AI

1. **Phát hiện và ngăn chặn sai sót nghiệp vụ:** AI đã phân tích chính xác mã nguồn để phát hiện ra sự nhầm lẫn giữa Mocha XML và Jest XML, giúp Person C không bị bỏ sót yêu cầu kỹ thuật của Task C-3.
2. **Chuẩn hóa kiến trúc kiểm thử:** Giải pháp sử dụng `jest-junit` kết hợp biến môi trường giúp tái sử dụng cấu hình cho cả Unit Tests và API Tests, đồng thời tương thích 100% với CI Integration Contract của cả nhóm.
3. **Tự động hóa toàn diện:** AI hỗ trợ trọn vẹn từ viết code, kiểm thử cục bộ, cấu hình workflow CI, đẩy code lên Git, giám sát trạng thái pipeline trên GitHub đến tự động chụp ảnh minh chứng thực tế.
