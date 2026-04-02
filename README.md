# TabMagic

TabMagic is a companion web tool built using a React/Flask stack, designed to analyze and annotate guitar tablature to help beginner to intermediate guitar players better understand the music they're playing.

TabMagic's recoginition abilities are powered by PyTorch and a Faster R-CNN object detection backbone, fine-tuned on a custom annotated dataset of guitar tablature that can be found in this repo.

## Features

- Analyzes uploaded guitar tablature PDFs/PNGs
- Identifies chord progressions
- Determines the key of the piece
- Supports standard 6-string guitar tabs

## How TabMagic Works

1. Upload a PDF or PNG snapshot of your guitar tabs
2. Let TabMagic process the information and provide detailed analysis!

## Getting Started

### Prerequisites

- Node.js
- Python 3.10
- CUDA enabled GPU (highly recommended)

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

   or if you're on a Mac:

   ```bash
   python3.10 -m venv venv
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

   - On Windows:
     ```bash
     pip install -r requirements.txt
     ```
   - On macOS and Linux:
     ```bash
      pip install flask flask-cors pillow opencv-python numpy pandas matplotlib scikit-learn
      pip install torch torchvision  # CPU version (macOS doesn't support CUDA)
      pip install pdf2image
     ```

4. TabMagic uses a Python Library called pdf2image, which is itself a wrapper for a PDF renderer called Poppler. To setup this part, follow the instructions in [this repo](https://github.com/Belval/pdf2image). Note that you will need to complete this step if you wish to use TabMagic to analyze PDF tablature. Otherwise, continue.

### Model Setup

#### Option 1: Use the pre-trained model (recommended)

Download the pre-trained models from the [latest release](https://github.com/maxx-niu/tabmagic/releases/latest) and place them in the `models/` directory:

```bash
mkdir -p models
curl -L https://github.com/maxx-niu/tabmagic/releases/download/v1.1.0/tabmagic_model.pth -o models/tabmagic_model.pth
curl -L https://github.com/maxx-niu/tabmagic/releases/download/v1.1.0/tabmagic_model_bars.pth -o models/tabmagic_model_bars.pth
```

#### Option 2: Train the model yourself

1. Unzip the data.zip folder, and extract the contents to a `data/` directory in your project folder.

```bash
unzip data.zip -d .
```

2. Ensure the following structure:

   ```
   data/
   ├── features/
   └── labels/
   ```

3. Run both training notebooks. The training may take some time, depending on your system and whether or not you have a CUDA enabled GPU.

```bash
pip install jupyter
jupyter notebook model.ipynb        # trains bar detection model
jupyter notebook model_bars.ipynb   # trains fret number detection model
```

Then run all cells top to bottom in each notebook `(Cell → Run All).`

4. After training, both models will be saved in the `models/` directory:

   - `models/tabmagic_model.pth` — detects bars in a full tab image
   - `models/tabmagic_model_bars.pth` — detects fret numbers within each bar

5. The Flask server (`server.py`) will automatically load these models when processing requests.

### Running the Application

To start both the React frontend and Flask backend concurrently:

```
npm run start-dev
```

You can now interact with TabMagic on your browser.

## Credits

This project includes code from the [Orchestra](https://github.com/AbdallahHemdan/Orchestra) project by Abdallah Hemdan, which is licensed under the MIT License.
