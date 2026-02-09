#!/bin/bash

# 台中都市更新 前端部署腳本 (在本機執行)
# 將專案同步到 180 伺服器並重建 docker 服務

# 顏色定義
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 依實際環境調整
APP_NAME="台中都市更新"
REMOTE_USER="easonadmin"
REMOTE_HOST="192.168.0.180"
REMOTE_DIR="/home/easonadmin/taichung_urban_renewal"
ACCESS_URL="http://${REMOTE_HOST}:5566/taichung_urban_renewal/"

# rsync 排除項目
EXCLUDES=(
  "--exclude=node_modules"
  "--exclude=.git"
  "--exclude=dist"
  "--exclude=*.log"
)

echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}  ${APP_NAME} 前端 SIT 部署${NC}"
echo -e "${YELLOW}========================================${NC}"

echo -e "${GREEN}[1/3] 同步專案到 ${REMOTE_HOST}...${NC}"
rsync -az --delete "${EXCLUDES[@]}" ./ "${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR}/"

echo -e "${GREEN}[2/3] 遠端重建 Docker 服務...${NC}"
ssh "${REMOTE_USER}@${REMOTE_HOST}" <<EOF
  set -e
  cd "${REMOTE_DIR}"
  docker compose down
  docker compose build --no-cache
  docker compose up -d
EOF

echo -e "${GREEN}✅ 部署完成${NC}"

echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}  ✅ 前端部署完成！${NC}"
echo -e "${GREEN}  訪問網址：${ACCESS_URL}${NC}"
echo -e "${GREEN}========================================${NC}"
