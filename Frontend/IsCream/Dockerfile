# Node.js로 빌드
FROM node:18-alpine AS build

# 작업 디렉토리 설정
WORKDIR /app

# package.json 복사 및 의존성 설치
COPY IsCream/package*.json ./
RUN npm install

# 소스 코드 복사 및 빌드
COPY IsCream/ .
RUN npm run build

# NGINX로 정적 파일 서빙
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

# NGINX 기본 포트 설정
EXPOSE 80

# NGINX 실행
CMD ["nginx", "-g", "daemon off;"]
