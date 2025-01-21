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
from getNumbers import getNoteBoundingBoxes
from serverutils import clear_directory
from lineExtraction import detect_staff_lines

app = Flask(__name__) # this rferences this server.py file
cors = CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}) # makes it so that server accepts all requests

TEMP_UPLOAD_FOLDER = './temp_uploads'
IMAGE_FOLDER = './images'
TAB_BOXES_FOLDER = './tab_boxes'
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
        image_path = os.path.join(IMAGE_FOLDER, f'{os.path.splitext(file.filename)[0]}_page_1.png')
        file.save(image_path)
        image_paths = [image_path]

    else:
        # Unsupported file type
        return jsonify({'error': 'Unsupported file type. Please upload a PDF or image file.'}), 400

    return jsonify({'image_paths': image_paths})

@app.route('/images/<filename>')
def get_image(filename):
    return send_from_directory(os.path.abspath(IMAGE_FOLDER), filename)

@app.route('/tab_boxes/<filename>')
def get_tab_box(filename):
    return send_from_directory(os.path.abspath(TAB_BOXES_FOLDER), filename)

@app.route('/process-boxes', methods=['POST'])
def process_boxes():
    data = request.get_json().get('data', [])
    for item in data:
        image_path = item.get('image_path')
        image_name = os.path.basename(image_path)
        full_path = os.path.abspath(os.path.join(IMAGE_FOLDER, image_name))
        print(full_path)
        bounding_boxes = item.get('bounding_boxes')
        bbs_sorted = sort_bar_bounding_boxes(bounding_boxes)
        print(bbs_sorted)
        save_bar_bb_to_image(bbs_sorted, full_path, u=5, d=5) # save the images of the bars to the tab_boxes dir
    note_boxes = getNoteBoundingBoxes()
    return jsonify(note_boxes), 200
    

@app.route('/process', methods=['POST'])
def predict():
    model = load_model('./models/tabmagic_model.pth')
    results = []
    clear_directory(TAB_BOXES_FOLDER)

    for image_path in os.listdir(IMAGE_FOLDER): # for each page in the guitar tab
        full_path = os.path.abspath(os.path.join(IMAGE_FOLDER, image_path))
        print("image path:", image_path)
        print(f"full image path: {full_path}")
        image = Image.open(full_path)
        bounding_boxes = compute_bounding_boxes(model, image, label_map={1: "bar"})
        bbs_sorted = sort_bar_bounding_boxes(bounding_boxes)
        # save_bar_bb_to_image(bbs_sorted, full_path, u=5, d=5) # save the images of the bars to the tab_boxes dir
        res = {
            'image_path': f'/images/{image_path}',
            'bounding_boxes': bbs_sorted,
            'image_name': image_path,
            'image_width': image.width,
            'image_height': image.height
        }
        # (can probably ignore this for now, left in here just in case)
        # TODO next: go through each bar image in bbs_sorted (by accessing the filename from bounding_boxes)
        # and run the bar_model detection on it, to extract the string and identify fret numbers
        # bar_model = load_model('./models/tabmagic_model_bars.pth', num_classes=2)
        # for row in res['bounding_boxes']:
        #     for bb in row:
        #         bar_file_name = bb['filename']
        #         bar_file_path = os.path.abspath(os.path.join(TAB_BOXES_FOLDER, bar_file_name))
        #         bar_image = Image.open(bar_file_path)
        #         # print(f"full bar image path: {bar_file_path}")
        #         staff_lines, staff_line_thicknesses = detect_staff_lines(bar_file_path)
        #         # print(f"filename: {bar_file_path}, (h,w): {bar_image.height}, {bar_image.width}")
        #         fret_bounding_boxes = compute_bounding_boxes(bar_model, bar_image, width=512, height=256, label_map={1: "number"})
        #         bb['numbers'] = fret_bounding_boxes
        #         staff_line_info = list(zip(staff_lines, staff_line_thicknesses))
        #         bb['staff_line_info'] = staff_line_info

        results.append(res)
             
    #get_frets()
    return jsonify(results)

# mini flask tutorial:
@app.route("/members") # setup URL endpoints with the @app.route() decorator
def members(): # what the function does for this route
    return {"members": ["1", "2", "3", "buckle my shoe"]}

if __name__ == "__main__":
    app.run(debug=True) # debug=True makes it so that errors will popup on the webpage

# Steps cont'd:
# 5. execute the server code (python server.py)