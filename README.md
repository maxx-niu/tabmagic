# TabMagic

TabMagic is a companion web tool built using a React/Flask stack, designed to analyze and annotate guitar tablature to help beginner to intermediate guitar players better understand the music they're playing.

TabMagic's recoginition abilities are powered by PyTorch and a Faster R-CNN object detection backbone, fine-tuned on a custom annotated dataset of guitar tablature that can be found in this repo.

## Features

- Analyzes uploaded guitar tablature PDFs/PNGs
- Identifies chord progressions
- Determines the key of the piece
- Suggests alternative ways to play
- Supports standard 6-string guitar tabs

## How TabMagic Works

1. Upload a PDF or PNG snapshot of your guitar tabs
2. Let TabMagic process the information and provide detailed analysis!

## Getting Started

### Prerequisites

- Node.js
- Python 3.10
- CUDA enabled GPU

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Python Dependencies

To run and train the model, you'll need to set up a Python environment with the necessary dependencies:

1. Create a virtual environment, running Python 3.10:

   ```bash
   py -3.10 -m venv venv
   ```

2. Activate the virtual environment:

   - On Windows:
     ```bash
     venv\Scripts\activate
     ```
   - On macOS and Linux:
     ```bash
     source venv/bin/activate
     ```

3. Install the required Python packages:

   ```bash
   pip install -r requirements.txt
   ```

4. TabMagic uses a Python Library called pdf2image, which is itself a wrapper for a PDF renderer called Poppler. To setup this part, follow the instructions in [this repo](https://github.com/Belval/pdf2image). Note that you will need to complete this step if you wish to use TabMagic to analyze PDF tablature. Otherwise, continue.

### Model Training and Usage

To train and use the TabMagic model:

1. Unzip the data.zip folder, and extract the contents to a `data/` directory in your project folder.

2. Ensure the following structure:

   ```
   data/
   ├── features/
   └── labels/
   ```

3. Run the notebook `model.ipynb` to train the model. The training may take some time, depending on your system and whether or not you have a CUDA enabled GPU.

4. After training, the model will be saved in the `models` directory as `tabmagic_model.pth`.

5. The Flask server (`server.py`) will automatically load this model when processing requests.

### Running the Application

To start both the React frontend and Flask backend concurrently:

```
npm run start-dev
```

You can now interact with TabMagic on your browser.

## Credits

This project includes code from the [Orchestra](https://github.com/AbdallahHemdan/Orchestra) project by Abdallah Hemdan, which is licensed under the MIT License.
