from itertools import chain
import os
from typing import List
import torch
from torchvision.models.detection import fasterrcnn_resnet50_fpn_v2
from torchvision.models.detection.faster_rcnn import FastRCNNPredictor
from torchvision.ops import nms
from PIL import Image
from torchvision import transforms
import uuid

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

def load_model(model_path, num_classes=2):
    model = fasterrcnn_resnet50_fpn_v2(pretrained=False)
    in_features = model.roi_heads.box_predictor.cls_score.in_features
    model.roi_heads.box_predictor = FastRCNNPredictor(in_features, num_classes)
    model.load_state_dict(torch.load(model_path, map_location=device))
    model.to(device)
    model.eval()
    return model

def compute_bounding_boxes(model, image, confidence_threshold=0.5, iou_threshold=0.5, height=1024, width=1024, label_map=None):
    original_width, original_height = image.size
    if image.mode != 'RGB':
        image = image.convert('RGB')
    # Define the same transform as used in training
    transform = transforms.Compose([
        transforms.Resize((height, width)),
        transforms.ToTensor()
    ])
    
    # Apply the transform to the input image
    image_tensor = transform(image).unsqueeze(0).to(device)

    # print(f"Image tensor shape: {image_tensor.shape}")
    
    with torch.no_grad():
        prediction = model(image_tensor)[0]
    
    #print(prediction)
    boxes = prediction['boxes'].cpu()
    scores = prediction['scores'].cpu()
    labels = prediction['labels'].cpu()
    
    # apply confidence threshold
    mask = scores > confidence_threshold
    boxes = boxes[mask]
    scores = scores[mask]
    labels = labels[mask]
    
    # Apply NMS
    keep = nms(boxes, scores, iou_threshold)
    boxes = boxes[keep].numpy()
    scores = scores[keep].numpy()
    labels = labels[keep].numpy()

    # apply inverse scaling to get the bounding boxes relative to the original image
    scale_x = original_width / width
    scale_y = original_height / height
    
    boxes[:, [0, 2]] *= scale_x
    boxes[:, [1, 3]] *= scale_y

    if label_map:
        labels = [label_map.get(label, label) for label in labels]
    
    result = [{ 'box': {
        'id': str(uuid.uuid4()),
        'x1': box.tolist()[0],
        'y1': box.tolist()[1],
        'x2': box.tolist()[2],
        'y2': box.tolist()[3]
    }, 'score': float(score), 'label': label} for box, score, label in zip(boxes, scores, labels)]
    return result


def save_bar_bb_to_image(bbs: List[List[dict]], image_path, save_dir="tab_boxes", confidence_threshold=0.5, iou_threshold=0.5, u=0, d=0, l=0, r=0):
    """
    Given the bar bounding boxes of a tablature page, extract them and save them as images.
    """
    image = Image.open(image_path)
    image_name = os.path.splitext(os.path.basename(image_path))[0]

    os.makedirs(save_dir, exist_ok=True)
    i = 0
    for row in bbs:
        # print(len(row))
        for bb in row:
            i += 1
            # Extract coordinates
            x1, y1, x2, y2 = map(int, bb['box'])
            
            # Crop the image
            cropped_bar = image.crop((x1 - l, y1 - u, x2 + r, y2 + d))
            
            # Generate a filename for the cropped image
            filename = f"{image_name}_bar_{i}.png"
            bb['filename'] = filename
            filepath = os.path.join(save_dir, filename)
            
            # Save the cropped image
            cropped_bar.save(filepath)

def sort_bar_bounding_boxes(bbs: List[dict]): # bbs are in [x1, y1, x2, y2] format
    """
    Sorts the extracted bar bounding boxes of a tablature page from left->right, top->bottom
    """
    bbs_sorted = sorted(bbs, key=lambda box: box["box"]["y1"])
    def box_overlap(box1, box2):
        # vertically overlapping boxes are of the same row
        return max(0, min(box1["y2"], box2["y2"]) - max(box1["y1"], box2["y1"])) > 0
    
    rows = []

    for box in bbs_sorted:
        placed_in_row = False

        for row in rows:
            if any(box_overlap(box["box"], other_box["box"]) for other_box in row):
                row.append(box)
                placed_in_row = True
                break
        if not placed_in_row:
            rows.append([box])
    for row in rows:
        row.sort(key=lambda box: box["box"]["x1"])
    return rows