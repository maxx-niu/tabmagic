import { FC, useEffect } from "react";
import TabBarVisualizer from "./TabBarVisualizer";

interface TabPageVisualizerProps {
  page: number;
  bars: number;
  // boxes: {
  //   box: {
  //     id: string;
  //     x1: number;
  //     y1: number;
  //     x2: number;
  //     y2: number;
  //   };
  //   score: number;
  //   label: string;
  // }[];
}

const TabPageVisualizer: FC<TabPageVisualizerProps> = ({ page, bars }) => {
  return (
    <>
      <div className="tab-page-visualizer-container">
        I am a tab Page Visualizer
        <p>Page: {page}</p>
        <p>Total Bars: {bars}</p>
        {Array.from({ length: bars }, (_, index) => (
          <div key={index}>
            <TabBarVisualizer notes={[]} />
          </div>
        ))}
      </div>
    </>
  );
};

export default TabPageVisualizer;
