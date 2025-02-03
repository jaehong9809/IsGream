import torch
from pathlib import Path

# house
house_path = Path(__file__).resolve().parent.parent / "model" / "house.pt"
if not house_path.exists():
    raise FileNotFoundError(f"Model file not found at {house_path}")
house_model = torch.hub.load('ultralytics/yolov5', 'custom', path=str(house_path), force_reload=True)

# tree
tree_path = Path(__file__).resolve().parent.parent / "model" / "tree.pt"
if not tree_path.exists():  # 'house_path' -> 'tree_path'
    raise FileNotFoundError(f"Model file not found at {tree_path}")
tree_model = torch.hub.load('ultralytics/yolov5', 'custom', path=str(tree_path), force_reload=True)

# male
male_path = Path(__file__).resolve().parent.parent / "model" / "male.pt"
if not male_path.exists():  # 'house_path' -> 'male_path'
    raise FileNotFoundError(f"Model file not found at {male_path}")
male_model = torch.hub.load('ultralytics/yolov5', 'custom', path=str(male_path), force_reload=True)

# female
female_path = Path(__file__).resolve().parent.parent / "model" / "female.pt"
if not female_path.exists():  # 'house_path' -> 'female_path'
    raise FileNotFoundError(f"Model file not found at {female_path}")
female_model = torch.hub.load('ultralytics/yolov5', 'custom', path=str(female_path), force_reload=True)
