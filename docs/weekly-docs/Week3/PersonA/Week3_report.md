# 📝 FILE 3: MẪU BÁO CÁO CÁ NHÂN - TUẦN 3

**Họ và tên:** Trần Trung Hiếu
**MSSV:** 23120044
**Phần việc:** Leader - Setup & Quản lý  

---

## 1. Khảo sát Công cụ CI/CD
*   **2 công cụ CI/CD so sánh:** GitHub Actions vs GitLab CI
*   **So sánh nhanh (Ưu/Khuyết):** 
    *   **GitHub Actions:**
        - Ưu: Tích hợp sẵn trong GitHub, không cần server riêng, hỗ trợ marketplace actions, miễn phí cho dự án công khai.
        - Khuyết: Giới hạn thời gian chạy (2h cho free tier), khó tùy chỉnh môi trường self‑hosted.
    *   **GitLab CI:**
        - Ưu: Pipeline mạnh, hỗ trợ Docker `shared runners`, dễ cấu hình `.gitlab-ci.yml`.
        - Khuyết: Đòi hỏi máy chủ GitLab riêng cho dự án riêng tư, tài liệu hơi rời rạc.
*   **Vote công cụ cho dự án:** GitHub Actions + GitLab CI

## 2. Nhận xét Kế hoạch Tổng thể
*   **Đánh giá chung:**
    * Đã giao việc cho các thành viên để tìm hiểu về các công cụ CI/CD và đưa ra ý kiến cá nhân.
    * Jira đã được setup (tạm thời).
    * Repo trên github đã được tạo (https://github.com/hieu-tran-coding/Software-Testing-CICD-Test-Harness)

## 3. Báo cáo Chuyên môn
### 3.1. Lý thuyết cốt lõi
*   **CI/CD:** Continuous Integration (tự động build & test mỗi commit) và Continuous Deployment/Delivery (tự động triển khai khi pipeline thành công).
*   **Test‑Harness:** Khung kiểm thử tự động bao gồm các phần Record & Playback, Data‑driven, Checkpoints; giúp tái sử dụng test scripts trong pipeline.
*   **Webhook:** Cơ chế mà GitHub gửi POST request tới server CI khi có sự kiện (push, pull‑request).
*   **Branching strategy:** GitHub Flow – develop → feature branches → pull‑request → main.

*   **Thuật ngữ quan trọng:**
    - **Pipeline:** Dòng công việc tự động (build → test → deploy).
    - **Runner:** Máy thực thi các job của CI/CD.
    - **Artifact:** Tập tin kết quả (log, báo cáo) lưu trữ sau khi job kết thúc.
    - **Trigger:** Sự kiện khởi động pipeline (push, tag, schedule).

### 3.2. Đề xuất Công cụ / Giải pháp (HỖ TRỢ BỞI AI)

* **GitHub**
  - **Công cụ đề xuất:** GitHub Actions + Cypress (UI) + Postman/Newman (API) + Allure (báo cáo).
  - **Lý do chọn:** Tích hợp sẵn với repository, không cần server riêng, marketplace actions phong phú; Cypress hỗ trợ headless UI automation, dễ viết Record/Playback; Postman/Newman cho phép chạy API tests trong pipeline; Allure cung cấp báo cáo đẹp, đáp ứng yêu cầu “đầy đủ 3 phần: Record‑Play, Data‑driven, Checkpoints”.
  - **Điểm yếu / Khó khăn:** Giới hạn thời gian chạy trên tier free cho các test phức tạp; Cypress có độ học tập cao; Cần script để đồng bộ AI‑audit logs.

* **GitLab**
  - **Công cụ đề xuất:** GitLab CI/CD + Cypress (UI) + Postman/Newman (API) + Allure (báo cáo).
  - **Lý do chọn:** Pipeline mạnh mẽ, hỗ trợ Docker shared runners, dễ cấu hình `.gitlab-ci.yml`; có khả năng tự host runner cho môi trường nội bộ; Cypress, Postman/Newman, Allure cung cấp chức năng tương tự.
  - **Điểm yếu / Khó khăn:** Cần cấu hình runner nếu không dùng shared runners; tài liệu có thể rời rạc; Cypress có độ học tập cao; Cần script để đồng bộ AI‑audit logs.

*   **Điểm yếu / Khó khăn dự kiến (AI):**
    - **GitHub Actions:** Giới hạn thời gian chạy trên tier free cho các test phức tạp.
    - **GitLab CI:** Cần cấu hình runner nếu không dùng shared runners; tài liệu có thể rời rạc.
    - **Cypress:** Độ học tập cao cho thành viên chưa quen.


