# 1️⃣ Node.js를 이용해 빌드 (Vite/React 기준)
FROM node:18-alpine AS build

# 작업 디렉토리 설정
WORKDIR /app

# package.json과 package-lock.json 복사
COPY package*.json ./

# 의존성 설치 (캐시 최적화)
RUN npm install --frozen-lockfile

# 소스 코드 복사 후 빌드
COPY . .
RUN npm run build

# 2️⃣ Nginx로 정적 파일 서빙
FROM nginx:alpine

# Nginx 설정 복사 (gzip 압축 및 캐싱 적용)
COPY nginx.conf /etc/nginx/nginx.conf

# 빌드 결과물을 Nginx 정적 폴더로 복사
COPY --from=build /app/dist /usr/share/nginx/html

# Nginx 기본 포트 설정
EXPOSE 80

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]
