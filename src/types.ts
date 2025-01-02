export type UploadErrorBoxProps = {
  isOpen: boolean;
  error: {
    code: string;
    message: string;
  };
  onClose: () => void;
};

export type BoundingBox = {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

export type TabImage = {
  bounding_boxes: Array<
    Array<{
      score: number;
      box: BoundingBox;
      label: string;
      // filename: string;
      // numbers: FretStringBox[];
      // staff_line_info: StaffLineInfo[]
    }>
  >;
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
  isOpen: boolean;
  onCancel: () => void;
  setProcessedImages: React.Dispatch<React.SetStateAction<TabImage[]>>;
};

export type TabDisplayProps = {
  tabImages: TabImage[];
  onUploadAgain: () => void;
};
