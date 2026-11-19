# Báo cáo Tuần 6 - Person B

- **Họ và tên:** Dương Trọng Hòa
- **MSSV:** 23120127
- **Vai trò:** Thành viên B - CI/CD GitHub Actions Pipeline & Security / Test Reporting Specialist
- **Repository SUT (Mã nguồn & CI):** [thu2005/realworld](https://github.com/thu2005/realworld) (Branch: `ci-github-actions`)
- **Repository Báo cáo & Tài liệu:** [Software-Testing-CICD-Test-Harness](https://github.com/hieu-tran-coding/Software-Testing-CICD-Test-Harness) (Branch: `docs-and-reports`)
- **Thời gian thực hiện:** 22/10/2026

---

## 1. Mục tiêu và phạm vi công việc Tuần 6

Trong Tuần 6 của dự án môn học **Kiểm thử phần mềm & CI/CD**, tiếp nối thành công của việc thiết lập khung CI 10 jobs và cấu hình ESLint ở Tuần 5 (Tasks B-1, B-2), Thành viên B tiếp tục nhận trách nhiệm hoàn thiện các khâu bảo mật tự động và nâng cao tính trực quan của báo cáo kiểm thử:

### Các nhiệm vụ trọng tâm:
1. **Task B-3: Add unit test step to CI**
   - Xác nhận và bảo đảm bước kiểm thử đơn vị với Jest (`npm run test:unit`) tích hợp đầy đủ trong pipeline, đáp ứng tiêu chí độ bao phủ mã nguồn (code coverage) $\ge 80\%$.
2. **Task B-4: Add API integration test step to CI**
   - Đảm bảo bước kiểm thử tích hợp API (`npm run test:api`) sử dụng SuperTest thực thi đồng bộ trên CI và xuất kết quả định dạng chuẩn JUnit XML (`test-reports/junit/jest-api.xml`).
3. **Task B-5: Add security scan step**
   - Nâng cấp bước quét lỗ hổng bảo mật dependency (`npm audit --json`), thiết lập quy tắc chặn tự động (fail-fast gate) ở cấp độ High hoặc Critical (`npm audit --audit-level=high`).
4. **Task B-9: Configure CodeQL SAST workflow in GitHub Actions**
   - Xây dựng workflow CodeQL độc lập (`.github/workflows/codeql.yml`) quét bảo mật mã nguồn tĩnh tự động (SAST) cho toàn bộ mã nguồn JavaScript & TypeScript, rà soát lỗ hổng Injection, Broken Access Control, và các điểm yếu CWE theo Đề án (Section 3).
5. **Task B-10: Publish Allure Report dashboard on GitHub Actions**
   - Tích hợp công đoạn tạo báo cáo kiểm thử tương tác Allure thông qua `allure-report-action`, tổng hợp dữ liệu kiểm thử từ Jest và SuperTest thành dashboard HTML chuyên nghiệp xuất bản dưới dạng artifacts của workflow theo Đề án (Bước 12).

---

## 2. Chi tiết thực hiện các nhiệm vụ kỹ thuật

### 2.1. Rà soát và hoàn thiện Task B-3 & Task B-4
- **Hiện trạng:** Trong quá trình tích hợp giữa Person B và Person C, hai job `unit-test` và `api-test` đã được định nghĩa trong `.github/workflows/ci.yml`.
- **Đánh giá chuẩn hóa:**
  - `unit-test`: Chạy song song sau `install`, thực thi `npm run test:unit`, thu thập độ bao phủ và xuất báo cáo `jest-unit.xml` cùng `coverage-summary.json` (đạt 100% coverage trên các module cốt lõi `lib.js`, `auth.js`).
  - `api-test`: Khởi chạy server nền tảng, smoke check endpoint `GET /api/tags`, chạy 15 bài kiểm thử SuperTest (`jest-api.xml`) và xuất bản artifacts.

---

### 2.2. Triển khai Task B-5: Nâng cấp Security Scan Gate (Fail on High/Critical)

#### Phân tích & Giải pháp:
Trước đó, job `security-scan` sử dụng cờ `|| true` khiến bước quét bảo mật luôn báo xanh kể cả khi tồn tại lỗ hổng nghiêm trọng. Để tuân thủ đúng yêu cầu đặc tả của B-5:
- Khôi phục `node_modules` từ bộ nhớ đệm cache (`actions/cache`) để npm có đủ metadata phân tích.
- Xuất toàn bộ dữ liệu audit dạng JSON (`test-reports/security-audit.json`) phục vụ lưu trữ artifact.
- Trích xuất và hiển thị bảng tóm tắt phân loại lỗ hổng (Info, Low, Moderate, High, Critical) trực tiếp ra `$GITHUB_STEP_SUMMARY`.
- Thực thi chặn lỗi nghiêm ngặt: `npm audit --audit-level=high` để dừng pipeline khi phát hiện lỗ hổng cấp High hoặc Critical.

```yaml
      - name: Restore node modules
        uses: actions/cache@0057852bfaa89a56745cba8c7296529d2fc39830 # v4.3.0
        with:
          path: node_modules
          key: ${{ runner.os }}-node-${{ env.NODE_VERSION }}-modules-${{ hashFiles('package.json') }}

      - name: Run security vulnerability audit
        run: |
          mkdir -p test-reports
          echo "Running npm audit scan..."
          npm audit --json > test-reports/security-audit.json || true

          echo "## 🛡️ Security Vulnerability Scan Summary" >> $GITHUB_STEP_SUMMARY
          if [ -f test-reports/security-audit.json ]; then
            node -e "
              try {
                const report = JSON.parse(require('fs').readFileSync('test-reports/security-audit.json'));
                const vulns = (report.metadata && report.metadata.vulnerabilities) || report.vulnerabilities || {};
                console.log('| Severity | Count |');
                console.log('| --- | --- |');
                console.log('| Info | ' + (vulns.info || 0) + ' |');
                console.log('| Low | ' + (vulns.low || 0) + ' |');
                console.log('| Moderate | ' + (vulns.moderate || 0) + ' |');
                console.log('| High | ' + (vulns.high || 0) + ' |');
                console.log('| Critical | ' + (vulns.critical || 0) + ' |');
              } catch (e) {
                console.log('Unable to parse audit summary: ' + e.message);
              }
            " >> $GITHUB_STEP_SUMMARY
          fi

          echo "Evaluating security vulnerabilities (fails on high/critical per Task B-5)..."
          npm audit --audit-level=high
```

---

### 2.3. Triển khai Task B-9: Cấu hình Workflow CodeQL SAST (`.github/workflows/codeql.yml`)

#### Phân tích & Thiết kế:
Tạo mới workflow độc lập chuyên trách Static Application Security Testing (SAST) nhằm kiểm tra định kỳ và quét tự động các Pull Request:
- **Tên workflow:** `CodeQL SAST Analysis`
- **Bộ truy vấn (Query suites):** `security-extended,security-and-quality` nhằm rà soát chuyên sâu các mẫu lỗ hổng CWE (như SQL Injection, NoSQL Injection, XSS, Path Traversal, Hardcoded Secrets).
- **Ngôn ngữ mục tiêu:** `javascript-typescript`.
- **An toàn bảo mật:** Ghim SHA 40 ký tự cho CodeQL Action (`github/codeql-action/init` và `analyze` tại commit SHA `e1c541575b54ca50e5f5dcc7da77615756cf9f51` tương ứng release v3.39.1) tuân thủ quy tắc bảo mật SonarCloud Rule S6544.

```yaml
name: "CodeQL SAST Analysis"

on:
  push:
    branches: [ "next", "main", "ci-github-actions" ]
  pull_request:
    branches: [ "next", "main" ]
  schedule:
    - cron: '30 1 * * 1'
  workflow_dispatch:

permissions:
  contents: read

jobs:
  analyze:
    name: CodeQL Static Security Analysis (SAST)
    runs-on: ubuntu-latest
    permissions:
      actions: read
      contents: read
      security-events: write

    strategy:
      fail-fast: false
      matrix:
        language: [ 'javascript-typescript' ]

    steps:
      - name: Checkout repository
        uses: actions/checkout@b4ffde65f46336ab88eb53be808477a3936bae11 # v4.1.1
        with:
          submodules: recursive

      - name: Initialize CodeQL
        uses: github/codeql-action/init@e1c541575b54ca50e5f5dcc7da77615756cf9f51 # v3.39.1
        with:
          languages: ${{ matrix.language }}
          queries: security-extended,security-and-quality

      - name: Perform CodeQL Analysis
        uses: github/codeql-action/analyze@e1c541575b54ca50e5f5dcc7da77615756cf9f51 # v3.39.1
        with:
          category: "/language:${{matrix.language}}"
```

---

### 2.4. Triển khai Task B-10: Xuất bản Dashboard Allure Report trong GitHub Actions

#### Phân tích & Tích hợp:
Theo Hợp đồng CI/CD (`CI_INTEGRATION_CONTRACT.md`, Mục 6), dữ liệu thô của Allure phải đặt tại `test-reports/allure-results/`.
- Job mới `allure-report` được thêm vào cuối pipeline chính:
  - Phụ thuộc: `needs: [unit-test, api-test]`.
  - Điều kiện chạy: `if: always() && !cancelled()` (đảm bảo tạo báo cáo kể cả khi có bài test bị thất bại để hỗ trợ gỡ lỗi trực quan).
  - Tải về và tổng hợp các file XML kiểm thử từ Jest unit và SuperTest API.
  - Sử dụng Action `simple-elf/allure-report-action@385367cde61ac68c2568a117f7579f7f148dc459` (v1.15) để biên dịch sang website HTML tĩnh.
  - Đóng gói và upload artifact `allure-report-dashboard` lưu trữ 7 ngày phục vụ nghiệm thu.

```yaml
  allure-report:
    name: Allure Report Dashboard
    needs: [unit-test, api-test]
    if: always() && !cancelled()
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@b4ffde65f46336ab88eb53be808477a3936bae11 # v4.1.1

      - name: Download unit test reports
        uses: actions/download-artifact@d3f86a106a0bac45b974a628896c90dbdf5c8093 # v4.3.0
        with:
          name: unit-test-report
          path: test-reports/unit

      - name: Download API test reports
        uses: actions/download-artifact@d3f86a106a0bac45b974a628896c90dbdf5c8093 # v4.3.0
        with:
          name: api-test-report
          path: test-reports/api

      - name: Aggregate test results for Allure
        run: |
          mkdir -p test-reports/allure-results
          find test-reports/unit test-reports/api -type f \( -name "*.xml" -o -name "*.json" \) -exec cp {} test-reports/allure-results/ \;
          echo "Aggregated raw results in test-reports/allure-results:"
          ls -la test-reports/allure-results

      - name: Generate Allure Report
        uses: simple-elf/allure-report-action@385367cde61ac68c2568a117f7579f7f148dc459 # v1.15
        if: always()
        with:
          allure_results: test-reports/allure-results
          allure_report: allure-report
          allure_history: allure-history
          keep_reports: 20

      - name: Upload Allure Report Artifact
        uses: actions/upload-artifact@ea165f8d65b6e75b540449e92b4886f43607fa02 # v4.6.2
        if: always()
        with:
          name: allure-report-dashboard
          path: allure-report
          retention-days: 7
```

---

## 3. Tổng kết nghiệm thu & Trạng thái Git

- **Các cam kết mã nguồn (Commits) trên repo `thu2005/realworld` (nhánh `ci-github-actions`):**
  - Commit `3bb8c24`: `chore: sync latest changes from next branch into ci-github-actions`
  - Commit `19c70a9`: `feat(ci): implement security scan fail-fast (B-5), CodeQL SAST (B-9), and Allure report dashboard (B-10)`
- **Trạng thái lưu trữ:**
  - Đã commit hoàn chỉnh trên local repository.
  - Tuân thủ yêu cầu: **Chưa push lên remote, chưa merge vào nhánh chính** để chờ kiểm duyệt của nhóm.
