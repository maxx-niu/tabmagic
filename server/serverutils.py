import os
import shutil

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