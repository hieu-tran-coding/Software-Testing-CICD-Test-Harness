# AI AUDIT LOG — TUẦN 6 — PERSON E

**Họ và tên:** Trần Trọng Trí  
**MSSV:** 20120221  
**Phần việc:** Jenkins, Cypress UI tests, JUnit và demo pass/fail.  
**Công cụ AI:** Codex  
**Ngày thực hiện công việc:** 23/10/2026.  
**Ngày lập audit:** 30/10/2026 (UTC+07:00).

## 1. Phạm vi và cách ghi

Các prompt dưới đây **diễn giải nội dung yêu cầu trong hội thoại**, dùng lời
văn đơn giản để trình bày việc tìm hiểu nhiệm vụ và thực hiện công việc theo
tuần. Đây không phải bản trích nguyên văn.
Phần kết quả là **tóm tắt hỗ trợ của AI**, đối chiếu với mã nguồn, commit và
evidence; không phải transcript nguyên văn câu trả lời của AI. Một số phản hồi
đầu Week6 không còn đầy đủ sau khi hội thoại được rút gọn, nên không dựng lại
thành lời thoại. Các trao đổi Week5 được yêu cầu không đưa vào audit không được
chép vào đây.

## 2. Các lượt hỗ trợ chính

### Lượt 1 — Xác định phạm vi Week6

**Prompt (diễn giải):**

> Đọc báo cáo tuần trước và kiểm tra phần Jenkins đã được nhóm thực hiện. Giải thích những việc Person E cần làm trong tuần 6, lập kế hoạch từng bước rồi thực hiện các phần còn thiếu. Giữ cách làm vừa đủ cho bài seminar sinh viên, tránh làm trùng công việc đã hoàn thành.

Khi AI hỏi có tiếp tục phía Jenkins với vai trò Person E như Week5 hay không,
phần xác nhận được diễn giải:

> Tiếp tục phần Jenkins với vai trò Person E như tuần trước.

**Đối chiếu yêu cầu gốc:** `làm tuần 6 đi`; xác nhận `tiếp tục`.

**AI hỗ trợ:** Đọc lại proposal, báo cáo các tuần và code của nhóm. Xác định
Person D đã cài Cypress, Allure, credentials và viết 2 public UI tests. Phần
Person E tiếp nối bằng test tài khoản, kiểm chứng pipeline và chuẩn bị demo;
không nhận phần cài đặt của Person D là đóng góp của mình.

### Lượt 2 — Bổ sung test, báo cáo và kiểm chứng

**Ý triển khai từ yêu cầu ở lượt 1 (diễn giải):**

> Thực hiện các phần còn thiếu, chạy thử trên Jenkins và giải thích kết quả. Kiểm tra cả trường hợp chạy đúng và trường hợp cố tình nhập sai để xem Jenkins có báo lỗi phù hợp không. Lưu kết quả và viết báo cáo tuần 6 để kiểm tra lại.

Đây là phần làm rõ ý triển khai của yêu cầu chung, không phải một lượt chat
riêng. Không có prompt riêng cho từng file hoặc từng lượt build.

**AI hỗ trợ và thao tác:**

- Viết 3 Cypress tests trong `cypress/e2e/account-validation.spec.js`: đăng nhập
  thiếu mật khẩu, sai thông tin đăng nhập, mở đăng ký và gửi thiếu mật khẩu.
- Theo dõi API thật bằng `cy.intercept`, xác nhận HTTP 422 và lỗi hiển thị trên
  giao diện; không mock response hoặc tạo tài khoản thành công.
- Thêm JUnit reporter cho Cypress, mỗi spec xuất file riêng để tránh ghi đè.
- Bổ sung biến môi trường pull/private image và smoke path/timeout cho API client.
- Viết hướng dẫn mini-demo, kế hoạch, báo cáo và xuất evidence cho Person E.
- Dựng lại Jenkins có Cypress/Allure. Khi tải plugin gặp lỗi SSL, chuyển sang
  endpoint Jenkins chính thức `https://updates.jenkins.io/download/plugins`,
  vẫn kiểm tra SHA-256.

**Kết quả thực tế trên job `ci-cd-demo-week6`:**

| Build | Kịch bản                             | Kết quả                                                 |
| ----- | ------------------------------------ | ------------------------------------------------------- |
| #1    | `IMAGE_TAG=latest`                   | FAILURE đúng kỳ vọng tại validation; client exit code 1 |
| #2    | Endpoint cố ý sai                    | FAILURE đúng kỳ vọng, HTTP 404; client exit code 1      |
| #3    | Image SHA đúng, `/api/tags`, Cypress | SUCCESS; client exit code 0                             |

Build #3 có **5 UI tests pass** trên Allure và **11 JUnit checks pass**, gồm 5 UI
và 6 bước lifecycle. Cả 3 lượt ghi nhận cleanup hoàn tất. ESLint cho spec mới,
Python compile và Jenkinsfile validation đều pass.

Giới hạn kiểm chứng Week6: job nạp các file working tree bằng `writeFile` thay
riêng bước lấy source từ SCM; chưa phải kiểm chứng checkout SCM thực tế. Image
ở build #2–3 lấy từ GHCR, tag `4f9a9405b2baebc42969d40f638501e8debfd20e`.

### Lượt 3 — Commit, push và merge code

**Các prompt (diễn giải):**

> Lưu các thay đổi tuần 6 đã chạy thử thành một commit trong repo realworld.

> Đẩy nhánh vừa thực hiện lên GitHub để nhóm xem và kiểm tra.

> Kiểm tra và gộp phần đã thực hiện vào nhánh next của nhóm, sau đó báo lại kết quả.

**Đối chiếu yêu cầu gốc:** `hãy commit lên realworld`, `push đi`, `merge vào next đi`.

**AI hỗ trợ và thao tác:**

- Commit thay đổi Week6 thành `e502c6d`, push nhánh `feature/week6-jenkins-demo`.
- Tạo PR #6 vào `next`; khi kiểm tra ngày 23/10, API GitHub báo Actions đang
  bị tắt ở cấp repository nên không khởi chạy được CI mới.
- Theo yêu cầu merge, merge PR #6 thành `42e263e` và xác nhận `origin/next`
  chứa commit Week6. Không khai báo CI GitHub của commit này đã pass.

## 3. Sản phẩm và nguồn đối chiếu

- [Báo cáo Week6 Person E](../../../weekly-docs/Week6/PersonE/week6_report.md).
- [Evidence 3 build](../../../weekly-docs/Week6/PersonE/evidence/verification_results.json).
- [Commit e502c6d](https://github.com/thu2005/realworld/commit/e502c6d3629cbadb6fb472d4bf1d7fea7c6d196b).
- [PR #6](https://github.com/thu2005/realworld/pull/6).

Báo cáo/evidence Week6 được push vào repo tài liệu ở commit `1f749e0` ngày
30/10. Hai ảnh bổ sung ngày đó chụp từ build lịch sử Week6 #3, không dùng ảnh
Week7 thay cho kết quả Week6.

## 4. Kiểm duyệt và giới hạn

- Người dùng xác nhận phạm vi Jenkins/Person E và yêu cầu commit, push, merge.
- Kết quả test nêu trên do AI chạy và đối chiếu với Jenkins/evidence; không có
  cơ sở ghi người dùng đã tự chạy lại toàn bộ test hoặc tự review toàn bộ code.
- Chưa chứng minh kết nối tự động từ GitHub-hosted runner đến Jenkins localhost.
- Ngày 30/10/2026, người dùng xác nhận nội dung audit đã ổn và yêu cầu commit.
  Xác nhận này áp dụng cho nội dung audit, không thay cho việc review toàn bộ code.
