# Public 資源檔案命名規則

本資料夾存放所有公開的靜態資源檔案（圖片、圖標等）。

## 命名規則

### 基本規則

1. **使用 kebab-case**：所有檔案名稱使用小寫字母和連字號（`-`），不使用空格或底線
2. **使用英文命名**：檔案名稱使用英文，避免使用中文或特殊字元
3. **描述性命名**：檔案名稱應清楚描述其用途和內容

### 命名格式

#### 單一用途檔案
格式：`{用途}.png`

範例：
- `logo.png` - Logo 圖檔
- `hero.png` - 首頁英雄區圖片
- `download.png` - 下載相關圖片

#### 多類型檔案
格式：`{用途}-{類型}.png`

範例：
- `empty-search.png` - 搜尋結果為空時的圖片
- `empty-case.png` - 案件列表為空時的圖片
- `dangerous-building.png` - 危老建築相關圖片
- `urban-renewal.png` - 都市更新相關圖片

### 檔案類型

- **圖片檔案**：使用 `.png`、`.jpg`、`.svg` 等標準圖片格式
- **圖標檔案**：SVG 圖標建議放在 `src/assets/svg/` 資料夾

### 已重命名的檔案

以下檔案已按照命名規則重命名：

- `case empty.png` → `empty-case.png`
- `search empty.png` → `empty-search.png`
- `dangerous building.png` → `dangerous-building.png`
- `urban renewal.png` → `urban-renewal.png`

### 使用範例

在 Vue 元件中使用：

```vue
<!-- 使用 Empty 元件 -->
<Empty type="search" />  <!-- 使用 empty-search.png -->
<Empty type="case" />    <!-- 使用 empty-case.png -->

<!-- 直接使用圖片 -->
<img src="/dangerous-building.png" alt="危老建築" />
<img src="/urban-renewal.png" alt="都市更新" />
```

## 注意事項

1. 新增圖片時請遵循命名規則
2. 重命名檔案後，請更新所有引用該檔案的地方
3. 避免使用中文檔名，以確保跨平台相容性
4. 圖片檔案應保持適當的大小和格式，以優化載入速度
