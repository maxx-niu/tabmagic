import React, { FC } from "react";
import { UploadErrorBoxProps } from "../types";

const UploadErrorBox: FC<UploadErrorBoxProps> = ({ isOpen, error, onClose }) => {
  if (!isOpen) return null;

  console.log(error);

  return (
    <div>
      <p>Error uploading: {error["message"]}</p>
      <button onClick={onClose}>Ok</button>
    </div>
  );
};

export default UploadErrorBox;
