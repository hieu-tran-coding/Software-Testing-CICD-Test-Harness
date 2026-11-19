# 📋 Giao việc thành viên - Tuần 4

## Thành viên & Vai trò
- **Thành viên A (Leader)** – Quản lý dự án, giám sát CI/CD, điều phối các nhóm.
- **Thành viên B** – Phát triển và tối ưu GitHub Actions workflow.
- **Thành viên C** – Hỗ trợ GitHub Actions, viết script build, cấu hình môi trường và secrets.
- **Thành viên D** – Cài đặt và cấu hình Jenkins, thiết lập webhook GitHub → Jenkins.
- **Thành viên E** – Quản lý pipeline Jenkins, viết tài liệu hướng dẫn sử dụng Jenkins.

## Nhiệm vụ chi tiết

### Thành viên A (Quản lý)
1. **Lập kế hoạch tổng thể**: Đánh giá các hạng mục CI/CD, ưu tiên công việc cho tuần 4.
2. **Phân công nhiệm vụ**: Xác nhận vai trò của B‑C (GitHub) và D‑E (Jenkins) và truyền đạt mục tiêu.
3. **Theo dõi tiến độ**: Kiểm tra hàng ngày bảng Kanban, cập nhật trạng thái trên GitHub Projects.
4. **Kiểm duyệt cấu hình**: Xem lại file cấu hình Jenkins và workflow GitHub Actions trước khi merge.
5. **Audit log**: Đảm bảo mọi thay đổi được ghi lại trong `docs/ai-audit-logs/week-4/` và commit kèm mô tả.

### Thành viên B (GitHub Actions – Phát triển)
1. **Khởi tạo workflow**: Tạo file `.github/workflows/build-test.yml` với các job `build` và `test`.
2. **Cài đặt môi trường**: Định nghĩa các `runs-on`, `actions/setup-node` (hoặc Java/Maven tùy dự án).
3. **Lưu artefacts**: Thêm bước `actions/upload-artifact` để lưu kết quả build.
4. **Kiểm thử**: Chạy workflow trên một pull request mẫu, xác nhận các job chạy thành công.
5. **Tối ưu hóa**: Áp dụng caching (`actions/cache`) cho dependencies nhằm giảm thời gian chạy.
6. **Tài liệu**: Viết README trong thư mục `.github/workflows/` mô tả các trigger, inputs và outputs.

### Thành viên C (GitHub Actions – Hỗ trợ)
1. **Script build**: Viết script `build.sh` hoặc `pom.xml` để thực hiện biên dịch, kiểm thử.
2. **Quản lý secrets**: Tạo và cấu hình secrets trong repo (GH_TOKEN, JENKINS_URL, JENKINS_CRUMB).
3. **Kiểm tra ổn định**: Thực hiện 3 lần chạy liên tiếp của workflow, ghi lại thời gian và lỗi (nếu có).
4. **Log audit**: Đẩy log của workflow vào `docs/ai-audit-logs/week-4/` bằng action `actions/upload-artifact`.
5. **Hỗ trợ B**: Review pull request của B, đề xuất cải tiến (parallel jobs, matrix strategy).

### Thành viên D (Jenkins – Cài đặt)
1. **Triển khai Jenkins**: Khởi chạy container Docker `jenkins/jenkins:lts` hoặc VM, cấu hình port 8080.
2. **Cài plugin**: Cài các plugin cần thiết (GitHub, Pipeline, Credentials, Blue Ocean).
3. **Tạo job mẫu**: Thiết lập pipeline job `ci-cd-demo` sử dụng Jenkinsfile.
4. **Webhook GitHub**: Thiết lập webhook trong repo GitHub trỏ tới `http://<jenkins>/github-webhook/`.
5. **Kiểm thử trigger**: Đẩy một commit thử, xác nhận Jenkins nhận trigger và chạy pipeline.
6. **Tài liệu**: Viết hướng dẫn `docs/jenkins-setup.md` mô tả cách cài, cấu hình, và khởi động.

### Thành viên E (Jenkins – Pipeline)
1. **Viết Jenkinsfile**: Định nghĩa stages `Checkout`, `Build`, `Test`, `Deploy`.
2. **Kết nối artifacts**: Sử dụng `stash/unstash` hoặc `archiveArtifacts` để nhận artefacts từ GitHub Actions.
3. **Thêm báo cáo**: Cấu hình `junit` và `publishHTML` để tạo test report, lưu vào `docs/ai-audit-logs/`.
4. **Kiểm thử pipeline**: Chạy pipeline với artefacts mẫu, kiểm tra log, sửa lỗi nếu có.
5. **Tối ưu thời gian**: Áp dụng parallel stages cho `Build` và `Test` nếu có thể.
6. **Cập nhật tài liệu**: Bổ sung phần `Jenkinsfile` vào `docs/jenkins-pipeline.md` và ghi chú audit.

> **Ghi chú:** Mọi thay đổi cấu hình CI/CD, script, hoặc prompt AI phải được commit và push vào `docs/ai-audit-logs/week-4/` để đáp ứng quy định AI audit.

## Thành viên & Vai trò
- **Thành viên A (Leader)** – Quản lý dự án, giám sát CI/CD, điều phối các nhóm.
- **Thành viên B** – Phát triển và tối ưu GitHub Actions workflow.
- **Thành viên C** – Hỗ trợ GitHub Actions, viết script build, cấu hình môi trường và secrets.
- **Thành viên D** – Cài đặt và cấu hình Jenkins, thiết lập webhook GitHub → Jenkins.
- **Thành viên E** – Quản lý pipeline Jenkins, viết tài liệu hướng dẫn sử dụng Jenkins.

## Nhiệm vụ chi tiết

### Thành viên A
- Giám sát tiến độ, đảm bảo tuân thủ quy trình CI/CD.
- Kiểm duyệt và phê duyệt các thay đổi cấu hình CI/CD.
- Đảm bảo tài liệu audit được cập nhật trong `docs/ai-audit-logs/week-4/`.

### Thành viên B
- Tạo và tối ưu workflow GitHub Actions cho build và test.
- Đảm bảo artefacts được lưu trữ và có thể truyền tới Jenkins.
- Cập nhật tài liệu mô tả workflow GitHub Actions.

### Thành viên C
- Hỗ trợ B trong việc viết script, cấu hình môi trường và secrets cho GitHub Actions.
- Kiểm tra tính ổn định của workflow, ghi log vào `docs/ai-audit-logs/week-4/`.

### Thành viên D
- Cài đặt Jenkins server (Docker/VM) và tạo job mẫu.
- Cấu hình webhook GitHub → Jenkins để tự động trigger pipeline.
- Viết tài liệu hướng dẫn cấu hình Jenkins và tích hợp với GitHub.

### Thành viên E
- Định nghĩa và quản lý các stages của pipeline Jenkins.
- Kiểm thử pipeline Jenkins, ghi log và xử lý lỗi.
- Cập nhật tài liệu hướng dẫn sử dụng Jenkins và CI/CD.

> **Ghi chú:** Mọi thay đổi cấu hình CI/CD, script, hoặc prompt AI phải được commit và push vào `docs/ai-audit-logs/week-4/` để đáp ứng quy định AI audit.
