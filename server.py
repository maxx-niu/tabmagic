# Steps: 
# 1. create a new venv (virtualenv venv)
# 2. activate the venv (source venv/Scripts/activate)
# 3. install flask on venv (pip install flask)
# 4. write app code

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from pdf2image import convert_from_path
import os
from PIL import Image
from getTabBboxes import load_model, compute_bounding_boxes, save_bar_bb_to_image, sort_bar_bounding_boxes
from serverutils import clear_directory

app = Flask(__name__) # this rferences this server.py file
cors = CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}) # makes it so that server accepts all requests

TEMP_UPLOAD_FOLDER = 'temp_uploads'
IMAGE_FOLDER = 'images'
os.makedirs(TEMP_UPLOAD_FOLDER, exist_ok=True)
os.makedirs(IMAGE_FOLDER, exist_ok=True)

model = load_model('./models/tabmagic_model.pth')

@app.route('/upload', methods=['POST'])
def upload_file():
    file = request.files['file'] # Accesses the uploaded file from the request
    filename = file.filename
    file_extension = os.path.splitext(filename)[1].lower()

    # Clear the image folder before saving new files
    clear_directory(IMAGE_FOLDER)

    if file_extension == '.pdf':
        
        file_path = os.path.join(TEMP_UPLOAD_FOLDER, filename)
        file.save(file_path)

        # Convert PDF to images
        images = convert_from_path(file_path)
        image_paths = []
        for i, image in enumerate(images):
            image_path = os.path.join(IMAGE_FOLDER, f'{os.path.splitext(file.filename)[0]}_page_{i + 1}.png')
            image.save(image_path, 'PNG')
            image_paths.append(image_path)
        # Clear the temp folder after processing
        clear_directory(TEMP_UPLOAD_FOLDER)

    elif file_extension in ['.png', '.jpg', '.jpeg']:
        print("uploaded file was an image")
        image_path = os.path.join(IMAGE_FOLDER, filename)
        file.save(image_path)
        image_paths = [image_path]

    else:
        # Unsupported file type
        return jsonify({'error': 'Unsupported file type. Please upload a PDF or image file.'}), 400

    return jsonify({'image_paths': image_paths})

@app.route('/images/<filename>')
def get_image(filename):
    return send_from_directory(IMAGE_FOLDER, filename)


@app.route('/process', methods=['POST'])
def predict():
    print("hello")
    model = load_model('models/tabmagic_model.pth')  # Make sure to replace with your actual model path
    results = []
    clear_directory("tab_boxes")

    for image_path in os.listdir(IMAGE_FOLDER):
        if image_path.lower().endswith(('.png', '.jpg', '.jpeg')):
            full_path = os.path.join(IMAGE_FOLDER, image_path)
            image = Image.open(full_path)
            bounding_boxes = compute_bounding_boxes(model, image)
            bbs_row = sort_bar_bounding_boxes(bounding_boxes)
            sort_bar_bounding_boxes(bounding_boxes)
            save_bar_bb_to_image(bounding_boxes, full_path) # the bounding boxes for each bar should be sorted first
            results.append({
                'image_path': f'/images/{image_path}',
                'bounding_boxes': bbs_row
            })

    return jsonify(results)

# mini flask tutorial:
# @app.route("/members") # setup URL endpoints with the @app.route() decorator
# def members(): # what the function does for this route
#     return {"members": ["1", "2", "3", "buckle my shoe"]}

if __name__ == "__main__":
    app.run(debug=True) # debug=True makes it so that errors will popup on the webpage

# Steps cont'd:
# 5. execute the server code (python server.py)