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
        const { box } = item;
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
          />
        );
      })}
    </div>
  );
};

export default TabBarVisualizer;
