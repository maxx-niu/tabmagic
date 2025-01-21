import { useEffect, useState } from "react";
import { BoundingBox } from "../types";

interface Payload {
  image_path: string;
  bounding_boxes: {
    box: BoundingBox;
  }[];
}

const useUploadBoxes = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<any>(null);

  const uploadBoxes = async (paths: string[], boxes: BoundingBox[][]) => {
    if (paths.length !== boxes.length) {
      throw new Error("The length of path and boxes must be the same.");
    }

    const payload: Payload[] = paths.map((path, idx) => ({
      image_path: path,
      bounding_boxes: boxes[idx].map((box) => ({ box })),
    }));

    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/process-boxes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: payload }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to upload bounding boxes.");
      }

      const data = await res.json();
      setResults(data);
      return data;
    } catch (error: any) {
      setError(error.message || "An unexpected error occurred.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { uploadBoxes, loading, error, results };
};

export default useUploadBoxes;
