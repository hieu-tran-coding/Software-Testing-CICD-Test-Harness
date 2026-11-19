# Kế hoạch Tuần 6 — Person E

**Họ và tên:** Trần Trọng Trí — **MSSV:** 20120221.

Tiếp tục phía Jenkins của Week5, phối hợp với Person D. Week6 Person D đã cài
Cypress, cấu hình Allure, credentials và viết 2 test public UI. Phần của em là
bổ sung test tài khoản, kiểm chứng luồng Jenkins và chuẩn bị demo/báo cáo ngắn.

| Công việc | Điều kiện hoàn thành |
|---|---|
| Thêm 3 Cypress test validation tài khoản | Gọi API thật, kiểm tra HTTP 422 và lỗi hiển thị; không tạo dữ liệu tồn đọng |
| Kiểm chứng cả bộ 5 UI test trên Jenkins | Build SUCCESS, Allure có 5 passed, lưu artifacts |
| Demo chặn image tag sai | `latest` bị từ chối; build FAILURE và API client trả exit code 1 |
| Chạy lại sau failure | Build SUCCESS trở lại, tài nguyên từng build được dọn |
| Bàn giao | Report đúng tên/MSSV, evidence mới, hướng dẫn demo đủ để chạy lại |

Code phát triển ở `realworld`, nhánh `feature/week6-jenkins-demo`. Báo cáo lưu ở
`Week6/PersonE` trên nhánh `docs-and-reports`. Không nhận phần cài đặt hoặc build
của Person D là kết quả của mình. Chưa ghi audit Week6 khi chưa được yêu cầu.

Giới hạn: kiểm chứng API trigger tại máy local; trigger từ GitHub-hosted runner
đến Jenkins localhost cần kết nối mạng phù hợp và không nằm trong kết quả đã xác nhận.
