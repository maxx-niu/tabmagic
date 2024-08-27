export type UploadErrorBoxProps = {
    isOpen: boolean,
    error: {
        code: string,
        message: string
    },
    onClose: () => void
};

export type ProcessedImage = {
    bounding_boxes: Array<{
        coordinates: number[],
        score: number
    }>;
    image_path: string;
};

export type UploadSuccessfulBoxProps = {
    isOpen: boolean,
    onCancel: () => void,
    setProcessedImages: React.Dispatch<React.SetStateAction<ProcessedImage[]>>
};