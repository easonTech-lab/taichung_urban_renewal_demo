# 構建階段
FROM node:20-alpine AS builder

WORKDIR /app
ENV VITE_BASE=/taichung_urban_renewal/

# 複製依賴文件
COPY package*.json ./

# 安裝依賴
RUN npm ci

# 複製源代碼
COPY . .

# 構建應用
RUN npm run build

# 生產階段
FROM nginx:alpine

# 複製構建產物到 nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# 複製 nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 5566

CMD ["nginx", "-g", "daemon off;"]
