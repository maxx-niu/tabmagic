import { FC } from "react";

interface TabBarVisualizerProps {
  notes: {
    string: number;
    fret: number;
  }[];
}

const TabBarVisualizer: FC<TabBarVisualizerProps> = ({ notes }) => {
  return <div>TabBarVisualizer</div>;
};

export default TabBarVisualizer;
