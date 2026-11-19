# 📝 FILE 3: MẪU BÁO CÁO CÁ NHÂN - TUẦN 3

**Họ và tên:** Dương Trọng Hòa
**MSSV:** 23120127  
**Phần việc:** Thành viên C - UI Automation & Record/Playback

---

## 1. Khảo sát Công cụ CI/CD
*   **2 công cụ CI/CD so sánh:** GitHub Actions vs GitLab CI
*   **So sánh nhanh (Ưu/Khuyết):** 
    *   *GitHub Actions:*
        - Ưu điểm: Tích hợp sẵn trên nền tảng GitHub (nơi nhóm đang quản lý mã nguồn). Dễ sử dụng, cộng đồng lớn với Marketplace actions đa dạng. Miễn phí cho public repo.
        - Khuyết điểm: Khó tuỳ biến môi trường self-hosted hơn một chút so với GitLab CI. Giới hạn thời gian chạy ở bản free.
    *   *GitLab CI:*
        - Ưu điểm: Hệ thống pipeline cực kỳ mạnh mẽ, hỗ trợ rất tốt cho all-in-one DevOps. Dễ dàng cấu hình và mở rộng runner.
        - Khuyết điểm: Đòi hỏi dự án phải lưu trữ trên GitLab để tận dụng tối đa, nếu dùng repo ngoài sẽ phức tạp khi tích hợp.
*   **Vote công cụ cho dự án:** GitHub Actions. Lý do: Nhóm đang dùng GitHub nên việc tận dụng GitHub Actions sẽ giúp quy trình trơn tru, không cần phải setup quá nhiều kết nối từ bên thứ ba.

## 2. Nhận xét Kế hoạch Tổng thể
*   **Đánh giá chung:** Kế hoạch có lộ trình rõ ràng, bám sát các tuần học và đảm bảo đầy đủ các thành phần yêu cầu của môn học.
*   **Đề xuất chỉnh sửa:** Nên có sự phân chia cụ thể thời gian nghiên cứu các kịch bản Record/Playback để đảm bảo kịp tiến độ tích hợp vào CI/CD ở Tuần 4-5. Cần lưu ý việc chạy UI Test trong pipeline CI/CD thường tốn nhiều thời gian và tài nguyên, do đó cần thiết lập chiến lược chạy headless tối ưu.

## 3. Báo cáo Chuyên môn
### 3.1. Lý thuyết cốt lõi
*   **UI Test (Kiểm thử giao diện người dùng):** Là quá trình kiểm tra các thành phần trực quan của phần mềm (như nút bấm, form, hình ảnh, văn bản...) để đảm bảo chúng hoạt động đúng theo thiết kế và mang lại trải nghiệm tốt cho người dùng cuối. Trong tự động hóa, UI Test mô phỏng các thao tác của người dùng thực.
*   **Record & Playback:** Là một phương pháp kiểm thử tự động, trong đó công cụ sẽ ghi lại (Record) mọi thao tác thủ công của người dùng trên giao diện ứng dụng (như click, gõ phím, cuộn trang) và tạo ra các đoạn mã kịch bản (script) tương ứng. Sau đó, công cụ có thể tự động thực thi lại (Playback) các script này một cách chính xác mà không cần con người can thiệp.
*   **Thuật ngữ quan trọng:**
    *   *Headless Mode:* Chế độ chạy trình duyệt ẩn (không có giao diện đồ họa). Rất quan trọng khi chạy UI test trên CI/CD pipeline vì môi trường server/runner không có màn hình hiển thị. Giúp tiết kiệm tài nguyên và chạy nhanh hơn.
    *   *Locator (Bộ định vị):* Cách thức để kịch bản test xác định chính xác một phần tử trên giao diện (ví dụ: qua ID, Class, XPath, CSS Selector).
    *   *DOM (Document Object Model):* Mô hình đối tượng tài liệu, biểu diễn cấu trúc của một trang HTML. Automation test tool tương tác với các phần tử web thông qua DOM.

### 3.2. Đề xuất Công cụ / Giải pháp
*   **Công cụ/Ứng dụng đề xuất:** Cypress (Kết hợp thêm Cypress Studio cho tính năng Record/Playback).
*   **Lý do chọn & Trả lời yêu cầu của Leader:** 
    *   **Khả năng Record/Playback:** Mặc dù Cypress là một công cụ viết code automation mạnh mẽ, tính năng Record/Playback có thể được đáp ứng thông qua Cypress Studio (hoặc một số tiện ích mở rộng như Chrome Recorder xuất script sang Cypress). 
    *   **Khả năng chạy Headless:** Cypress hỗ trợ chạy headless hoàn hảo (`cypress run`) trên Electron và các trình duyệt Chromium/Firefox, rất dễ dàng tích hợp vào GitHub Actions.
    *   **Khảo sát so sánh với Katalon:** Katalon Studio rất mạnh về Record/Playback (dành cho cả người không biết code), tuy nhiên phiên bản miễn phí của Katalon bị giới hạn khi tích hợp CI/CD và chạy qua console mode/headless. Trong khi đó, Cypress hoàn toàn miễn phí cho việc chạy qua CLI trên CI/CD pipeline, tốc độ thực thi nhanh và được giới developer ưa chuộng.
*   **Điểm yếu / Khó khăn dự kiến:** 
    *   Cypress đòi hỏi người viết script phải có kiến thức nền tảng về JavaScript/TypeScript nếu kịch bản test phức tạp vượt ngoài khả năng của Record/Playback.
    *   Chỉ hỗ trợ test trên nền tảng Web, không hỗ trợ Mobile Native App.

---
> 🚨 **NHẮC NHỞ AI AUDIT:** Khai báo toàn bộ prompt/kết quả AI đã dùng cho báo cáo này vào file markdown cá nhân và commit thẳng lên thư mục `docs/ai-audit-logs/Week3/PersonC/`.
