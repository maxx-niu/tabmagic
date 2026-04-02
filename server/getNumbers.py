import os
from typing import List
import torch
import torch.nn as nn
from torchvision.models.detection import fasterrcnn_resnet50_fpn_v2
from torchvision.models.detection.faster_rcnn import FastRCNNPredictor
from torchvision.ops import nms
from getTabBboxes import load_model, compute_bounding_boxes
from PIL import Image
from torchvision import transforms
import re
import uuid

TAB_BOXES_FOLDER = './tab_boxes'

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

class NumberCNN(nn.Module):
    def __init__(self, input_shape, hidden_units, output_shape):
        super().__init__()
        self.conv_block_1 = nn.Sequential(
            nn.Conv2d(input_shape, hidden_units, kernel_size=3, stride=1, padding=1),
            nn.ReLU(),
            nn.Conv2d(hidden_units, hidden_units, kernel_size=3, stride=1, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2)
        )
        self.conv_block_2 = nn.Sequential(
            nn.Conv2d(hidden_units, hidden_units*2, kernel_size=3, stride=1, padding=1),
            nn.ReLU(),
            nn.Conv2d(hidden_units*2, hidden_units*2, kernel_size=3, stride=1, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2)
        )
        self.classifier = nn.Sequential(
            nn.Flatten(),
            nn.Linear(hidden_units*2 * 7 * 10, output_shape)
        )

    def forward(self, x):
        x = self.conv_block_1(x)
        x = self.conv_block_2(x)
        x = self.classifier(x)
        return x


number_transform = transforms.Compose([
    transforms.Resize((40, 30)),
    transforms.Grayscale(),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.5], std=[0.5])
])


def load_number_model(model_path):
    model = NumberCNN(input_shape=1, hidden_units=15, output_shape=25)
    model.load_state_dict(torch.load(model_path, map_location=device))
    model.to(device)
    model.eval()
    return model


def classify_fret(number_model, bar_image, box):
    x1, y1, x2, y2 = int(box['x1']), int(box['y1']), int(box['x2']), int(box['y2'])
    cropped = bar_image.crop((x1, y1, x2, y2))
    tensor = number_transform(cropped).unsqueeze(0).to(device)
    with torch.inference_mode():
        logits = number_model(tensor)
        fret = torch.argmax(logits, dim=1).item()
    return fret


# gets the bounding boxes and fret number of each note in the entire tab.
# returns the notes from left->right as they appear in the bar
def getNoteBoundingBoxes():
    detection_model = load_model('./models/tabmagic_model_bars.pth')
    number_model = load_number_model('./models/number_model.pth')
    results = []
    for tab_box in os.listdir(TAB_BOXES_FOLDER):
        print(tab_box)
        full_path = os.path.abspath(os.path.join(TAB_BOXES_FOLDER, tab_box))
        pattern = r'_page_(\d+)_bar_(\d+)\.png$'
        match = re.search(pattern, tab_box)
        page_number = int(match.group(1))
        bar_number = int(match.group(2))
        bar_image = Image.open(full_path)
        boxes = compute_bounding_boxes(detection_model, bar_image, label_map={1: "number"})
        # classify each detected bounding box to get the fret number
        for item in boxes:
            item['fret'] = classify_fret(number_model, bar_image, item['box'])
        sub_result = {
            "page": page_number,
            "bar": bar_number,
            "boxes": boxes
        }
        results.append(sub_result)
    results.sort(key=lambda x: (x["page"], x["bar"]))
    return results
