export type UploadErrorBoxProps = {
    isOpen: boolean,
    error: {
        code: string,
        message: string
    },
    onClose: () => void
};

export type tabImage = {
    bounding_boxes: Array<Array<{
        score: number;
        box: number[];
        label: string;
        filename: string;
        fret_strings: FretStringBox[]
    }>>;
    image_path: string;
    image_name: string
};

type FretStringBox = {
    box: number[],
    score: number,
    label: string
}

export type UploadSuccessfulBoxProps = {
    isOpen: boolean,
    onCancel: () => void,
    setProcessedImages: React.Dispatch<React.SetStateAction<tabImage[]>>
};