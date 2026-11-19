# AI AUDIT LOG - TUẦN 5

**Họ và tên:** Trần Trọng Trí  
**MSSV:** 20120221  
**Phần việc:** Person E - Hoàn thiện pipeline Jenkins, nhận image từ GHCR, smoke test và xuất báo cáo.  
**Công cụ AI sử dụng:** Codex  
**Ngày lập log:** 18/10/2026 (UTC+07:00)  
**Vị trí file:** `docs/ai-audit-logs/Week5/PersonE/ai_audit_log_E_Week5.md`

Log được lập khi người dùng yêu cầu tạo audit ở cuối phiên. Các prompt dưới đây được trích từ yêu cầu thực tế; phần kết quả là tóm tắt hỗ trợ và công việc đã thực hiện, không phải transcript nguyên văn toàn bộ hội thoại. Các trao đổi giải thích được người dùng yêu cầu không đưa vào audit không được chép lại.

---

## Lần 1: Lập kế hoạch triển khai phần Jenkins

**Prompt gốc:**

> hãy lập plan để có thể triển khai Jenkins theo phần việc của person E theo tài liệu đã đề ra cho tuần 5

**Diễn giải chi tiết yêu cầu (bổ sung khi chỉnh audit, không phải prompt nguyên văn):**

Lập kế hoạch để Codex có thể trực tiếp triển khai và chạy kiểm chứng phần việc Person E trong Week5. Dựa trên tài liệu seminar và hiện trạng repo RealWorld, tiếp tục phần Jenkins đã có để nhận image từ GHCR, chạy ứng dụng, smoke test, lưu kết quả và cleanup. Kế hoạch cần nêu rõ:

1. Cách kiểm tra Docker, Jenkins, job, volume và image đầu vào; thông tin hoặc quyền còn thiếu để thực hiện.
2. Các file cần sửa và thứ tự triển khai: chuẩn bị Docker access, thêm chế độ nhận image theo full commit SHA, chạy container, kiểm tra `/api/tags`, xuất JUnit/log và dọn tài nguyên.
3. Cách giữ chế độ chạy source cũ và phân chia phần Jenkins với thành viên phụ trách GitHub Actions.
4. Các tình huống cần chạy thử: image hợp lệ, tag không tồn tại, tham số sai, smoke test thất bại và kiểm tra lại pipeline source; tiêu chí pass/fail và minh chứng cần thu.
5. Các bước bàn giao, cập nhật hướng dẫn và viết báo cáo Week5 Person E sau khi có kết quả thật.

Phạm vi vừa đủ cho seminar sinh viên, kế thừa cấu hình và bộ test hiện có. Phân biệt kiểm chứng Jenkins local với việc Actions tự động kích hoạt Jenkins; chưa ghi audit trong giai đoạn triển khai khi người dùng chưa yêu cầu.

**Kết quả AI hỗ trợ:**

- Đọc phân công, báo cáo Week5 và cấu hình RealWorld để xác định phần tiếp nối: Jenkins nhận image, chạy ứng dụng, smoke test, lưu report và cleanup.
- Lập các bước triển khai và tiêu chí kiểm chứng, tách phần Jenkins khỏi công việc trigger/nhận kết quả của người phụ trách GitHub Actions.
- Giữ chế độ chạy source cũ; đề xuất thêm chế độ image và kiểm chứng từng phía trước khi nối tự động.

**Cách sử dụng:** Làm theo [kế hoạch Person E](../../../weekly-docs/Week5/PersonE/week5_integration_plan.md). Vai trò và thư mục báo cáo được chỉnh theo phân công Week5 do người dùng làm rõ, không gắn cố định với vai trò Week3.

## Lần 2: Triển khai pipeline và chạy kiểm chứng

**Prompt:**

> bạn hãy tiến hành thực thi đi theo plan đã đề ra

**Kết quả AI hỗ trợ và thao tác thực tế:**

- Tạo nhánh `feature/jenkins-image-integration` trong repo RealWorld.
- Mở rộng `Jenkinsfile` với hai chế độ source/image; nhận image repo, full commit SHA và cấu hình smoke test. Giữ các stage lint/test/build của chế độ source.
- Viết `jenkins/image_smoke.py` để validate input, pull image, chạy container, kiểm tra `GET /api/tags`, tạo JUnit/summary, thu log và dọn tài nguyên theo từng build.
- Bổ sung Docker CLI và kết nối Docker daemon cho Jenkins; xác nhận user Jenkins sử dụng được Docker mà không chuyển service sang root.
- Xử lý lỗi tải plugin bằng phương án curl, vẫn đối chiếu SHA-256 với metadata chính thức; xác minh đủ 75 plugin.
- Phát hiện lỗi xuống dòng CRLF và file còn thiếu khi build image local. Sau đó đồng bộ nhánh với `origin/next` tại `3b85475...`, tiếp nhận bản sửa Dockerfile của đồng đội thay vì giữ phần sửa trùng làm đóng góp riêng.
- Dựng instance Jenkins local và job kiểm chứng riêng `ci-cd-demo-integration`; nạp pipeline từ file local vì nhánh mới chưa push lúc chạy thử.

**Cách sử dụng:** Hoàn thiện phần thực thi Jenkins và tài liệu setup/contract. Không viết lại ứng dụng, bộ test hay toàn bộ workflow Actions của thành viên khác.

## Lần 3: Kiểm tra image GHCR và xác nhận kết quả pipeline

**Prompt bổ sung:**

> hãy thử pull latest để kiểm tra image GHCR

**Kết quả AI hỗ trợ:**

- Thử pull `latest` và các SHA được kiểm tra ban đầu; registry trả về not found cho các tag đó tại thời điểm thực hiện.
- Đọc kết quả Actions qua GitHub API: run của SHA `dbca821...` là pull request, job push image bị skipped dù run có trạng thái success.
- Tìm được [run push trên next](https://github.com/thu2005/realworld/actions/runs/39130754483) đã publish image với SHA `3b85475aac4dd99c3c5b1d95edc1734c7afc21d3`; pull và dùng image này cho Jenkins build #7.

**Kết quả thực thi Jenkins:**

| Build | Tình huống                          | Kết quả thực tế                                                            |
| ----- | ----------------------------------- | -------------------------------------------------------------------------- |
| #1    | Image local hợp lệ                  | SUCCESS                                                                    |
| #2    | Tag không tồn tại                   | FAILURE tại Pull, đúng kỳ vọng                                             |
| #3    | Tag `latest` không đúng full SHA    | FAILURE tại Validate, đúng kỳ vọng                                         |
| #4    | Smoke test với thời hạn 5 giây      | FAILURE do chưa kết nối được ứng dụng (`ECONNREFUSED`), cleanup thành công |
| #5    | Regression chế độ source            | SUCCESS: lint, 4 Mocha tests và build Next.js                              |
| #6    | Chạy lại image local sau các ca lỗi | SUCCESS                                                                    |
| #7    | Pull và chạy image GHCR thật        | SUCCESS: pull, run, smoke, report và cleanup                               |

Jenkinsfile qua kiểm tra cú pháp của Jenkins; Python, Compose và Dockerfile được kiểm tra phù hợp. Các build image có summary/JUnit, các tài nguyên container/network tạm được dọn sau kiểm chứng.

**Cách sử dụng:** Đưa số liệu thực tế vào báo cáo và [minh chứng 7 build](../../../weekly-docs/Week5/PersonE/evidence/verification_results.json). Build #7 chứng minh Jenkins nhận được image do Actions publish; chưa phải bằng chứng Actions tự trigger Jenkins và theo dõi downstream.

## Lần 4: Hướng dẫn chụp ảnh và hoàn thiện báo cáo

**Các prompt:**

> giờ hướng dẫn chi tiết cách chụp hình để báo cáo

> tôi đã chuẩn bị các ảnh, bạn hãy xem qua thử rồi thêm vào report

**Kết quả AI hỗ trợ:**

- Hướng dẫn chụp tổng quan job, build thành công, image SHA/cleanup, JUnit và trường hợp smoke fail.
- Đọc đủ 8 ảnh do người dùng chuẩn bị, chọn 6 ảnh chính để chèn và liên kết 2 ảnh chi tiết bổ sung.
- Chú thích đúng ảnh build #4 là lỗi kết nối trong thời hạn chờ, không diễn giải thành HTTP 404.

**Cách sử dụng:** Hoàn thiện [báo cáo Week5 Person E](../../../weekly-docs/Week5/PersonE/week5_integration_report.md) và kiểm tra các liên kết ảnh.

## Lần 5: Commit, push và tạo pull request

**Các prompt:**

> hãy commit và push lên realworld đi

> tạo mr vào branch next

**Kết quả AI hỗ trợ và thao tác thực tế:**

- Kiểm tra diff, stage đúng các file triển khai/tài liệu RealWorld; không đưa `.local/`, credential hoặc report sinh tự động vào Git.
- Commit 11 file với nội dung `feat(jenkins): run GHCR image smoke tests with reports and cleanup`.
- Push nhánh `feature/jenkins-image-integration` lên origin.
- Tạo PR vào `next`, kèm mô tả và kết quả kiểm chứng; không tự merge.

**Sản phẩm:** [Commit b4260ec](https://github.com/thu2005/realworld/commit/b4260ec1f5f27863e34e3e9d0db32b8ba73df68e) và [PR #4](https://github.com/thu2005/realworld/pull/4). Repo báo cáo seminar không nằm trong commit này.

## Lần 6: Lập audit log Week5 Person E

**Prompt:**

> hãy tạo file audit cho person E week 5

**Kết quả AI hỗ trợ:** Tổng hợp các yêu cầu và hoạt động thực tế thành file này, dùng đúng thông tin cá nhân, vai trò Person E trong Week5 và cấu trúc mẫu audit Week3. Không tạo lại audit Person B đã bị hủy hoặc tự nhận đây là transcript đầy đủ.

## Nội dung người dùng đã kiểm tra và định hướng

- Làm rõ vai trò theo tuần và yêu cầu chuyển phần việc/tài liệu sang Person E.
- Cung cấp SHA để kiểm tra image, yêu cầu thử pull latest và chuẩn bị ảnh minh chứng từ Jenkins.
- Yêu cầu lấy đúng tên/MSSV từ Week3 Person D và viết báo cáo vừa đủ cho seminar.
- Cho phép commit/push, sau đó yêu cầu tạo PR vào `next`.

Chưa có cơ sở để khai báo người dùng đã tự review toàn bộ mã hoặc tự chạy lại mọi test. Phần tự động Actions → Jenkins và phản ánh kết quả downstream vẫn cần phối hợp kiểm chứng; không khai báo đã hoàn thành thay phần đó.
