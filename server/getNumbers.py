import os
from typing import List
import torch
from torchvision.models.detection import fasterrcnn_resnet50_fpn_v2
from torchvision.models.detection.faster_rcnn import FastRCNNPredictor
from torchvision.ops import nms
from getTabBboxes import load_model, compute_bounding_boxes
from PIL import Image
from torchvision import transforms
import re
import uuid

TAB_BOXES_FOLDER = './tab_boxes'

# gets the bounding boxes of each note in the tab. returns the notes from left->right as they appear in the bar
def getNoteBoundingBoxes():
  model = load_model('./models/tabmagic_model_bars.pth')
  results = []
  for tab_box in os.listdir(TAB_BOXES_FOLDER):
    print(tab_box)
    full_path = os.path.abspath(os.path.join(TAB_BOXES_FOLDER, tab_box))
    pattern = r'_page_(\d+)_bar_(\d+)\.png$'
    match = re.search(pattern, tab_box)
    page_number = int(match.group(1))
    bar_number = int(match.group(2))
    image = Image.open(full_path)
    boxes = compute_bounding_boxes(model, image, label_map={1: "number"})
    sub_result = {
      "page": page_number,
      "bar": bar_number,
      "boxes": boxes
    }
    results.append(sub_result)
    print("Page: ", page_number, "Bar: ", bar_number, "Notes Detected: ", len(boxes))
  return results

