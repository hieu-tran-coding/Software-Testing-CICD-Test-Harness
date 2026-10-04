# 📋 Tổng hợp nhận xét & hướng dẫn của giáo viên (Tuần 3)

## 1. Yêu cầu chung
- **AI First:** Cho phép và khuyến khích sử dụng AI trong mọi khâu, nhưng phải **report lại toàn bộ prompt** đã dùng.
- **Báo cáo cho AI:** Nộp **text** (Markdown) cho AI đọc, kèm **file PDF / hình ảnh** để giảng viên chấm.
- **Video demo:** Nhiều video, mỗi video có **link** trong báo cáo và **giải thích ngắn** (giới thiệu lý thuyết liên quan ở đầu video).
- **Báo cáo tiến độ:** Cập nhật hàng tuần.
- **Tài liệu trình chiếu:** Dùng **light mode** để dễ nhìn.

## 2. Nhận xét & chỉ đạo cụ thể
1. **Tập trung vào DevOps / CI‑CD pipeline**
   - Đánh giá ưu tiên vào **giai đoạn xây dựng pipeline** (GitHub + Jenkins).
   - Phần test chỉ cần **liệt kê các loại test** (unit, API, UI, performance) mà không cần triển khai chi tiết.
2. **Công cụ bắt buộc**
   - **GitHub** cho repository và CI.
   - **Jenkins** cho pipeline CI‑CD.
3. **Mini‑demo**
   - Tạo **scripts ngắn** để các bạn trong lớp có thể chạy nhanh, thay vì yêu cầu demo toàn bộ.
4. **Hợp tác với các nhóm khác**
   - Nếu có thể **kết nối pipeline CI‑CD** của mình với các chủ đề test của các nhóm khác, sẽ là điểm cộng.

## 3. Hành động cần thực hiện
- **AI audit log:** Lưu lại mọi prompt và output trong `docs/ai-audit-logs/week-3/`.
- **Cấu hình pipeline:**
  - Sử dụng **GitHub Actions** để trigger Jenkins (hoặc ngược lại) và thực thi các stage CI‑CD.
  - Định nghĩa các stage: `checkout → build → test list → report → deploy`.
  - **Thay đổi công cụ CI/CD:** Chuyển từ **GitHub Actions + GitLab CI** sang **GitHub Actions + Jenkins** theo chỉ đạo của giáo viên.
- **Tài liệu & slide:**
  - Chuẩn bị slide **light mode** (Markdown → PPTX).
  - Bao gồm các **link video** và mô tả ngắn gọn.
- **Video demo:**
  - Ghi lại **mini‑demo** cho mỗi chủ đề (pipeline trigger, Jenkins job, artifact upload, …).
  - Đặt **đầu video** là phần giới thiệu lý thuyết ngắn.

