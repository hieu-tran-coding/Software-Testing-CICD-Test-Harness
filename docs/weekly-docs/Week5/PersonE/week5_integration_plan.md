# Kế hoạch Week5 - Person E: hoàn thiện Jenkins trong luồng GitHub Actions → GHCR → Jenkins

**Ngày cập nhật:** 18/10/2026 (UTC+07:00).  
**Trạng thái:** Đã triển khai phía Jenkins và chạy kiểm chứng local/source. Xem [báo cáo kết quả thực tế](./week5_integration_report.md); các checklist bên dưới là khung công việc, không thay thế bảng kết quả trong báo cáo.  
**Vai trò Week5:** Person E - hoàn thiện pipeline Jenkins và tích hợp với GitHub Actions.  
**Vị trí tài liệu và báo cáo:** `docs/weekly-docs/Week5/PersonE/`. Vai trò xét theo phân công tuần này; không suy ra từ nhãn Person của Week3. Tên/MSSV trong báo cáo phải dùng thông tin người thực hiện thực tế.  
**Audit:** Không ghi hoặc cập nhật cho đến khi người dùng yêu cầu.

## 1. Mục tiêu và phân công thực tế

Phần Jenkins chạy độc lập từ source đã được báo cáo dưới Person D của Week5. Một thành viên khác đã triển khai GitHub Actions. Người dùng nhận vai trò Person E trong tuần này để hoàn thiện phía Jenkins; thành viên phối hợp phụ trách tích hợp phía Actions. Nhãn vai trò trong kế hoạch này theo công việc của tuần, không gắn cố định với một người qua mọi tuần.

Đích Week5 là nhận một image từ GHCR theo đúng commit SHA, Jenkins chạy image đó, kiểm tra `/api/tags`, lưu kết quả và dọn container. Cả chuỗi có URL và bằng chứng để trình bày seminar.

| Phần | Người chịu trách nhiệm | Ranh giới |
|---|---|---|
| Jenkins source baseline đã có | Người đã nộp báo cáo Person D Week5 | Giữ ghi nhận đóng góp trong báo cáo; phối hợp review thay đổi Jenkins |
| CI/build/push image đã có | Thành viên xây dựng Actions | Giữ ghi nhận đóng góp; sửa lỗi nền tảng ở phía đó khi được phân công |
| Jenkins nhận image, chạy, smoke test, report, cleanup | Người dùng - Person E Week5 | Phần triển khai chính trong kế hoạch này |
| Trigger, truyền tham số, theo dõi Jenkins trong Actions | Thành viên tích hợp phía Actions | Người dùng bàn giao contract/job và phối hợp kiểm chứng |
| Demo đầu-cuối | Hai người tích hợp | Mỗi phía cung cấp log và URL của mình |

RealWorld là SUT lấy từ mã nguồn có sẵn để minh họa pipeline; không phải sản phẩm ứng dụng do nhóm tự xây. Repo `realworld` chứa triển khai, repo `Software-Testing-CICD-Test-Harness` chứa tài liệu seminar và báo cáo. Bản Express/Jest trong repo tài liệu không được dùng lẫn với SUT RealWorld của luồng này.

## 2. Baseline đã kiểm tra

- Working tree repo `realworld` sạch khi khảo sát. HEAD local là `0a3ab4d`, merge PR #2 từ `ci-github-actions`; cả Actions và Jenkins đã có trên checkout hiện tại. Chưa fetch, chưa xác nhận trạng thái remote mới hơn.
- `Jenkinsfile` chỉ nhận `SUT_REPO_URL`, `SUT_REF`; mặc định ref vẫn là `jenkins`. Các stage hiện chạy source với Node 14.21.3/npm 6.14.18, Mocha và `build-dev`.
- Docker Compose dựng Jenkins ở host port 18080, có named volume. Image Jenkins chưa cài Docker CLI và chưa cấu hình kết nối Docker daemon.
- Workflow Actions đã build/smoke-test image, push GHCR và có khung gọi `buildWithParameters`. Trigger hiện cho phép trạng thái upstream skipped, bỏ qua lỗi curl, chưa tạo thư mục response, chưa theo dõi downstream.
- Dockerfile ứng dụng dùng SQLite ở development, container port 3000; health endpoint theo contract là `/api/tags`. Không tự đổi `NODE_ENV=production` vì có thể chuyển sang PostgreSQL.
- Chưa kiểm tra Docker đang chạy, Jenkins job/credential hiện có, package GHCR, GitHub Secrets hay kết nối từ runner đến Jenkins. Có cấu hình trong source không đồng nghĩa hạ tầng đã hoạt động.

## 3. Phương án triển khai vừa đủ cho seminar

Giữ job `ci-cd-demo` và thêm lựa chọn `RUN_MODE=source|image`, mặc định `source` để không phá cách chạy cũ. Các stage source chỉ chạy trong mode source; mode image không cài dependency hoặc build lại ứng dụng.

```text
GitHub Actions: lint/test → build/smoke image → push GHCR:<SHA>
    ↓ gọi có xác thực, gửi RUN_MODE=image + IMAGE_REPO + IMAGE_TAG
Jenkins: validate → verify Docker → pull → run → smoke test
    ↓ luôn thu kết quả và cleanup
JUnit / runtime logs / image digest / Jenkins build URL
```

Ứng dụng chạy trong container tạm để kiểm chứng tích hợp; không gọi đây là deployment production.

### Kết nối Docker và mạng

Phương án mặc định cho máy demo Docker Desktop Linux containers: cài Docker CLI vào image Jenkins, mount Unix socket của Docker daemon vào Jenkins và cấp đúng quyền socket cho user chạy job. Docker CLI trong Jenkins điều khiển daemon host; không dựng Docker-in-Docker trong phạm vi này. Socket cấp quyền quản lý Docker host nên chỉ sử dụng cho job/source tin cậy của demo, không mở daemon TCP không xác thực.

Tạo Docker network riêng cho từng build rồi gắn container ứng dụng vào đó. Probe bằng một container curl tạm trên cùng network để truy cập `http://<tên-container>:3000/api/tags`. Cách này không cần publish host port. `localhost` trong Jenkins không trỏ sang container ứng dụng; không dùng nó cho smoke test này. Image probe cần chọn và ghi phiên bản cố định khi triển khai. Nếu cần mở UI trên host để quay video, bổ sung host port cấu hình riêng và dọn mapping sau lượt chạy.

### Contract đề xuất cần thống nhất với phía Actions

| Tên | Ý nghĩa và quy tắc |
|---|---|
| `RUN_MODE` | `source` hoặc `image`; Actions tích hợp gửi `image` |
| `IMAGE_REPO` | `ghcr.io/<owner>/<image>`; không chứa tag; giới hạn đúng namespace/image của nhóm |
| `IMAGE_TAG` | Full SHA 40 ký tự hex; không dùng `latest` làm đầu vào bàn giao |
| `SUT_REPO_URL` | Repo nguồn, giữ cho mode source và thông tin truy vết |
| `SUT_REF` | Source SHA tương ứng image khi Actions gửi; mode source thủ công mặc định `next` sau khi kiểm tra job |
| `ghcr-credentials` | Jenkins credential cho pull image private; image public không cần login |
| `JENKINS_URL/USER/TOKEN` | GitHub Secrets do phía Actions cấu hình; không đưa giá trị vào tài liệu/log |

Nếu chọn `image` mà thiếu hoặc sai tham số thì fail; không âm thầm fallback source. Đưa tham số vào biến môi trường và quote trong shell, không nội suy đầu vào tùy ý thành mã lệnh. Pin image theo SHA tag và ghi digest thực tế đã pull.

## 4. Các bước thực hiện theo thứ tự

### Bước 1 — Chốt baseline và đầu vào (30–45 phút)

- [ ] Xác nhận với người phụ trách Person D Week5 và người phía Actions phạm vi bảng phân công ở trên; ai sửa file nào.
- [ ] Xác nhận tên job `ci-cd-demo`, branch chứa Jenkinsfile là `next`, image GHCR, package public/private, đầu mối cung cấp quyền truy cập.
- [ ] Lấy một image SHA đã push thành công để dùng cho kiểm chứng Jenkins độc lập.
- [ ] Xác định đường kết nối từ runner đến Jenkins. Có URL public nhưng chưa thử từ runner vẫn chưa đủ bằng chứng.
- [ ] Kiểm tra Git status trước khi sửa; tạo nhánh làm việc mới từ baseline `next` cập nhật, không sửa đè nhánh của người khác. Tên gợi ý: `feature/jenkins-image-integration`.

**Đầu ra:** Contract đã thống nhất, một image thật, danh sách file mỗi người sở hữu. Thiếu URL Jenkins không cản bước 2–5; chỉ chặn demo tự động bước 6.

### Bước 2 — Cho Jenkins sử dụng Docker (45–90 phút)

**File:** `jenkins/Dockerfile`, `docker-compose.jenkins.yml`, `docs/jenkins-setup.md`.

- [ ] Kiểm tra Docker Desktop/daemon và Jenkins hiện có trước khi rebuild.
- [ ] Cài Docker CLI; cấu hình socket và quyền user/group theo môi trường thật, không giả định GID cố định.
- [ ] Rebuild/recreate riêng service Jenkins khi cần; giữ named volume. Không dùng `down --volumes`.
- [ ] Trong môi trường thực thi Jenkins, kiểm tra CLI kết nối được daemon, chạy/xóa được container thử và tạo/xóa được network thử.
- [ ] Ghi rõ cách setup và cách xử lý permission denied/cannot connect to daemon.

**Điều kiện qua bước:** Docker hoạt động bên trong job Jenkins, không chỉ hoạt động ở terminal host. Chưa thay pipeline ứng dụng trước khi điều kiện này đạt.

### Bước 3 — Thêm mode image trong Jenkinsfile (60–90 phút)

- [ ] Thêm `RUN_MODE`, `IMAGE_REPO`, `IMAGE_TAG`; cập nhật default source ref thành `next` sau khi kiểm tra SCM job.
- [ ] Validate input và tạo thư mục report trước các bước có thể fail.
- [ ] Giữ các stage Checkout/Runtime/Install/Lint/Test/Build cũ cho mode source.
- [ ] Mode image dùng các stage Validate → Verify Docker → Pull → Run → Smoke.
- [ ] Đặt tên container/network riêng có tiền tố project và build ID; lưu các tên đó cho cleanup. Không dùng tên container cố định dùng chung.
- [ ] Nếu image private: dùng Credentials Binding và password-stdin; Docker config tạm trong thư mục riêng của build, không archive, xóa khi xong. Không bật shell trace ở phần credential.
- [ ] Pull image chính xác, ghi image reference và digest; không build lại trong Jenkins image mode.
- [ ] Chạy ứng dụng trên network của build với cấu hình SQLite hiện có, không dùng persistent DB volume cho smoke test.

**Điều kiện qua bước:** Hai mode được phân nhánh rõ ràng; image sai/không tồn tại làm build fail, không đổi sang một image khác để tiếp tục.

### Bước 4 — Smoke test, report và cleanup (60–90 phút)

- [ ] Probe `/api/tags` từ container probe cùng network, kiểm tra HTTP 200 và body JSON có trường `tags` dạng mảng.
- [ ] Chờ readiness với tổng timeout cấu hình, gợi ý tối đa 120 giây cho SUT cũ; mỗi request cũng có timeout. Thu log ngay nếu container thoát sớm.
- [ ] Ghi JUnit XML hợp lệ cho smoke pass/fail; lỗi validate/pull có log rõ, không tạo test pass giả.
- [ ] Trong post action, thu container logs/inspect trước khi xóa; publish XML đã có và archive report cả khi thất bại.
- [ ] Dọn container ứng dụng, probe, network và Docker config của đúng build. Không dùng prune hoặc xóa tài nguyên toàn daemon.
- [ ] Lỗi thu report không được ngăn cleanup; lỗi cleanup phải hiện rõ, không đổi kết quả chính từ fail thành success.

**Đường dẫn thống nhất:**

| Output | Path |
|---|---|
| Smoke JUnit | `test-reports/junit/smoke.xml` |
| Container stdout/stderr | `test-reports/logs/container.log` |
| Thông tin image/SHA/digest/build | `test-reports/logs/integration-summary.json` |
| HTTP response phục vụ chẩn đoán | `test-reports/logs/smoke-response.json` khi đã nhận được response |

Tránh phụ thuộc bind-mount workspace Jenkins vào container probe: với host socket, đường dẫn workspace trong Jenkins có thể không tồn tại trên daemon host. Thu stdout bằng Jenkins/shell hoặc copy kết quả về thay vì giả định hai filesystem giống nhau.

### Bước 5 — Kiểm chứng Jenkins độc lập và bàn giao (45–90 phút)

- [ ] Chạy manual mode image với SHA thật, thu URL/build/result/artifacts.
- [ ] Chạy tag SHA hợp lệ về hình thức nhưng không tồn tại; xác nhận fail tại Pull.
- [ ] Gây smoke fail có kiểm soát bằng fixture hoặc cấu hình endpoint/timeout dành cho thử nghiệm; không sửa image dùng chung hoặc làm hỏng baseline.
- [ ] Sau mỗi lượt, kiểm tra không còn container/network/config tạm của build.
- [ ] Chạy regression mode source một lượt trên `next` để kiểm tra nền tảng cũ còn hoạt động.
- [ ] Bàn giao job, contract, ví dụ payload không chứa secret và một image/build đã kiểm chứng cho người phía Actions.

**Điều kiện qua bước:** Có ít nhất một lượt image pass, một lượt pull fail, một lượt smoke fail và source baseline vẫn chạy. Lỗi thực tế còn tồn tại phải được sửa hoặc ghi rõ blocker trước demo.

### Bước 6 — Nối Actions → Jenkins cùng thành viên phối hợp (60–120 phút)

**Phía Actions phụ trách sửa `.github/workflows/ci.yml`:**

- Chỉ trigger image mode khi Docker push thành công trên nhánh/sự kiện tin cậy; không chấp nhận upstream skipped như thành công, không trigger từ PR.
- Tạo thư mục response; gửi contract, dùng source SHA thay cho ref name khi bàn giao phiên bản.
- Fail rõ khi Jenkins không truy cập được, credential sai hoặc HTTP lỗi; không dùng `|| true` che lỗi tích hợp.
- Lấy queue URL từ phản hồi, đợi Jenkins cấp build URL, theo dõi kết quả có timeout. Chỉ request được chấp nhận chưa có nghĩa Jenkins pass.
- Lưu Actions run URL/ID trong thông tin bàn giao nếu cần và xuất Jenkins URL/result vào artifact hoặc job summary. Không in token.

**Phía người dùng/Jenkins:** xác minh parameter được nạp, job pull đúng SHA/digest, endpoint smoke hoạt động và report tải được. Chọn một cơ chế trigger cho job tích hợp: Actions gọi API; rà `githubPush()`/webhook để tránh kích hoạt ngoài ý muốn. Giữ cách chạy manual để chẩn đoán.

**Đường kết nối:** dùng endpoint Jenkins có xác thực mà GitHub runner truy cập được. Nếu hiện chỉ có Jenkins local, nhóm chọn hạ tầng/network được phép sử dụng hoặc runner phù hợp; không tự mở port/router hay phát hành URL công khai khi chưa thống nhất. Chưa có đường kết nối thì chỉ hoàn thành kiểm chứng Jenkins độc lập và ghi rõ phần tự động còn bị chặn.

**Điều kiện hoàn thành:** Có lượt CI pass → push image → Jenkins image pass; lượt upstream bắt buộc fail không gọi Jenkins; lượt downstream fail được Actions thể hiện thất bại. Mỗi lượt có URL, SHA và kết quả kiểm tra cleanup.

### Bước 7 — Hoàn thiện tài liệu và báo cáo (60–90 phút)

**Trong `realworld`:**

- [ ] Cập nhật `CI_INTEGRATION_CONTRACT.md`: mode source/image, tham số, trigger, credential ID, network, report path và ý nghĩa pass/fail.
- [ ] Cập nhật `docs/jenkins-setup.md`: Docker access, cấu hình job SCM `next`, chạy hai mode, xử lý lỗi, cleanup.
- [ ] Cập nhật README trỏ tới hướng dẫn. Review diff cùng người phụ trách Person D Week5 trước bàn giao; commit/PR mô tả rõ phần bổ sung tích hợp.

**Trong repo tài liệu seminar:**

- [ ] Viết `docs/weekly-docs/Week5/PersonE/week5_integration_report.md`; ghi vai trò Person E Week5 và đóng góp thực tế, không tự sao chép danh tính từ báo cáo thành viên khác.
- [ ] Lưu ảnh của phần tích hợp trong `PersonE/screenshots/`, đặt tên mô tả; có ảnh stage image, smoke report, image SHA và liên kết Actions/Jenkins.
- [ ] Có sơ đồ kiến trúc, hướng dẫn chạy demo ngắn và bảng kiểm chứng.
- [ ] Ghi nhận phần tiếp nhận từ người làm Person D Week5/người làm Actions, file/commit do bản thân sửa, phần phối hợp, giới hạn còn lại.
- [ ] Không ghi audit, không thêm mục audit tự phát. Giữ nguyên các audit file đang có cho đến khi người dùng yêu cầu khác.

## 5. Bảng kiểm chứng để điền khi thực hiện

| ID | Tình huống | Kỳ vọng | Bằng chứng thực tế |
|---|---|---|---|
| J-01 | Image SHA thật | Pull/run/smoke pass, có XML/log, cleanup sạch | Chưa chạy |
| J-02 | SHA đúng định dạng nhưng tag không tồn tại | Fail tại Pull, có log, cleanup không làm lỗi dây chuyền | Chưa chạy |
| J-03 | Ứng dụng không đáp ứng endpoint trong hạn | Fail Smoke, có HTTP/container log, cleanup sạch | Chưa chạy |
| J-04 | Thiếu hoặc sai image parameters | Fail Validate, không chạy image khác | Chưa chạy |
| J-05 | Mode source baseline | Pipeline cũ hoạt động trên ref đã chọn | Chưa chạy |
| E-01 | Actions pass và GHCR push thành công | Jenkins chạy đúng SHA, cả chuỗi pass, lưu hai URL | Chưa chạy |
| E-02 | CI bắt buộc fail hoặc PR | Không push/trigger tích hợp Jenkins | Chưa chạy |
| E-03 | Jenkins downstream fail | Actions báo fail và trỏ tới build/log Jenkins | Chưa chạy |

Các tình huống lỗi dùng nhánh/fixture demo có kiểm soát; không làm hỏng shared baseline. Không cam kết số test, thời gian hay tỷ lệ pass trước khi có dữ liệu thật.

## 6. Lịch làm việc đề xuất và điểm dừng

| Buổi | Phạm vi | Sản phẩm cuối buổi |
|---|---|---|
| 1 | Bước 1–2 | Contract và Jenkins dùng được Docker |
| 2 | Bước 3–4 | Image mode, smoke, report, cleanup |
| 3 | Bước 5 | Jenkins độc lập có minh chứng pass/fail; bàn giao phía Actions |
| 4 | Bước 6 | Demo đầu-cuối và xử lý lỗi tích hợp |
| 5 | Bước 7 | Review PR, báo cáo và hướng dẫn demo |

Ước lượng để sắp xếp công việc, không phải thời gian đã thực hiện. Nếu thiếu image thì dùng image local chỉ để kiểm tra cơ chế, chưa tuyên bố GHCR pass. Nếu thiếu kết nối runner–Jenkins thì ghi blocker đó, không thay demo manual thành bằng chứng tự động.

## 7. Definition of Done của phần người dùng

- [ ] Có thay đổi Jenkins được review, giữ ghi nhận baseline của người làm trước.
- [ ] Source mode hoạt động; image mode nhận đúng contract và chạy đúng image.
- [ ] Docker access được setup lặp lại theo tài liệu, không dựa vào thao tác bí mật không được mô tả.
- [ ] Smoke test có timeout và điều kiện pass/fail rõ ràng.
- [ ] Pull/start/smoke fail không bị che lỗi; report/log và cleanup hoạt động.
- [ ] Có minh chứng Jenkins độc lập và ít nhất một luồng Actions → Jenkins hoàn chỉnh.
- [ ] Có regression và tình huống downstream fail được truyền ngược về Actions.
- [ ] Tài liệu RealWorld và báo cáo seminar phản ánh đúng file, lệnh, kết quả và người đóng góp.

**Ngoài phạm vi tuần này:** viết lại CI của người khác, dựng SUT khác, nâng major Node/dependency, thêm Kubernetes, database production, Cypress/k6/Allure hoặc tự động AI. Những lỗi nền tảng ở Actions/Dockerfile ứng dụng ảnh hưởng image được chuyển cho người phụ trách xử lý, chỉ nhận sửa khi đã thống nhất.

## 8. Khung báo cáo cá nhân sau khi thực hiện

1. Thông tin người thực hiện, vai trò Person E và phân công Week5 thực tế.
2. Hiện trạng tiếp nhận và đóng góp đã có của các thành viên khác.
3. Mục tiêu tích hợp và sơ đồ Actions → GHCR → Jenkins.
4. Thay đổi bản thân triển khai: Docker access, parameter, image mode, smoke/report/cleanup; liên kết PR/commit.
5. Cách setup/chạy lại, tên biến và credential ID, không chứa giá trị secret.
6. Bảng kết quả theo J-01 đến E-03 với URL, SHA/digest, ảnh và artifact thật.
7. Giới hạn, phần phối hợp và công việc còn lại. Chỉ đánh dấu hoàn thành những mục có bằng chứng.

## 9. Kế hoạch để Codex trực tiếp triển khai và chạy job

Phần này là quy trình đã dùng sau khi người dùng yêu cầu triển khai. Nhánh tích hợp, Jenkins local và các lượt kiểm chứng đã được tạo; trạng thái cụ thể được ghi trong báo cáo kết quả, không mặc định mọi chặng đầu-cuối đã xong. Không tạo/cập nhật audit cho đến khi người dùng yêu cầu.

### 9.1. Điều kiện thực tế đã kiểm tra

- Repo làm việc: `D:/Projects/Code/school/ktpm/project/realworld`, branch `next`, HEAD `0a3ab4d`, working tree sạch ở lần kiểm tra.
- Docker CLI và server đều báo `29.7.2` khi kiểm tra ngoài sandbox.
- `docker compose -f docker-compose.jenkins.yml ps` không liệt kê service đang chạy. Chưa kiểm tra container đã dừng, instance Jenkins thuộc Compose project khác hay volume cũ; không kết luận Jenkins chưa từng được cài.
- Có Git; không tìm thấy lệnh `gh` trên PATH. Không yêu cầu cài `gh` chỉ để chạy local; PR hoặc Actions có thể thao tác qua công cụ kết nối/browser/API có sẵn khi cần.
- Docker trong sandbox bị từ chối truy cập config và named pipe; những lệnh Docker cần thiết phải dùng cơ chế cấp quyền chạy ngoài sandbox. Không cố vượt qua bằng công cụ khác.
- Chưa xác nhận image GHCR đã publish hoặc credential Jenkins/GHCR có thể sử dụng. Đây là đầu vào cho kiểm chứng registry và tự động đầu-cuối, không cản việc triển khai mã nguồn.

### 9.2. Chuỗi công việc Codex thực hiện

| Chặng | Codex thực hiện | Đầu ra kiểm tra được |
|---|---|---|
| A. Khảo sát môi trường | Kiểm tra lại Git/AGENTS nếu có; xem container Jenkins hiện có, port và volume; đọc lại contract và cấu hình mới nhất | Xác định instance/job cần dùng, dữ liệu cần giữ và baseline thực tế |
| B. Tạo thay đổi có thể review | Tạo nhánh tích hợp riêng từ baseline phù hợp; sửa Docker access, Jenkinsfile và script smoke/report nếu cần | Diff giới hạn phía Jenkins, không ghi đè thay đổi đồng đội |
| C. Kiểm tra cấu hình | Kiểm tra Compose config, cú pháp script, cách quote input, phân nhánh source/image và post cleanup | Sửa các lỗi tĩnh trước khi rebuild; chưa coi static check là pipeline pass |
| D. Chuẩn bị Jenkins local | Build image Jenkins cập nhật, kiểm tra quyền Docker socket; start/recreate service đúng instance và giữ volume | Jenkins truy cập được, job thực thi được Docker |
| E. Kiểm chứng cơ chế local | Nếu chưa có image GHCR, build/tag image local để kiểm tra run/network/smoke/report/cleanup; ghi rõ đây là local test | Có kết quả cơ chế độc lập, chưa tuyên bố registry handoff pass |
| F. Chạy Jenkins thật | Dùng job sẵn có hoặc cấu hình job từ SCM; nạp parameters rồi chạy image SHA thật, kiểm tra kết quả qua Jenkins API/UI | Build URL, stage log, XML và digest thật |
| G. Chạy các trường hợp lỗi | Pull sai tag, input không hợp lệ, smoke timeout và source regression theo bảng mục 5 | Lỗi phản ánh đúng trạng thái, report/cleanup không làm mất nguyên nhân |
| H. Tích hợp phía Actions | Bàn giao payload/job cho thành viên phía Actions; review phần nối, chạy khi có quyền/đường mạng phù hợp | Run URL Actions + Jenkins, cùng SHA/image, trạng thái downstream |
| I. Hoàn thiện bàn giao | Cập nhật hướng dẫn, tạo báo cáo Person E bằng bằng chứng vừa thu, tổng hợp diff và công việc còn lại | Code và báo cáo có thể review; không tự đánh dấu các bước chưa chạy |

Các chặng thực hiện tuần tự. Codex tiếp tục các việc độc lập khi thiếu một đầu vào, nhưng không thay thế bằng kết quả giả. Sau khi có lệnh bắt đầu, ưu tiên hoàn thành D–G local trước khi mở rộng phần kết nối remote.

### 9.3. Cách khởi động Jenkins và nạp bản Jenkinsfile đang phát triển

1. Liệt kê instance/container cũ, kiểm tra volume và port; chọn tái sử dụng dữ liệu hiện có trước khi tạo instance mới.
2. Chạy `docker compose -f docker-compose.jenkins.yml config` trước khi build. Kiểm tra Docker access, cấu hình group/socket và health check.
3. Build/start service Jenkins với volume hiện có. Chỉ tạo lại service cần cập nhật, không xóa volume hoặc lịch sử build.
4. Kiểm tra HTTP `/login`, trạng thái khởi tạo và quyền đăng nhập. Nếu Jenkins còn bước setup tài khoản, người dùng hoàn tất bước tương tác hoặc cung cấp kết nối có quyền phù hợp; không in mật khẩu khởi tạo/token vào hội thoại.
5. Kiểm tra job `ci-cd-demo` hiện có. Nếu job cần SCM branch để đọc Jenkinsfile mới thì branch phải được push bằng phương thức đã được cho phép. Khi bản sửa chỉ ở local, có thể dùng job kiểm chứng riêng `ci-cd-demo-integration` với cùng nội dung Jenkinsfile qua API/UI đã xác thực, giữ job cũ nguyên vẹn. Kết quả phải ghi rõ cách nạp pipeline; sau khi hợp nhất, job chính quay về Pipeline from SCM.
6. Nạp parameter definitions trước lượt image run; xử lý đặc điểm lần đầu job chưa có parameter. Không đếm lần seed cấu hình là image test pass.
7. Gọi build với `RUN_MODE=image`, image repo và SHA; đọc queue/build đến khi kết thúc có timeout. Thu log/artifacts và kiểm tra Docker cleanup.

Không mount workspace từ Jenkins sang container trên daemon host mà chưa đối chiếu đường dẫn. Không truyền token trực tiếp trên command line/log; dùng kết nối đã xác thực hoặc secret có sẵn trong môi trường được phép, chỉ hiển thị tên credential.

### 9.4. Thông tin cần khi chạy đến từng chặng

| Thời điểm | Đầu vào cần có | Nếu chưa có |
|---|---|---|
| Bắt đầu | Repo và Docker đang có trên máy | Đã kiểm tra; kiểm tra lại trạng thái trước thay đổi |
| Cấu hình job Jenkins | Kết nối Jenkins có quyền cấu hình/chạy job | Tiếp tục sửa code và kiểm chứng local; yêu cầu đăng nhập hoặc kết nối khi thực sự cần |
| Kiểm chứng GHCR | Image repo + full SHA đã publish; quyền pull nếu private | Dùng image local cho cơ chế, chưa đánh dấu J-01 GHCR hoàn thành |
| Chạy source baseline | Source/ref truy cập được và môi trường install/build | Ghi nguyên nhân thực tế nếu dependency/network cản kiểm chứng |
| Trigger từ GitHub runner | URL Jenkins truy cập được, quyền cấu hình Secrets/Actions và người phía Actions phối hợp | Hoàn thành Jenkins độc lập; ghi phần tự động chưa kiểm chứng |
| Push/PR và job SCM branch mới | Remote access và quyền cần thiết | Để diff local review được; không tự merge hoặc sửa phân quyền repo |

Không yêu cầu gửi password/token vào chat. Codex chỉ hỏi đúng đầu vào còn thiếu ở thời điểm cần, không bắt người dùng tự chạy các thao tác mà Codex đã có quyền làm. Mở port Internet, thay đổi router/network hoặc công khai dịch vụ cần được thống nhất riêng; không mặc định thuộc yêu cầu chạy job local.

### 9.5. File dự kiến bàn giao

**Repo ứng dụng:** `Jenkinsfile`, `jenkins/Dockerfile`, `docker-compose.jenkins.yml`, `CI_INTEGRATION_CONTRACT.md`, `docs/jenkins-setup.md`; thêm script nhỏ trong `jenkins/` nếu giúp tách smoke/report/cleanup khỏi Jenkinsfile. Không tạo framework mới.

**Repo seminar:** `docs/weekly-docs/Week5/PersonE/week5_integration_report.md`, ảnh minh chứng trong `PersonE/screenshots/` nếu thu được; báo cáo dẫn URL job/run và PR/commit thực tế. Generated test reports giữ tại artifact, không commit tràn vào source.

**Kết quả cuối lượt triển khai:** nêu rõ file thay đổi, job/build đã chạy, pass/fail, minh chứng, việc còn bị chặn và nguyên nhân. Không khẳng định hoàn thiện toàn chuỗi nếu chỉ kiểm chứng được local. Không tạo audit, tự merge hay công khai Jenkins.
