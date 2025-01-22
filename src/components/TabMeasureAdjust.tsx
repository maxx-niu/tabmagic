import { FC, useEffect, useState } from "react";
import BarBoundingBox from "./BarBoundingBox";
import { BoundingBox, TabDisplayProps } from "../types";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import useUploadBoxes from "../hooks/useUploadBoxes";
import "../styles/TabMeasureAdjust.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const TabMeasureAdjust: FC<TabDisplayProps> = ({
  tabImages,
  onUploadAgain,
}) => {
  const [boundingBoxes, setBoundingBoxes] = useState<BoundingBox[][]>([]); // state that holds the bounding boxes for each bar for all pages
  const [flashId, setFlashId] = useState<string | null>(null);
  const [availableHeight, setAvailableHeight] = useState(window.innerHeight);
  const [currentPage, setCurrentPage] = useState(0);
  const [noteBoxes, setNoteBoxes] = useState<any[]>([]);
  const navigate = useNavigate();

  const { uploadBoxes, loading, error, results } = useUploadBoxes();

  useEffect(() => {
    if (results) {
      setNoteBoxes(results);
      navigate("/visualizer", { state: { noteResults: results } });
    }
  }, [results, navigate]);

  const handleProcessBars = () => {
    const paths = tabImages.map((image) => image.image_path);
    uploadBoxes(paths, boundingBoxes);
  };

  const deleteBox = (id: string, pageIndex: number) => {
    setBoundingBoxes((prevBoxes) =>
      prevBoxes.map((boxes, idx) =>
        idx === pageIndex ? boxes.filter((box) => box.id !== id) : boxes
      )
    );
  };

  const addBox = (newBox: number[], pageNumber: number) => {
    const newId = uuidv4();
    setBoundingBoxes((prevBoxes) =>
      prevBoxes.map((box, index) =>
        index === pageNumber
          ? [
              ...box,
              {
                id: newId,
                x1: newBox[0],
                y1: newBox[1],
                x2: newBox[2],
                y2: newBox[3],
              },
            ]
          : box
      )
    );
    setFlashId(newId);
    setTimeout(() => setFlashId(null), 500);
  };

  const updateBox = (
    updatedBox: number[],
    boxId: string,
    pageIndex: number
  ) => {
    const [x1, y1, x2, y2] = updatedBox;

    setBoundingBoxes((prevBoxes) =>
      prevBoxes.map((boxes, idx) =>
        idx === pageIndex
          ? boxes.map((box) =>
              box.id === boxId ? { ...box, x1, y1, x2, y2 } : box
            )
          : boxes
      )
    );
  };

  const handleResize = () => {
    setAvailableHeight(window.innerHeight);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const extractedBoundingBoxes: BoundingBox[][] = tabImages.map((image) =>
      image.bounding_boxes.flat().map((bb) => ({
        id: bb.box.id,
        x1: bb.box.x1,
        y1: bb.box.y1,
        x2: bb.box.x2,
        y2: bb.box.y2,
      }))
    );
    setBoundingBoxes(extractedBoundingBoxes);
    console.log(extractedBoundingBoxes);
  }, [tabImages]);

  const handleNextPage = () => {
    if (currentPage < tabImages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const maxHeight = availableHeight * 0.8;
  const scaleFactor = Math.min(
    1,
    maxHeight / tabImages[currentPage].image_height
  );
  console.log(scaleFactor);

  return (
    <>
      <div className="tab-measure-adjust-container">
        <h2 style={{ marginTop: 0 }}>Detected bounding boxes for each bar</h2>
        <p style={{ margin: 0 }}>
          Adjust and add bounding boxes to ensure each bar is properly
          encapsulated
        </p>
        <div className="tab-measure-adjust">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 0}
            className={`page-nav-button ${currentPage === 0 ? "disable-page-nav" : ""}`}
          >
            <i className="bi bi-chevron-double-left"></i>
          </button>
          <div
            key={currentPage}
            style={{
              backgroundImage: `url('http://localhost:5000${tabImages[currentPage].image_path}')`,
              backgroundSize: "contain",
              backgroundPosition: "center",
              width: tabImages[currentPage].image_width * scaleFactor,
              height: tabImages[currentPage].image_height * scaleFactor,
              position: "relative",
              border: "1px solid black",
            }}
          >
            <button
              onClick={() =>
                addBox(
                  [
                    tabImages[currentPage].image_width - 200,
                    0,
                    tabImages[currentPage].image_width,
                    200,
                  ],
                  currentPage
                )
              }
            >
              Add a bounding box
            </button>
            {boundingBoxes[currentPage]?.map((bb) => {
              const scaledBox = [bb.x1, bb.y1, bb.x2, bb.y2].map(
                (value) => value * scaleFactor
              );
              return (
                <BarBoundingBox
                  key={bb.id}
                  box={scaledBox}
                  onDelete={() => deleteBox(bb.id, currentPage)}
                  imageHeight={
                    tabImages[currentPage].image_height * scaleFactor
                  }
                  imageWidth={tabImages[currentPage].image_width * scaleFactor}
                  flash={bb.id === flashId}
                  onUpdate={(newBox) => updateBox(newBox, bb.id, currentPage)}
                  scaleFactor={scaleFactor}
                />
              );
            })}
          </div>
          <button
            onClick={handleNextPage}
            disabled={currentPage === tabImages.length - 1}
            className={`page-nav-button ${currentPage === tabImages.length - 1 ? "disable-page-nav" : ""}`}
          >
            <i className="bi bi-chevron-double-right"></i>
          </button>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            marginTop: "20px",
          }}
        >
          <button
            onClick={() => onUploadAgain()}
            style={{
              backgroundColor: "gray",
              color: "white",
              border: "none",
              borderRadius: "10px",
              padding: "10px 20px",
              cursor: "pointer",
            }}
          >
            Upload another tab
          </button>
          <button
            // finish this button
            onClick={handleProcessBars}
            style={{
              backgroundColor: "green",
              color: "white",
              border: "none",
              borderRadius: "10px",
              padding: "10px 20px",
              cursor: "pointer",
            }}
          >
            Process shown bars
          </button>
        </div>
      </div>
    </>
  );
};

export default TabMeasureAdjust;
