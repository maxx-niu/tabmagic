import { useEffect, useState } from "react";

const useUploadBoxes = (path: string[], boxes: Array<number[]>) => {
  if (path.length !== boxes.length) {
    throw new Error("The length of path and boxes must be the same.");
  }
};

export default useUploadBoxes;
