# TabMagic

TabMagic is a companion tool designed to analyze and annotate guitar tablature, helping beginner to intermediate guitar players better understand the music they're playing.

## Features

- Analyzes uploaded guitar tablature PDFs/PNGs
- Identifies chord progressions
- Determines the key of the piece
- Suggests alternative ways to play
- Supports standard 6-string guitar tabs

## How It Works

1. Upload a PDF or PNG snapshot of your guitar tabs
2. Let TabMagic process the information and provide detailed analysis!

## Getting Started

### Prerequisites

- Node.js
- Python

### Recommmended

- CUDA enabled GPU

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Python Dependencies

To run and train the model, you'll need to set up a Python environment with the necessary dependencies:

1. Create a virtual environment:
   ```bash
   python -m venv venv
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

### Model Training and Usage

To train and use the TabMagic model:

1. Unzip the data.zip folder, and extract the contents to a `data/` directory in your project folder

2. Ensure the following structure:
   ```
   data/
   ├── features/
   └── labels/
   ```

3. Run the notebook `model.ipynb` to train the model (note that a CUDA enabled device is encouraged but not strictly required, as the model is device agnostic). This may take some time, be patient

4. After training, the model will be saved in the `models` directory as `tabmagic_model.pth`.

5. The Flask server (`server.py`) will automatically load this model when processing requests.

### Running the Application

To start both the React frontend and Flask backend concurrently:

```
npm run start-dev