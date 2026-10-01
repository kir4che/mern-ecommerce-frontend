# 日出麵包坊 — 前端

![日出麵包坊](src/assets/images/logo.png)

一個 MERN 電商網站的前端，包含**前台購物**、**管理後台**兩大區塊，搭配後端 API（[mern-ecommerce-backend](https://github.com/kir4che/mern-ecommerce-backend)）使用。

## ✨ 功能特色

### 前台

- 首頁：商品輪播、最新活動、店家一覽、最新消息
- 商品：列表（分類/標籤/關鍵字篩選、無限滾動）、商品詳情
- 購物車：訪客購物車（localStorage）與登入後購物車（DB）自動合併
- 結帳：地址管理、運費計算、優惠券套用、綠界金流付款
- 會員：註冊、登入、重設密碼、我的帳戶（訂單/地址/密碼）
- 內容：新聞、關於、FAQ、聯絡我們

### 管理後台（需 admin 權限）

- 儀表板：銷售分析（Chart.js）
- 商品與內容 CRUD、訂單查詢與狀態管理、優惠券建立與停用、使用者查詢

### 主要流程

1. 瀏覽商品並加入購物車
2. 訪客購物車在重新整理後保留商品
3. 登入後同步訪客購物車與會員購物車
4. 結帳時處理地址、運費、優惠券與付款
5. 管理員在後台管理商品、訂單與內容

## 🛠 技術棧

| 類別      | 技術                                       |
| --------- | ------------------------------------------ |
| 框架      | React 19、TypeScript、Vite                 |
| 狀態管理  | Redux Toolkit、RTK Query（伺服器資料快取） |
| 路由      | React Router 7（lazy loading、路由守衛）   |
| UI 與圖表 | Tailwind CSS v4、daisyUI、Swiper、Chart.js |
| 表單      | react-hook-form、zod                       |
| 測試      | Vitest、Testing Library、MSW               |

認證由後端 Express Session + httpOnly cookie 處理，前端僅需設定 `credentials: "include"` 帶上 session cookie。

## 📁 專案架構

```
src/
├── components/   # UI / shared / features / forms
├── context/      # Alert、ConfirmDialog
├── hooks/        # useAuth、useCart 等
├── layouts/      # AppLayout、AdminLayout
├── pages/        # 前台與後台頁面
├── routes/       # 路由表 + 守衛
├── store/        # RTK Query api、slices、middleware
├── constants/    # 靜態資料
├── utils/        # 工具函式
├── mocks/        # MSW mock
└── test/         # 測試共用工具
```

## 🚀 開始使用

### 前置需求

- Node.js 22.12+ 或 24+
- 後端 API（[mern-ecommerce-backend](https://github.com/kir4che/mern-ecommerce-backend)）

### 安裝與啟動

在前端 repository 根目錄執行：

```bash
npm ci
cp .env.example .env.local
npm run dev
```

前端預設會在 `http://localhost:5173` 啟動，後端 API 預設會在 `http://localhost:8080` 啟動。使用前請先依照後端專案說明完成後端設定。

### 前端環境變數

複製 `.env.example` 為 `.env.local` 並設定：

```env
VITE_API_URL=http://localhost:8080/api
```

如果沒有 ECPay 測試環境，也可以在 `.env.local` 加入以下設定，使用開發環境的模擬付款流程：

```env
VITE_DEV_PAY=true
```

> `VITE_DEV_PAY=true` 只會在開發環境生效，正式環境仍需使用實際付款流程。

## 🧪 測試

```bash
npm run test:run    # 執行測試
npm run test:coverage
npm run typecheck   # TypeScript 檢查
npm run lint        # Oxlint 檢查
npm run format      # Prettier 檢查
```

## 📦 建置與部署

```bash
npm run build       # 建置 production
```

- 支援部署至 **Vercel**，`vercel.json` 已設定 SPA rewrites
- GitHub Actions 會執行格式、lint、typecheck、test 與 build 檢查
