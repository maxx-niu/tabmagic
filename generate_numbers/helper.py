import os
import shutil

def copy_number_images(source_base_dir, destination_base_dir):
    # Ensure the destination base directory exists
    if not os.path.exists(destination_base_dir):
        os.makedirs(destination_base_dir)

    # Iterate through directories 0-24
    for i in range(25):
        source_dir = os.path.join(source_base_dir, str(i))
        dest_dir = os.path.join(destination_base_dir, str(i))

        # Ensure the destination directory exists
        if not os.path.exists(dest_dir):
            os.makedirs(dest_dir)

        # Copy all files from source to destination
        for filename in os.listdir(source_dir):
            source_file = os.path.join(source_dir, filename)
            dest_file = os.path.join(dest_dir, filename)
            shutil.copy2(source_file, dest_file)

    print(f"Files copied from {source_base_dir} to {destination_base_dir}")

# Example usage:
source_base_dir = "./number_dataset"
destination_base_dir = "../data/features/numbers"
copy_number_images(source_base_dir, destination_base_dir)
