import cv2
from matplotlib import pyplot as plt
import numpy as np

def detect_staff_lines(image_path, threshold=0.7):
    # Read the image in grayscale
    in_img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
    binarized_image = cv2.adaptiveThreshold(
        in_img, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 41, 10
    )

    # plt.subplot(1, 2, 2)
    # plt.title('Binarized Image')
    # plt.imshow(binarized_image, cmap='gray')
    # plt.axis('off')

    # plt.show()

    
    # Get image dimensions
    height, width = binarized_image.shape
    
    # Initialize row histogram
    row_histogram = [0] * height
    
    # Calculate histogram for rows
    for r in range(height):
        for c in range(width):
            if binarized_image[r][c] == 0:  # Assuming black pixels are 0
                row_histogram[r] += 1
    
    # Identify initial lines based on the threshold
    initial_lines = [row for row in range(len(row_histogram)) if row_histogram[row] >= (width * threshold)]
    
    # Determine staff lines and their thicknesses
    staff_lines = []
    staff_lines_thicknesses = []
    cur_thickness = 1
    it = 0
    
    while it < len(initial_lines):
        if cur_thickness == 1:
            staff_lines.append(initial_lines[it])
        
        if it == len(initial_lines) - 1:
            staff_lines_thicknesses.append(cur_thickness)
        elif initial_lines[it] + 1 == initial_lines[it + 1]:
            cur_thickness += 1
        else:
            staff_lines_thicknesses.append(cur_thickness)
            cur_thickness = 1
        
        it += 1
    # print(staff_lines)
    # print(staff_lines_thicknesses)
    return staff_lines, staff_lines_thicknesses

# # Example usage
# image_path = 'C:/Users/cakec/Desktop/tabmagic/tab_boxes/6_bar_1.png'
# staffLines, thicknesses = detect_staff_lines(image_path)
