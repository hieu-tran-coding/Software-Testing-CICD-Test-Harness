# AI AUDIT LOG — TUẦN 7 — PERSON E

**Họ và tên:** Trần Trọng Trí  
**MSSV:** 20120221  
**Phần việc:** Kiểm chứng và bàn giao Jenkins, mini-demo và báo cáo cá nhân.  
**Công cụ AI:** Codex

## 1. Phạm vi và cách ghi

Audit này tổng hợp nội dung yêu cầu công việc và kết quả hỗ trợ AI trong Week7.
Phần kết quả là **tóm tắt công việc của AI**, không phải transcript
nguyên văn toàn bộ hội thoại. Không ghi
token, mật khẩu hoặc nội dung các file credential local.

Việc tạo audit được người dùng yêu cầu sau khi triển khai và bàn giao; trước
thời điểm đó AI giữ yêu cầu không ghi audit mới. Không nhận công việc của các
thành viên khác hoặc kết quả chưa kiểm chứng là kết quả của Person E.

## 2. Các lượt hỗ trợ chính

### Lượt 1 — Rà soát phần còn thiếu và xác định phạm vi

**Nội dung yêu cầu:**

> Kiểm tra code và báo cáo của nhóm, giải thích phần Jenkins/Person E đã hoàn thành đến đâu và tuần này còn thiếu những gì. Hoàn thiện các việc cần thiết, chạy thử và bổ sung báo cáo để kiểm tra. Giữ cách làm đơn giản, dễ hiểu và có kết quả chạy thực tế.

AI hỏi cần hoàn thiện toàn bộ sản phẩm nhóm hay chỉ phần Jenkins/Person E.
Nội dung xác nhận phạm vi:

> Chỉ thực hiện phần Jenkins/Person E. Đọc phần của các thành viên khác để hiểu tiến độ và tránh làm trùng.

**AI hỗ trợ:** Fetch và rà hai repository, đọc yêu cầu seminar, báo cáo thành
viên và thay đổi mới trên `next`. Nhận thấy nhóm đã có báo cáo tổng, slide nháp
và bài tập thực hành; phần Person E cần chốt báo cáo Week6, kiểm chứng SCM thật
và tài liệu bàn giao. Không sửa phần Actions, báo cáo tổng hoặc slide của thành
viên khác sau khi phạm vi được xác nhận.

### Lượt 2 — Hoàn thiện mini-demo và kiểm chứng Pipeline from SCM

**Phạm vi triển khai từ yêu cầu ở lượt 1:**

> Kiểm tra lại Jenkins bằng code của nhóm trên GitHub thay vì chỉ dùng các file local. Chạy thử cả trường hợp thành công và trường hợp cố tình làm sai, sau đó hướng dẫn cách trình bày kết quả. Viết hướng dẫn ngắn cho những bước cần thực hiện lại khi demo.

Đây là phần làm rõ ý triển khai của yêu cầu chung, không phải một lượt chat
riêng. Các thao tác dưới đây được AI thực hiện trong cùng yêu cầu, không phải
mỗi thao tác đều có một prompt riêng.

**AI hỗ trợ và thao tác:**

- Khởi động Docker/Jenkins, giữ volume và lịch sử build cũ.
- Tạo job kiểm chứng riêng `ci-cd-demo-person-e`, cấu hình **Pipeline script from
  SCM** lấy Jenkinsfile, runner và Cypress tests trực tiếp từ `next` trên GitHub.
- Xác nhận image GHCR mới của nhóm tồn tại và dùng đúng full commit SHA.
- Viết `jenkins/demo.py` với các ca `pass`, `invalid-tag`, `bad-smoke`; ca lỗi
  chỉ được chấp nhận khi đúng stage/nguyên nhân dự kiến và cleanup hoàn tất.
- Sửa `jenkins/trigger_jenkins.py` xóa report cũ trước lượt gọi mới, tránh dùng
  nhầm kết quả SUCCESS cũ khi không kết nối được Jenkins.
- Thêm 6 unit tests cho quy tắc nhận kết quả demo và trường hợp lỗi kết nối;
  các tests đều pass, Python compile cũng pass.
- Cập nhật hướng dẫn SCM sang `next`, tham số image, JUnit/Allure, artifacts,
  API trigger; tránh cấu hình thêm push webhook cho cùng job tích hợp.

**Kết quả thực tế trên job SCM:**

| Build | Kịch bản                     | Kết quả                                                        |
| ----- | ---------------------------- | -------------------------------------------------------------- |
| #1    | Image thật, smoke và Cypress | SUCCESS; 5/5 UI, 11/11 JUnit; 265,6 giây gồm tải image lần đầu |
| #2    | Tag `latest`                 | FAILURE đúng kỳ vọng tại validation; 6,3 giây                  |
| #3    | Endpoint cố ý sai            | FAILURE đúng kỳ vọng với HTTP 404; 45,8 giây                   |
| #4    | Chạy lại sau hai ca lỗi      | SUCCESS; 5/5 UI, 11/11 JUnit; 83,3 giây                        |

Cả 4 build đều cleanup hoàn tất; sau lượt cuối không còn container/network tạm
mang nhãn của runner. SCM và image dùng SHA
`ef0684e72c2c2f4c35a42b468ce03a35e0ad48f3`, digest image
`sha256:b1afd0dddf5a722f668b851da686ed28ba5e0c942c00476fcfbdb9b45d67f0d2`.

Phân biệt: client production vẫn báo lỗi khi Jenkins FAILURE; script trình diễn
trả 0 khi đã xác minh ca lỗi có chủ đích. Không dùng wrapper demo thay client
production trong workflow CI.

### Lượt 3 — Báo cáo, ảnh và bàn giao code

**AI hỗ trợ trong yêu cầu hoàn thiện Person E:**

- Bổ sung ảnh từ build lịch sử Week6 #3, giữ nguyên ngày/kết quả Week6.
- Viết báo cáo Week7 đúng tên/MSSV, lưu ảnh thật của job SCM, JSON/XML và trích
  đoạn console; cập nhật README để truy cập được báo cáo cá nhân.
- Commit code `ddb3ecd`, push nhánh `feature/person-e-handoff`, tạo **draft PR #8**
  vào `next` để nhóm review; chưa merge thay đổi mới.
- Commit tài liệu `1f749e0` và push nhánh `docs-and-reports`.

Jenkinsfile/runner/Cypress trong các build lấy từ `next` ở SHA đã ghi trên.
Mini-demo và bản sửa client được chạy từ working tree rồi commit thành
`ddb3ecd`; không khai báo Jenkins đã checkout chính commit mới này.

### Lượt 4 — Đối chiếu audit còn thiếu và soạn bản nháp

**Nội dung yêu cầu:**

> Kiểm tra repo báo cáo và liệt kê phần Person E còn thiếu ở tuần 6–7, nhất là audit log.

**AI hỗ trợ:** Xác nhận báo cáo và evidence đã có, còn thiếu audit Week6 và Week7.

**Nội dung yêu cầu viết audit:**

> Viết audit tuần 6 và tuần 7 để review trước khi commit.

**AI hỗ trợ:** Soạn hai file audit dựa trên công việc và kết quả đã kiểm chứng.

## 3. Sản phẩm và nguồn đối chiếu

- [Báo cáo Week7 Person E](../../../weekly-docs/Week7/PersonE/20120221_report.md).
- [Evidence 4 build SCM](../../../weekly-docs/Week7/PersonE/evidence/verification_results.json).
- [Code bàn giao](https://github.com/thu2005/realworld/commit/ddb3ecd).
- [Draft PR #8](https://github.com/thu2005/realworld/pull/8).
- [Tài liệu bàn giao Jenkins](https://github.com/thu2005/realworld/blob/feature/person-e-handoff/docs/person-e-handoff.md).
- [Commit báo cáo/evidence](https://github.com/hieu-tran-coding/Software-Testing-CICD-Test-Harness/commit/1f749e0).

## 4. Kiểm duyệt và giới hạn

- Người dùng xác nhận chỉ làm phần Jenkins/Person E và yêu cầu soạn audit để review.
- Chưa có xác nhận người dùng đã review toàn bộ code hoặc tự chạy lại các build.
  Những kết quả trên do AI thực thi và đối chiếu evidence.
- Chưa chứng minh GitHub-hosted Actions gọi được Jenkins localhost. Phần mạng,
  secrets và publish image phía Actions cần thành viên phụ trách xác nhận.
- Không khai báo toàn bộ đồ án đã hoàn thành hoặc đã có video demo xuất bản.
- Ngày 30/10/2026, người dùng xác nhận nội dung audit đã ổn và yêu cầu commit.
  Xác nhận này áp dụng cho nội dung audit, không thay cho việc review toàn bộ code.
