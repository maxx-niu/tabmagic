import { FC } from "react";
import { BarNoteResults } from "../../types";

interface TabBarVisualizerProps {
  imageSrc: string;
  boxes: BarNoteResults["boxes"];
}

const TabBarVisualizer: FC<TabBarVisualizerProps> = ({ imageSrc, boxes }) => {
  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <img src={imageSrc} alt="Tab bar" style={{ display: "block", maxWidth: "100%" }} />
      {boxes.map((item) => {
        const { box, fret } = item;
        return (
          <div
            key={box.id}
            style={{
              position: "absolute",
              left: box.x1,
              top: box.y1,
              width: box.x2 - box.x1,
              height: box.y2 - box.y1,
              border: "2px solid red",
              boxSizing: "border-box",
              pointerEvents: "none",
            }}
          >
            <span
              style={{
                position: "absolute",
                top: -16,
                left: 0,
                fontSize: 11,
                color: "red",
                whiteSpace: "nowrap",
                pointerEvents: "none",
              }}
            >
              {fret}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default TabBarVisualizer;
