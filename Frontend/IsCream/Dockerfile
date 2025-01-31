# Nginx 실행 환경 설정
FROM nginx:alpine

# Nginx 설정 복사
COPY nginx.conf /etc/nginx/nginx.conf

# React 빌드 파일을 Nginx 디렉토리에 복사
COPY --from=build /app/dist /usr/share/nginx/html

# Nginx 기본 포트 노출
EXPOSE 80

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]