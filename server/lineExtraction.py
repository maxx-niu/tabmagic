import cv2
from staff_removal import get_staff_lines, remove_staff_lines
import matplotlib.pyplot as plt
import numpy as np

def preprocess_img(img_path):
    # 1. Read desired image #
    img = cv2.imread(img_path, 0)
    
    # 2. Remove noise (odd pixels) from the image and save it #
    img = cv2.fastNlMeansDenoising(img, None, 10, 7, 21)

    # 3. Binarize image using combination of (global + otsu) thresholding and save it #
    threshold, img = cv2.threshold(img, 0, 255, cv2.THRESH_BINARY+cv2.THRESH_OTSU)

    # 4. Return image shape (width, height) and processed image # 
    n, m = img.shape
    return n, m, img

def remove_staff_from_image(image_path, output_file_path):
    """
    removes the staff lines from the image of a measure specified in image_path, and saves it
    to the file output_file_path. returns the vertical positions of each removed staff line
    """
    height, width, in_img = preprocess_img(image_path)
    threshold = 0.8
    staff_lines_thicknesses, staff_lines = get_staff_lines(width, height, in_img, threshold)
    cleaned_img = remove_staff_lines(in_img, width, staff_lines, staff_lines_thicknesses)
    if cleaned_img.dtype != np.uint8:
        cleaned_img = (cleaned_img * 255).astype(np.uint8)
    success = cv2.imwrite(output_file_path, cleaned_img)
    if not success:
        raise IOError(f"Failed to save the image to {output_file_path}. Please check the path and permissions.")
    return staff_lines
    
    # Display the cleaned image
    # plt.imshow(cleaned_img, cmap='gray')
    # plt.title('Image without Staff Lines')
    # plt.axis('off')
    # plt.show()

# # Example usage
# image_path = 'C:/Users/cakec/Desktop/tabmagic/tab_boxes/3_bar_1.png'
# remove_staff_from_image(image_path)
