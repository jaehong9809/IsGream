# Node.js 실행 환경 설정
FROM node:18-alpine

# 작업 디렉토리 설정
WORKDIR /app

# package.json 및 package-lock.json 복사 및 의존성 설치
COPY package*.json ./
RUN npm install

# 전체 소스 복사
COPY . .

# 기본 포트 노출
EXPOSE 5173  # Vite 기본 포트, 필요 시 변경 가능

# 개발 서버 실행
CMD ["npm", "run", "dev"]