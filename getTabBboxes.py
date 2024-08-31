import os
import torch
from torchvision.models.detection import fasterrcnn_resnet50_fpn_v2
from torchvision.models.detection.faster_rcnn import FastRCNNPredictor
from torchvision.ops import nms
from PIL import Image
from torchvision import transforms

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

def load_model(model_path):
    model = fasterrcnn_resnet50_fpn_v2(pretrained=False)
    num_classes = 2
    in_features = model.roi_heads.box_predictor.cls_score.in_features
    model.roi_heads.box_predictor = FastRCNNPredictor(in_features, num_classes)
    model.load_state_dict(torch.load(model_path, map_location=device))
    model.to(device)
    model.eval()
    return model

def compute_bounding_boxes(model, image, confidence_threshold=0.5, iou_threshold=0.5):
    original_width, original_height = image.size
    if image.mode != 'RGB':
        image = image.convert('RGB')
    # Define the same transform as used in training
    transform = transforms.Compose([
        transforms.Resize((1024, 1024)),
        transforms.ToTensor()
    ])
    
    # Apply the transform to the input image
    image_tensor = transform(image).unsqueeze(0).to(device)

    print(f"Image tensor shape: {image_tensor.shape}")
    
    with torch.no_grad():
        prediction = model(image_tensor)[0]
    
    boxes = prediction['boxes'].cpu()
    scores = prediction['scores'].cpu()
    
    # apply confidence threshold
    mask = scores > confidence_threshold
    boxes = boxes[mask]
    scores = scores[mask]
    
    # Apply NMS
    keep = nms(boxes, scores, iou_threshold)
    boxes = boxes[keep].numpy()
    scores = scores[keep].numpy()

    # apply inverse scaling to get the bounding boxes relative to the original image
    scale_x = original_width / 1024
    scale_y = original_height / 1024
    
    boxes[:, [0, 2]] *= scale_x
    boxes[:, [1, 3]] *= scale_y
    
    result = [{'box': box.tolist(), 'score': float(score)} for box, score in zip(boxes, scores)]
    return result


def save_bar_bb_to_image(bbs, image_path, save_dir="tab_boxes", confidence_threshold=0.5, iou_threshold=0.5):
    """
    Given the bar bounding boxes of a tablature page, extract them and save them as images.
    """
    total_bars = len(bbs)
    image = Image.open(image_path)
    image_name = os.path.splitext(os.path.basename(image_path))[0]

    os.makedirs(save_dir, exist_ok=True)
    for i, bb in enumerate(bbs):
        # Extract coordinates
        x1, y1, x2, y2 = map(int, bb['box'])
        
        # Crop the image
        cropped_bar = image.crop((x1, y1, x2, y2))
        
        # Generate a filename for the cropped image
        filename = f"{image_name}_bar_{i+1}_of_{total_bars}.png"
        filepath = os.path.join(save_dir, filename)
        
        # Save the cropped image
        cropped_bar.save(filepath)

def sort_bar_bounding_boxes(bbs):
    """
    Sorts the extracted bar bounding boxes of a tablature page from left->right, top->bottom
    """
    def box_overlap(box1, box2):
        # vertically overlapping boxes are of the same row
        return max(0, min(box1[3], box2[3]) - max(box1[1], box2[1])) > 0
    
    sorted_boxes = []
    remaining_boxes = list(range(len(bbs)))
    while remaining_boxes:
        current_row = [remaining_boxes[0]]
        for i in remaining_boxes[1:]:
            if any(box_overlap(bbs[i], bbs[j]) for j in current_row):
                current_row.append(i)
        current_row.sort(key=lambda i: bbs[i][0])  # Sort current row left to right
        sorted_boxes.extend(current_row)
        remaining_boxes = [i for i in remaining_boxes if i not in current_row]

    return sorted_boxes