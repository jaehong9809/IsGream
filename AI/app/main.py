from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import yolo_service

# FastAPI 애플리케이션 생성
app = FastAPI()

# CORS 미들웨어 추가
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 모든 도메인 허용
    allow_credentials=True,  # 인증 정보를 포함한 요청 허용
    allow_methods=["*"],  # 모든 HTTP 메서드 허용
    allow_headers=["*"],  # 모든 HTTP 헤더 허용
)

# 라우터 등록
app.include_router(yolo_service.router, prefix="/ai", tags=["AI Service"])


# 기본 GET API
@app.get("/")
async def read_root():
    return {"message": "Hello, FastAPI with CORS!"}


# FastAPI 실행
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=8000)
