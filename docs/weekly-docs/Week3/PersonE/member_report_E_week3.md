# 📝 BÁO CÁO CÁ NHÂN - TUẦN 3

**Họ và tên:** Nguyễn Lê Hữu Điền
**MSSV:** 23120233
**Phần việc:** Thành viên E - Case Study & Reporting

---

## 1. Khảo sát Công cụ CI/CD
*   **2 công cụ CI/CD so sánh:** GitHub Actions vs Jenkins
*   **So sánh nhanh (Ưu/Khuyết):**
    *   *GitHub Actions:*
        *   Ưu: Tích hợp sẵn trong GitHub, không cần dựng server; cấu hình bằng file YAML trong `.github/workflows`; có Marketplace nhiều action dựng sẵn; runner do GitHub cung cấp; commit log và kết quả pipeline nằm cùng một chỗ, thuận tiện làm minh chứng.
        *   Khuyết: Gắn chặt với hệ sinh thái GitHub; có giới hạn phút chạy với repo private (repo public thường thoải mái hơn); tùy biến sâu kém linh hoạt hơn Jenkins.
    *   *Jenkins:*
        *   Ưu: Mã nguồn mở, rất linh hoạt nhờ hệ plugin lớn; tự host nên kiểm soát toàn bộ môi trường; hỗ trợ pipeline phức tạp (Jenkinsfile).
        *   Khuyết: Phải tự cài đặt, bảo trì server và plugin; giao diện và cấu hình ban đầu phức tạp; tốn thời gian setup, không phù hợp khung thời gian seminar ngắn.
*   **Vote công cụ cho dự án:** **GitHub Actions**, vì repo nhóm đã đặt trên GitHub, setup nhanh, dễ demo và dễ hướng dẫn cả lớp làm bài tập áp dụng (mỗi bạn chỉ cần fork repo, không phải dựng server).

## 2. Nhận xét Kế hoạch Tổng thể
*   **Đánh giá chung:** Kế hoạch rõ ràng, lộ trình theo tuần hợp lý, phân công theo chuyên môn cân đối (lý thuyết, UI, API, case study) và có yêu cầu minh chứng (commit log, AI audit) nên dễ theo dõi đóng góp. Cấu trúc repo được tổ chức tốt, tách riêng `src/`, `test-harness/`, `docs/`.
*   **Đề xuất chỉnh sửa:**
    *   Chốt sớm Web App (phần của E) trong tuần 3 vì UI test (C) và API test (D) đều phụ thuộc vào app này. Nên chọn app có cả giao diện web lẫn REST API.
    *   Thống nhất quy ước đặt tên file audit log (ví dụ `docs/ai-audit-logs/week-3/<ten>-audit.md`) để tránh conflict khi commit.
    *   Chuẩn bị sớm phương án cho bài tập áp dụng: các bài tập phải chạy được trên máy sinh viên trong thời gian ngắn, nên cần app nhẹ và pipeline chạy nhanh.
    *   Nên quy định một định dạng report chung (ví dụ một tool report dùng cho cả UI và API) để kết quả tổng hợp thống nhất.

## 3. Báo cáo Chuyên môn

### 3.1. Lý thuyết cốt lõi
*   **Case Study (ứng dụng mẫu):** Là ứng dụng được dùng làm đối tượng kiểm thử xuyên suốt seminar. Ứng dụng nên mã nguồn mở, chạy được local hoặc bằng Docker, có cả UI và API để minh họa đủ các loại test trong Test-Harness.
*   **Test Report:** Là báo cáo tổng hợp kết quả chạy test tự động (số test pass/fail/skip, thời gian chạy, lỗi chi tiết, ảnh chụp màn hình, lịch sử các lần chạy). Trong CI/CD, report được sinh ra ở cuối pipeline và đính kèm làm artifact để mọi người xem lại.
*   **Thuật ngữ quan trọng:**
    *   *Test-Harness:* Tập hợp môi trường, script và công cụ dùng để chạy test tự động và thu thập kết quả.
    *   *Pipeline:* Chuỗi các bước tự động (build, test, report, deploy) chạy mỗi khi có thay đổi mã nguồn.
    *   *Artifact:* File sinh ra từ pipeline (report, log, ảnh chụp) được lưu lại để tải về xem.
    *   *Headless:* Chạy trình duyệt không có giao diện đồ họa, phù hợp môi trường CI.
    *   *Flaky test:* Test lúc pass lúc fail dù mã nguồn không đổi, thường do phụ thuộc thời gian hoặc môi trường.
    *   *Test Report / Dashboard:* Giao diện trực quan hóa kết quả test theo thời gian.

### 3.2. Đề xuất Công cụ / Giải pháp

#### a) Web App mã nguồn mở làm môi trường test
*   **Đề xuất:** **RealWorld ("Conduit")**, một ứng dụng blog kiểu Medium có nhiều bản cài đặt (frontend và backend) theo cùng một đặc tả API chung.
*   **Lý do chọn:**
    *   Có cả giao diện web (đăng ký, đăng nhập, viết bài, bình luận, follow) lẫn REST API theo đặc tả rõ ràng, phù hợp cho cả UI test (C) và API test (D).
    *   Chức năng quen thuộc, dễ giải thích trong seminar và dễ thiết kế bài tập áp dụng.
    *   Có nhiều bản cài đặt, có thể chọn bản nhẹ, dễ chạy local hoặc bằng Docker.
    *   Đặc tả API rõ nên dễ áp dụng data-driven (nhiều bộ dữ liệu đăng ký, đăng nhập) và checkpoint (kiểm tra status code, nội dung response).
*   **Phương án dự phòng:** OWASP Juice Shop (nhiều chức năng, chạy bằng Docker, nhưng thiên về bảo mật và khá nặng), hoặc một app quản lý todo/đơn giản tự dựng nếu cần app nhẹ hơn.

#### b) Công cụ sinh Test Report
*   **Đề xuất:** **Allure Report**.
*   **Lý do chọn:** Sinh báo cáo HTML trực quan (biểu đồ, bước chạy, ảnh đính kèm, lịch sử); có adapter cho nhiều framework nên có thể gom kết quả UI và API về một báo cáo chung; dễ chạy trong pipeline và đính kèm làm artifact trên GitHub Actions.
*   **Phương án dự phòng:** Report HTML có sẵn của framework test đang dùng (ví dụ reporter HTML của Newman cho API, reporter của công cụ UI test), đơn giản hơn, không cần cài thêm.

#### c) Hướng dùng AI cho project
*   Nhờ AI gợi ý và rà soát test case (biên, ngoại lệ) cho từng chức năng của app mẫu.
*   Sinh dữ liệu test cho phần data-driven (nhiều bộ input hợp lệ, không hợp lệ).
*   Hỗ trợ viết và debug file cấu hình pipeline (YAML), giải thích lỗi khi pipeline fail.
*   Hỗ trợ soạn đề bài tập áp dụng và gợi ý (hints) cho lớp.
*   Hỗ trợ trau chuốt slide và báo cáo.
*   Lưu ý: mọi kết quả AI đều phải được nhóm kiểm chứng bằng cách chạy thực tế, và mọi prompt/kết quả phải ghi vào audit log.

*   **Lý do chọn & Trả lời yêu cầu của Leader:** Đã đề xuất 1 Web App mã nguồn mở (RealWorld/Conduit), 1 tool sinh Test Report (Allure Report) và các hướng dùng AI như trên, bám theo yêu cầu phần việc của thành viên E.
*   **Điểm yếu / Khó khăn dự kiến:**
    *   Cần thử chạy RealWorld thực tế để chọn bản cài đặt phù hợp, dễ chạy trên nhiều máy; nếu setup phức tạp sẽ ảnh hưởng bài tập áp dụng của lớp.
    *   Allure cần bước cài đặt và cấu hình thêm (adapter, bước sinh report trong pipeline), có thể khó với người mới.
    *   Kết quả từ UI test (C) và API test (D) dùng công cụ khác nhau nên cần thống nhất định dạng kết quả đầu ra để gom vào một report.
    *   Cần theo dõi việc ghi audit log AI đầy đủ, tránh bị trừ điểm contribution.

---
> 🚨 **AI AUDIT:** Prompt và kết quả AI dùng cho báo cáo này được lưu trong file markdown cá nhân và commit lên `docs/ai-audit-logs/Week3/`.
