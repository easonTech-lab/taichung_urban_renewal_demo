#!/bin/bash

set -euo pipefail

# 台中都市更新 前端部署腳本 (在本機執行)
# 將專案同步到 180 伺服器並重建 docker 服務

# 顏色定義
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

handle_error() {
  echo -e "\n${RED}❌ 部署失敗，請檢查上方錯誤訊息。${NC}"
}

trap 'handle_error' ERR

# 依實際環境調整
APP_NAME="台中都市更新"
REMOTE_USER="easonadmin"
REMOTE_HOST="192.168.0.180"
REMOTE_DIR="/home/easonadmin/taichung_urban_renewal"
ACCESS_URL="http://${REMOTE_HOST}:5566/taichung_urban_renewal/"
APP_PORT="5566"

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
  if docker compose version >/dev/null 2>&1; then
    DOCKER_COMPOSE_CMD="docker compose"
  elif command -v docker-compose >/dev/null 2>&1; then
    DOCKER_COMPOSE_CMD="docker-compose"
  else
    echo "找不到 docker compose 或 docker-compose 指令"
    exit 1
  fi

  existing_containers=\$(docker ps -aq --filter "publish=${APP_PORT}")
  if [ -n "\$existing_containers" ]; then
    docker rm -f \$existing_containers >/dev/null 2>&1 || true
  fi

  \$DOCKER_COMPOSE_CMD down
  \$DOCKER_COMPOSE_CMD build --no-cache
  \$DOCKER_COMPOSE_CMD up -d
EOF

echo -e "${GREEN}✅ 部署完成${NC}"

echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}  ✅ 前端部署完成！${NC}"
echo -e "${GREEN}  訪問網址：${ACCESS_URL}${NC}"
echo -e "${GREEN}========================================${NC}"
