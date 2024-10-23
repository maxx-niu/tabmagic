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
        // filename: string;
        // numbers: FretStringBox[];
        // staff_line_info: StaffLineInfo[]
    }>>;
    image_path: string;
    image_name: string;
    image_width: number;
    image_height: number;
};

// type FretStringBox = {
//     box: number[],
//     score: number,
//     label: string
// }

// staff_position, staff_line_thickness
// type StaffLineInfo = [number, number];

export type UploadSuccessfulBoxProps = {
    isOpen: boolean,
    onCancel: () => void,
    setProcessedImages: React.Dispatch<React.SetStateAction<tabImage[]>>
};

export type TabDisplayProps = {
    tabImages: tabImage[];
    onUploadAgain: () => void;
}