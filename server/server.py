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

TEMP_UPLOAD_FOLDER = './temp_uploads'
IMAGE_FOLDER = './images'
os.makedirs(TEMP_UPLOAD_FOLDER, exist_ok=True)
os.makedirs(IMAGE_FOLDER, exist_ok=True)

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
    return send_from_directory('../images', filename)

@app.route('/tab_boxes/<filename>')
def get_tab_box(filename):
    return send_from_directory('../tab_boxes', filename)

@app.route('/process', methods=['POST'])
def predict():
    model = load_model('./models/tabmagic_model.pth')
    results = []
    clear_directory("./tab_boxes")

    for image_path in os.listdir(IMAGE_FOLDER): # for each page in the guitar tab
        full_path = os.path.join(IMAGE_FOLDER, image_path)
        image = Image.open(full_path)
        bounding_boxes = compute_bounding_boxes(model, image, label_map={1: "bar"})
        bbs_sorted = sort_bar_bounding_boxes(bounding_boxes)
        save_bar_bb_to_image(bbs_sorted, full_path) # save the images of the bars to the tab_boxes dir
        res = {
            'image_path': f'/images/{image_path}',
            'bounding_boxes': bbs_sorted,
            'image_name': image_path
        }
        # TODO next: go through each bar image in bbs_sorted (by accessing the filename from bounding_boxes)
        # and run the bar_model detection on it, to extract the string and identify fret numbers
        bar_model = load_model('./models/tabmagic_model_bars.pth', num_classes=3)
        for row in res['bounding_boxes']:
            for bb in row:
                bar_file_name = bb['filename']
                bar_file_path = os.path.join('./tab_boxes', bar_file_name)
                bar_image = Image.open(bar_file_path)
                string_fret_bounding_boxes = compute_bounding_boxes(bar_model, bar_image, width=512, height=256, label_map={
                    1: "string",
                    2: "number"
                })
                print("here ya go:\n",string_fret_bounding_boxes)

        results.append(res)
             
    #get_frets()
    return jsonify(results)

# @app.route('/get_frets')
def get_frets():
    # first, identify the strings and fret numbers
    bar_model = load_model('./models/tabmagic_model_bars.pth', num_classes=3)
    #fret_num_model = load_model('./models/number_model.pth')  # Load the fret number model
    bar_results = []
    for image in os.listdir('./tab_boxes'):
        full_path = os.path.join('./tab_boxes', image)
        image = Image.open(full_path)
        bounding_boxes = compute_bounding_boxes(bar_model, image, width=512, height=256)
        bar_results.append(bounding_boxes)

    print("hello\n")    
    print(bar_results)

# mini flask tutorial:
# @app.route("/members") # setup URL endpoints with the @app.route() decorator
# def members(): # what the function does for this route
#     return {"members": ["1", "2", "3", "buckle my shoe"]}

if __name__ == "__main__":
    app.run(debug=True) # debug=True makes it so that errors will popup on the webpage

# Steps cont'd:
# 5. execute the server code (python server.py)