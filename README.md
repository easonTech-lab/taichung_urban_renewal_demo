# 台中都市更新專案

台中都市更新資訊平台，提供民眾端資訊查詢與後端管理功能。

## 技術棧

- **框架**: Vue 3.5 + TypeScript
- **構建工具**: Vite 7
- **路由**: Vue Router 4
- **狀態管理**: Pinia 2
- **樣式**: Tailwind CSS 3
- **日期處理**: Day.js
- **工具庫**: VueUse
- **UI 組件**: Flowbite

## 專案結構

```
src/
├── assets/          # 靜態資源（SVG 圖標等）
├── components/      # 組件
│   ├── atoms/      # 原子組件（按鈕、輸入框、表格等）
│   ├── molecules/  # 分子組件（卡片、列表項等）
│   └── sections/   # 區塊組件（頁面區塊）
│       ├── frontend/  # 前端區塊
│       ├── backend/    # 後端區塊
│       └── global/    # 全局區塊
├── config/         # 配置文件
├── router/         # 路由配置
├── store/          # 狀態管理
├── views/          # 頁面視圖
│   ├── frontend/   # 前端頁面
│   └── backend/    # 後端管理頁面
└── main.ts         # 應用入口
```

## 安裝與運行

### 環境要求

- Node.js >= 20
- npm 或 yarn

### 安裝依賴

```bash
npm install
```

### 開發模式

```bash
npm run dev
```

### 構建生產版本

```bash
npm run build
```

### 預覽生產版本

```bash
npm run preview
```

### 程式碼格式化

```bash
# 格式化程式碼
npm run format

# 檢查格式
npm run format:check
```

## 功能說明

### 前端功能

- **首頁**: 展示都市更新相關資訊、統計數據、服務介紹
- **新聞**: 最新消息與公告
- **下載**: 相關文件下載
- **電子服務**: 線上服務申請
- **常見問題**: FAQ 問答
- **會議**: 會議資訊查詢
- **登入/註冊**: 用戶認證功能
- **忘記密碼**: 密碼重置功能

### 後端管理功能

- **案件管理**: 都市更新案件列表、篩選、分頁管理

## 組件說明

### 原子組件 (Atoms)

- `ButtonCTA`: 按鈕組件
- `Input`: 輸入框組件
- `Table`: 表格組件
- `Pagination`: 分頁組件
- `Tabs`: 標籤頁組件
- `Breadcrumb`: 麵包屑導航
- `Icon`: 圖標組件
- `Dropdown`: 下拉選單
- `DatePicker`: 日期選擇器
- `DateRangePicker`: 日期區間選擇器
- `SearchInput`: 搜尋輸入框
- `Accordion`: 手風琴組件
- `SidebarAccordion`: 側邊欄手風琴
- `Badge`: 徽章組件
- `Empty`: 空狀態組件
- `Modal`: 模態框組件

### 分子組件 (Molecules)

- `ServiceCard`: 服務卡片
- `StatCard`: 統計卡片
- `NewsItem`: 新聞項目
- `FAQColumn`: 常見問題欄位
- `DownloadItem`: 下載項目

### 區塊組件 (Sections)

- **前端區塊**: 首頁各區塊（英雄區、統計、服務、新聞、下載、常見問題、會議）
- **後端區塊**: 側邊欄導航
- **全局區塊**: 導航欄、頁尾

## 開發規範

### 組件命名

- 原子組件使用 PascalCase，如 `ButtonCTA.vue`
- 分子組件使用 PascalCase，如 `ServiceCard.vue`
- 區塊組件使用 PascalCase，如 `HeroSection.vue`

### 程式碼風格

- 使用 TypeScript 進行類型檢查
- 使用 Composition API (`<script setup>`)
- 使用 Tailwind CSS 進行樣式設計
- 遵循 Prettier 格式化規範

### 路由配置

路由配置位於 `src/router/index.ts`，包含前端和後端路由。

## 瀏覽器支援

- Chrome 
- Firefox 
- Safari 
- Edge 

## 授權

本專案為毅聲科技私有專案。
