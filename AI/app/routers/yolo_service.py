from fastapi import APIRouter, HTTPException
import torch
from PIL import Image
import requests
from io import BytesIO
from pathlib import Path
from app.schemas.image import PredictionRequest
from app.model.yolo_models import house_model, tree_model, male_model, female_model
from app.core.core import diagnose
router = APIRouter()

model_path = Path(__file__).resolve().parent.parent / "model" / "best.pt"

if not model_path.exists():
    raise FileNotFoundError(f"Model file not found at {model_path}")

model = torch.hub.load('ultralytics/yolov5', 'custom', path=str(model_path), force_reload=True)


@router.post("/predict")
async def predict(request: PredictionRequest):
    global model
    predictions = []
    for file in request.files:
        if file.type == "house":
            model = house_model
        elif file.type == "tree":
            model = tree_model
        elif file.type == "male":
            model = male_model
        elif file.type == "female":
            model = female_model

        try:
            response = requests.get(file.imageUrl)
            if response.status_code != 200:
                raise HTTPException(status_code=400, detail=f"Invalid image URL: {file.imageUrl}")

            image = Image.open(BytesIO(response.content))
            width, height = image.size

            results = model(image)

            detected_objects = results.pandas().xyxy[0].to_dict(orient="records")

            for obj in detected_objects:
                obj["cx"] = (obj["xmin"] + obj["xmax"]) / 2
                obj["cy"] = (obj["ymin"] + obj["ymax"]) / 2
                obj["cx_norm"] = obj["cx"] / width
                obj["cy_norm"] = obj["cy"] / height

            # 결과 저장 (이미지 크기 포함)
            predictions.append({
                "time": file.time,
                "type": file.type,
                "imageUrl": file.imageUrl,
                "image_width": width,  # 이미지 가로 크기 추가
                "image_height": height,  # 이미지 세로 크기 추가
                "predictions": detected_objects
            })

        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error processing image: {file.imageUrl}, {str(e)}")

    diagnose_result = diagnose(predictions)
    return diagnose_result


@router.get("/status")
async def status():
    return {"status": "AI service is operational"}
