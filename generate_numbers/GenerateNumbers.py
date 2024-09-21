import os
import random
from PIL import Image, ImageDraw, ImageFont

# Directory to store dataset
output_dir = "number_dataset"
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

# Define the numbers 0 to 24
numbers = list(range(25))

# Font settings (Fixed font size for fitting in 60x60 images)
fixed_font_size = 40
# Add more font files for variety if desired
font_paths = [
    "C:/Users/cakec/Desktop/tabmagic/generate_numbers/fonts/Caveat/Caveat-VariableFont_wght.ttf",  # example font path
    "C:/Users/cakec/Desktop/tabmagic/generate_numbers/fonts/Libre_Baskerville/LibreBaskerville-Italic.ttf",
    "C:/Users/cakec/Desktop/tabmagic/generate_numbers/fonts/Libre_Baskerville/LibreBaskerville-Bold.ttf",
    "C:/Users/cakec/Desktop/tabmagic/generate_numbers/fonts/Libre_Baskerville/LibreBaskerville-Regular.ttf",
    "C:/Users/cakec/Desktop/tabmagic/generate_numbers/fonts/Noto_Serif_Old_Uyghur/Noto_Serif_Old_Uyghur/NotoSerifOldUyghur-Regular.ttf",
    "C:/Users/cakec/Desktop/tabmagic/generate_numbers/fonts/Oswald/static/Oswald-Bold.ttf",
    "C:/Users/cakec/Desktop/tabmagic/generate_numbers/fonts/Oswald/static/Oswald-ExtraLight.ttf",
    "C:/Users/cakec/Desktop/tabmagic/generate_numbers/fonts/Oswald/static/Oswald-Light.ttf",
    "C:/Users/cakec/Desktop/tabmagic/generate_numbers/fonts/Oswald/static/Oswald-Medium.ttf",
    "C:/Users/cakec/Desktop/tabmagic/generate_numbers/fonts/Oswald/static/Oswald-Regular.ttf",
    "C:/Users/cakec/Desktop/tabmagic/generate_numbers/fonts/Oswald/static/Oswald-SemiBold.ttf",
    "C:/Users/cakec/Desktop/tabmagic/generate_numbers/fonts/Pacifico/Pacifico-Regular.ttf",
    "C:/Users/cakec/Desktop/tabmagic/generate_numbers/fonts/Permanent_Marker/PermanentMarker-Regular.ttf",
    "C:/Users/cakec/Desktop/tabmagic/generate_numbers/fonts/Schibsted_Grotesk/static/SchibstedGrotesk-Black.ttf",
    "C:/Users/cakec/Desktop/tabmagic/generate_numbers/fonts/Schibsted_Grotesk/static/SchibstedGrotesk-BlackItalic.ttf",
    "C:/Users/cakec/Desktop/tabmagic/generate_numbers/fonts/Schibsted_Grotesk/static/SchibstedGrotesk-Bold.ttf",
    "C:/Users/cakec/Desktop/tabmagic/generate_numbers/fonts/Schibsted_Grotesk/static/SchibstedGrotesk-BoldItalic.ttf",
    "C:/Users/cakec/Desktop/tabmagic/generate_numbers/fonts/Schibsted_Grotesk/static/SchibstedGrotesk-ExtraBold.ttf",
    "C:/Users/cakec/Desktop/tabmagic/generate_numbers/fonts/Schibsted_Grotesk/static/SchibstedGrotesk-ExtraBoldItalic.ttf",
    "C:/Users/cakec/Desktop/tabmagic/generate_numbers/fonts/Schibsted_Grotesk/static/SchibstedGrotesk-Italic.ttf",
    "C:/Users/cakec/Desktop/tabmagic/generate_numbers/fonts/Schibsted_Grotesk/static/SchibstedGrotesk-Medium.ttf",
    "C:/Users/cakec/Desktop/tabmagic/generate_numbers/fonts/Schibsted_Grotesk/static/SchibstedGrotesk-MediumItalic.ttf",
    "C:/Users/cakec/Desktop/tabmagic/generate_numbers/fonts/Schibsted_Grotesk/static/SchibstedGrotesk-Regular.ttf",
    "C:/Users/cakec/Desktop/tabmagic/generate_numbers/fonts/Schibsted_Grotesk/static/SchibstedGrotesk-SemiBold.ttf",
    "C:/Users/cakec/Desktop/tabmagic/generate_numbers/fonts/Schibsted_Grotesk/static/SchibstedGrotesk-SemiBoldItalic.ttf",
]

# Image size
image_size = (60, 60)
fixed_font_size = 40
num_images_per_class = 25

# Function to generate images
def generate_number_images():
    for number in numbers:
        number_dir = os.path.join(output_dir, str(number))
        if not os.path.exists(number_dir):
            os.makedirs(number_dir)
        
        for i in range(num_images_per_class):
            # Create a blank image with a white background
            img = Image.new('RGB', image_size, color='white')
            draw = ImageDraw.Draw(img)

            # Select a random font from Google Fonts directory
            font_path = random.choice(font_paths)
            font = ImageFont.truetype(font_path, fixed_font_size)

            # Random text color for variety
            text_color = "black"
            
            # Define the text to draw
            text = str(number)
            
            # Get the bounding box of the text (instead of textsize)
            bbox = draw.textbbox((0, 0), text, font=font)
            text_width, text_height = bbox[2] - bbox[0], bbox[3] - bbox[1]
            
            # Center the text on the image
            position = ((image_size[0] - text_width) // 2, (image_size[1] - text_height) // 2)

            # Draw the number on the image
            draw.text(position, text, font=font, fill=text_color)

            # Save the image in the corresponding directory
            img_path = os.path.join(number_dir, f"{number}_{i + 1}.png")
            img.save(img_path)

if __name__ == "__main__":
    if not font_paths:
        print("No fonts found in the specified font directory.")
    else:
        generate_number_images()
        print(f"Dataset generated at: {output_dir}")