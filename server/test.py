import cv2
import numpy as np
from PIL import Image

from staff_removal import get_staff_lines, remove_staff_lines

def remove_staff_lines_from_image(image_path):
    # Load the image
    image = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
    height, width = image.shape

    # Get staff lines
    staff_lines_thicknesses, staff_lines = get_staff_lines(width, height, image, threshold=0.15)

    # Remove staff lines
    image_without_staff_lines = remove_staff_lines(image, width, staff_lines, staff_lines_thicknesses)

    # Convert back to PIL Image
    image_without_staff_lines_pil = Image.fromarray(image_without_staff_lines)

    return image_without_staff_lines_pil

# Example usage
image_path = "C:/Users/cakec/Desktop/tabmagic/tab_boxes/hallelujah_page_1_page_1_bar_1.png"
image_without_staff_lines = remove_staff_lines_from_image(image_path)
image_without_staff_lines.show()  # Display the image without staff lines