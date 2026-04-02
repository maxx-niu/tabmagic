import { FC } from "react";
import TabBarVisualizer from "./TabBarVisualizer";
import { BarNoteResults } from "../../types";

interface BarData {
  bar: number;
  imageSrc: string;
  boxes: BarNoteResults["boxes"];
}

interface TabPageVisualizerProps {
  page: number;
  bars: BarData[];
}

const TabPageVisualizer: FC<TabPageVisualizerProps> = ({ page, bars }) => {
  return (
    <div className="tab-page-visualizer-container">
      <p>Page: {page}</p>
      {bars.map((barData) => (
        <div key={barData.bar} style={{ marginBottom: "20px" }}>
          <p>Bar {barData.bar}</p>
          <TabBarVisualizer imageSrc={barData.imageSrc} boxes={barData.boxes} />
        </div>
      ))}
    </div>
  );
};

export default TabPageVisualizer;
