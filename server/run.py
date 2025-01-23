import os
from getNumbers import getNoteBoundingBoxes
from PIL import Image, ImageDraw

TAB_BOXES_FOLDER = './tab_boxes'
OUTPUT_FOLDER = './output'

def draw_boxes_on_image(image_path, boxes):
    image = Image.open(image_path)
    draw = ImageDraw.Draw(image)
    for box in boxes:
        x1, y1, x2, y2 = box['box']['x1'], box['box']['y1'], box['box']['x2'], box['box']['y2']
        draw.rectangle([x1, y1, x2, y2], outline="red", width=2)
    return image

if __name__ == "__main__":
    if not os.path.exists(TAB_BOXES_FOLDER):
        print(f"Error: The folder '{TAB_BOXES_FOLDER}' does not exist.")
    else:
        note_bounding_boxes = getNoteBoundingBoxes()
        os.makedirs(OUTPUT_FOLDER, exist_ok=True)
        for item in note_bounding_boxes:
            page_number = item['page']
            bar_number = item['bar']
            boxes = item['boxes']
            image_filename = f"Screenshot 2025-01-22 160012_page_{page_number}_bar_{bar_number}.png"
            image_path = os.path.join(TAB_BOXES_FOLDER, image_filename)
            if os.path.exists(image_path):
                output_image = draw_boxes_on_image(image_path, boxes)
                output_image.save(os.path.join(OUTPUT_FOLDER, image_filename))
                print(f"Processed {image_filename}")
            else:
                print(f"Image {image_filename} not found in {TAB_BOXES_FOLDER}")