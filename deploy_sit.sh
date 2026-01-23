#!/bin/bash

# 台中都市更新 前端部署腳本 (在 180 伺服器上執行)
# 解壓 zip 檔案並重啟 nginx 容器

# 顏色定義
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 依實際路徑/檔名調整
APP_NAME="台中都市更新"
PROJECT_DIR="/home/easonadmin/taichung_urban_renewal"
ZIP_FILE="$PROJECT_DIR/taichung_urban_renewal-sit.zip"
ACCESS_URL="http://192.168.0.180:8084/taichung_urban_renewal/"

echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}  ${APP_NAME} 前端 SIT 部署${NC}"
echo -e "${YELLOW}========================================${NC}"

# 檢查 zip 檔案是否存在
if [ ! -f "$ZIP_FILE" ]; then
    echo -e "${RED}❌ 找不到 $ZIP_FILE${NC}"
    exit 1
fi

echo -e "${GREEN}[1/1] 解壓前端檔案...${NC}"
cd "$PROJECT_DIR" || exit 1

# 刪除所有檔案和目錄（除了 zip 檔）
find . -mindepth 1 ! -name "$(basename "$ZIP_FILE")" -delete

# 解壓縮
unzip -q "$(basename "$ZIP_FILE")"

# 刪除 zip 檔
rm -f "$(basename "$ZIP_FILE")"

echo -e "${GREEN}✅ 解壓完成${NC}"

echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}  ✅ 前端部署完成！${NC}"
echo -e "${GREEN}  訪問網址：${ACCESS_URL}${NC}"
echo -e "${GREEN}========================================${NC}"
