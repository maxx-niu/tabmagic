import { FC, useState, useEffect } from "react";
import { Rnd } from "react-rnd";
import "../styles/BarBoundingBoxes.css";

type BoundingBoxProps = {
  box: number[];
  imageWidth: number;
  imageHeight: number;
  onDelete: () => void;
  flash?: boolean;
  onUpdate: (newBox: number[]) => void;
  scaleFactor: number;
};

const BarBoundingBox: FC<BoundingBoxProps> = ({
  box,
  imageWidth,
  imageHeight,
  onDelete,
  flash,
  onUpdate,
  scaleFactor,
}) => {
  const [boxState, setBoxState] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
    resizeDirection: string | null;
  }>({
    left: (box[0] / imageWidth) * 100,
    top: (box[1] / imageHeight) * 100,
    width: ((box[2] - box[0]) / imageWidth) * 100,
    height: ((box[3] - box[1]) / imageHeight) * 100,
    resizeDirection: null,
  });

  useEffect(() => {
    if (flash) {
      const timer = setTimeout(() => {
        setBoxState((prev) => ({ ...prev, resizeDirection: null }));
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [flash]);

  return (
    <Rnd
      className={flash ? "flash" : ""}
      style={{
        border: "solid 2px green",
      }}
      size={{
        width: `${boxState.width}%`,
        height: `${boxState.height}%`,
      }}
      position={{
        x: (boxState.left / 100) * imageWidth,
        y: (boxState.top / 100) * imageHeight,
      }}
      bounds="parent"
      enableResizing={{
        top: true,
        right: true,
        bottom: true,
        left: true,
        topRight: true,
        bottomRight: true,
        bottomLeft: true,
        topLeft: true,
      }}
      onDragStop={(e, d) => {
        const newLeft = (d.x / imageWidth) * 100;
        const newTop = (d.y / imageHeight) * 100;
        setBoxState((prev) => ({
          ...prev,
          left: newLeft,
          top: newTop,
        }));
        // Convert back to original scale
        const x1 = (newLeft / 100) * imageWidth;
        const y1 = (newTop / 100) * imageHeight;
        const x2 = x1 + (boxState.width / 100) * imageWidth;
        const y2 = y1 + (boxState.height / 100) * imageHeight;
        const newBox = [x1, y1, x2, y2].map((num) => (1 / scaleFactor) * num);
        console.log(newBox);
        onUpdate(newBox);
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        const newWidth = (ref.offsetWidth / imageWidth) * 100;
        const newHeight = (ref.offsetHeight / imageHeight) * 100;
        const newLeft = (position.x / imageWidth) * 100;
        const newTop = (position.y / imageHeight) * 100;
        setBoxState((prev) => ({
          ...prev,
          width: newWidth,
          height: newHeight,
          left: newLeft,
          top: newTop,
          resizeDirection: direction,
        }));

        // Convert back to original scale
        const x1 = (newLeft / 100) * imageWidth;
        const y1 = (newTop / 100) * imageHeight;
        const x2 = x1 + (newWidth / 100) * imageWidth;
        const y2 = y1 + (newHeight / 100) * imageHeight;
        const newBox = [x1, y1, x2, y2].map((num) => (1 / scaleFactor) * num);
        onUpdate(newBox);
      }}
    >
      <button
        onClick={onDelete}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          background: "transparent",
          border: "none",
          color: "rgba(128, 128, 128, 0.5)",
          fontSize: "16px",
          cursor: "pointer",
          transition: "color 0.3s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255, 0, 0, 1)")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(128, 128, 128, 0.5)")}
      >
        X
      </button>
      <p>
        {boxState.height}, {boxState.width}
      </p>
    </Rnd>
  );
};

export default BarBoundingBox;
