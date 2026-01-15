<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# ABC 系招生博覽會簽到系統

[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Gemini AI](https://img.shields.io/badge/Gemini%20AI-8E75B2?style=flat&logo=google&logoColor=white)](https://ai.google.dev/)

一個現代化的招生博覽會簽到系統，整合 AI 生成客製化歡迎信，並自動發送郵件通知給學生。

View your app in AI Studio: https://ai.studio/apps/drive/1wbkpdUMo8_zfC18lMMO3DL1EUWq7cQa0

---

## ✨ 功能特色

### 🎯 核心功能
- **智能簽到表單** - 收集姓名、Email、國籍、電話等資訊
- **AI 個人化歡迎信** - 使用 Gemini 2.0 Flash 生成專屬歡迎信
- **自動郵件發送** - 簽到後自動發送 HTML 格式的精美歡迎信到學生信箱
- **資料庫儲存** - 支援 SQLite（開發）和 PostgreSQL（正式環境）
- **後台管理系統** - 隱藏入口（點擊 Logo 5 次），查看所有學生名單
- **數據分析** - 每日簽到趨勢圖表
- **CSV 匯出** - 一鍵匯出所有學生資料，包含郵件發送狀態

### 📧 歡迎信內容
每封歡迎信包含：
- 🎓 系所資訊與品牌設計
- 📝 AI 生成的個人化歡迎文字
- 🌐 **申請網站**: https://www.nccu.edu.tw/abc/apply
- 🏛️ **系所網站**: https://www.nccu.edu.tw/abc
- 📧 **聯絡信箱**: abc-admission@nccu.edu.tw
- 🎨 現代化的 HTML 設計與響應式排版

---

## 🚀 快速開始

### 必要條件
- Node.js (v18+ 推薦)
- Python 3.10+
- PostgreSQL (正式環境) 或 SQLite (測試)

### 1. 安裝相依套件

**前端**:
```bash
npm install
```

**後端**:
```bash
pip install -r requirements.txt
```

### 2. 環境變數設定

建立 `.env.local` 檔案（**不要提交到 Git**）：

```bash
# Gemini AI API Key (必填)
GEMINI_API_KEY=your-gemini-api-key-here

# SMTP 郵件設定 (選填，不設定則不發送郵件)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password  # 使用應用程式密碼
SMTP_FROM_EMAIL=your-email@gmail.com
SMTP_FROM_NAME=ABC系招生組

# 資料庫設定 (選填，預設使用 SQLite)
DATABASE_URL=postgresql://user:password@localhost/dbname
```

> **Gmail users**: 需要啟用「兩步驟驗證」並生成「應用程式密碼」([教學](https://support.google.com/accounts/answer/185833))

### 3. 執行應用程式

**開發環境 (前端 + 後端同時啟動)**:

Terminal 1 - 啟動後端 FastAPI:
```bash
python main.py
```
後端將在 `http://localhost:8080` 運行

Terminal 2 - 啟動前端 Vite Dev Server:
```bash
npm run dev
```
前端將在 `http://localhost:5173` 運行

### 4. 建置正式環境

```bash
# 建置前端
npm run build

# 執行 FastAPI (會自動服務 dist 資料夾)
python main.py
```

訪問 `http://localhost:8080` 即可看到完整應用程式

---

## 📊 系統架構

### 技術棧
- **前端**: React 19 + TypeScript + Vite + Recharts
- **後端**: FastAPI + SQLAlchemy + Pydantic
- **資料庫**: PostgreSQL / SQLite
- **AI**: Google Gemini 2.0 Flash
- **郵件**: SMTP (Gmail / SendGrid / Mailgun)

### API 端點

| 方法 | 路徑 | 說明 |
|------|------|------|
| `POST` | `/api/checkin` | 學生簽到（自動發送郵件） |
| `GET` | `/api/students` | 取得所有學生名單 |
| `GET` | `/api/analytics` | 取得每日統計數據 |
| `GET` | `/api/export` | 匯出 CSV 檔案 |

### 資料庫結構

**students 表格**:
| 欄位 | 類型 | 說明 |
|------|------|------|
| `id` | Integer | 主鍵 |
| `name` | String(100) | 學生姓名 |
| `email` | String(255) | 學生Email (唯一) |
| `nationality` | String(100) | 國籍 |
| `phone` | String(50) | 電話號碼 (可選) |
| `check_in_time` | DateTime | 簽到時間 |
| `letter` | String(2000) | AI 生成的歡迎信 |
| `email_sent` | Integer | 郵件發送狀態 (0=失敗, 1=成功) |

---

## 🎨 使用者介面

### 簽到頁面
- 現代化的表單設計
- 支援姓名、Email、國籍（17個選項）、電話輸入
- 即時狀態回饋
- 響應式設計

### 成功頁面
- 顯示 AI 生成的個人化歡迎信
- 提示已發送郵件到信箱
- 返回首頁按鈕

### 管理後台 (隱藏入口)
- **進入方式**: 連續點擊頁面頂部 Logo 5 次
- 即時統計數據 (總人數、活躍日期、系統狀態)
- 每日簽到趨勢圖表
- 學生名單 (可搜尋姓名、Email、國籍、電話)
- 顯示國籍標籤和電話資訊
- CSV 一鍵匯出

---

## 📧 郵件服務配置

### Gmail SMTP (推薦用於測試)
1. 啟用 Google 帳戶的「兩步驟驗證」
2. 生成「應用程式密碼」
3. 在 `.env.local` 設定：
   ```
   SMTP_USERNAME=your@gmail.com
   SMTP_PASSWORD=your-16-digit-app-password
   ```

### SendGrid (推薦用於正式環境)
1. 註冊 [SendGrid](https://sendgrid.com/) 帳號（免費額度：100封/天）
2. 生成 API Key
3. 修改 `email_service.py` 使用 SendGrid SDK

---

## 🔧 疑難排解

### 郵件無法發送
1. 確認 SMTP 憑證是否正確
2. 檢查防火牆是否阻擋 587 port
3. 查看終端機的錯誤訊息（`email_service.py` 會記錄所有錯誤）
4. 測試環境可以暫時移除 SMTP 設定，系統仍可正常簽到

### TypeScript lint 錯誤
執行以下命令安裝缺少的類型定義：
```bash
npm install
```

### 資料庫遷移
如果修改了資料庫模型，刪除 `students.db` 重新啟動即可（SQLite）。
PostgreSQL 需使用 Alembic 進行遷移。

---

## 📦 部署

### Render / Railway / Zeabur
1. 連結 GitHub repository
2. 設定環境變數 (`GEMINI_API_KEY`, `SMTP_*`, `DATABASE_URL`)
3. 建置命令: `npm install && npm run build && pip install -r requirements.txt`
4. 啟動命令: `python main.py`

### 環境變數 (正式環境必填)
- `GEMINI_API_KEY` - Gemini AI API 金鑰
- `DATABASE_URL` - PostgreSQL 連線字串
- `SMTP_*` - 郵件服務設定（選填）

---

## 📝 授權

© 2026 ABC Department, National Chengchi University. All rights reserved.

Powered by Modern Web Technologies & Gemini AI

---

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request！

## 📞 聯絡方式

- **系所網站**: https://www.nccu.edu.tw/abc
- **聯絡信箱**: abc-admission@nccu.edu.tw
