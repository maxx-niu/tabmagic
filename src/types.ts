export type UploadErrorBoxProps = {
    isOpen: boolean,
    error: {
        code: string,
        message: string
    },
    onClose: () => void
};

export type ProcessedImage = {
    bounding_boxes: Array<Array<{
        score: number;
        box: number[];
    }>>;
    image_path: string;
};

export type UploadSuccessfulBoxProps = {
    isOpen: boolean,
    onCancel: () => void,
    setProcessedImages: React.Dispatch<React.SetStateAction<ProcessedImage[]>>
};