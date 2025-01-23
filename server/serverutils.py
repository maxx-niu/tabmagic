import os
import shutil

# computes the notes being played within a bar
def compute_notes(bar_notes_boxes, staff_line_positions):
    # Sort the bounding boxes by their x-coordinates (left to right)
    bar_notes_boxes.sort(key=lambda box: box['x1'])

    # Function to check if two bounding boxes overlap vertically
    def is_vertically_aligned(box1, box2, tolerance=5):
        # Check if the x-ranges of the boxes are close enough to be aligned
        return abs(box1['x1'] - box2['x1']) <= tolerance or abs(box1['x2'] - box2['x2']) <= tolerance

    # Function to determine the string a note is on
    def get_string_for_note(box, staff_line_positions):
        for string, y in staff_line_positions.items():
            if box['y1'] <= y <= box['y2']:
                return string
        return None

    # Group notes that are played simultaneously (vertically aligned)
    simultaneous_notes = []
    visited = [False] * len(bar_notes_boxes)

    def dfs(index, group):
        visited[index] = True
        group.append(bar_notes_boxes[index])
        for i, box in enumerate(bar_notes_boxes):
            if not visited[i] and is_vertically_aligned(bar_notes_boxes[index], box):
                dfs(i, group)

    for i, box in enumerate(bar_notes_boxes):
        if not visited[i]:
            group = []
            dfs(i, group)
            # Assign strings to notes in the group
            for note_box in group:
                note_string = get_string_for_note(note_box, staff_line_positions)
                note_box['string'] = note_string
            simultaneous_notes.append(group)

    return simultaneous_notes


def clear_directory(directory):
    """
    Remove all files and subdirectories from the specified directory.
    If the directory doesn't exist, it will be created.
    """
    # Check if the directory exists
    if os.path.exists(directory):
        # Remove all contents
        for filename in os.listdir(directory):
            file_path = os.path.join(directory, filename)
            try:
                if os.path.isfile(file_path) or os.path.islink(file_path):
                    os.unlink(file_path)
                elif os.path.isdir(file_path):
                    shutil.rmtree(file_path)
            except Exception as e:
                print(f'Failed to delete {file_path}. Reason: {e}')
    else:
        # Create the directory if it doesn't exist
        try:
            os.makedirs(directory)
            print(f"Directory \"{directory}\" created.")
        except Exception as e:
            print(f"Failed to create directory \"{directory}\". Reason: {e}")