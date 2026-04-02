import { FC, useEffect, useState } from "react";
import { BarNoteResults, TabImage } from "../../types";
import { useLocation } from "react-router-dom";
import TabPageVisualizer from "./TabPageVisualizer";

interface BarData {
  bar: number;
  imageSrc: string;
  boxes: BarNoteResults["boxes"];
}

interface PageResult {
  bars: BarData[];
}

const TabVisualizer: FC = () => {
  const location = useLocation();
  const [pageResults, setPageResults] = useState<PageResult[]>([]);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const noteResults = (location.state?.noteResults || []) as BarNoteResults[];
    const tabImages = (location.state?.tabImages || []) as TabImage[];

    const getBarImageSrc = (page: number, bar: number): string => {
      const tabImage = tabImages[page - 1];
      if (!tabImage) return "";
      const imageNameWithoutExt = tabImage.image_name.replace(/\.[^/.]+$/, "");
      return `http://localhost:5000/tab_boxes/${imageNameWithoutExt}_bar_${bar}.png`;
    };

    const pagesMap: { [key: number]: PageResult } = {};
    noteResults.forEach((result) => {
      const { page, bar, boxes } = result;
      if (!pagesMap[page]) {
        pagesMap[page] = { bars: [] };
      }
      pagesMap[page].bars.push({ bar, imageSrc: getBarImageSrc(page, bar), boxes });
    });
    setPageResults(Object.values(pagesMap));
  }, [location.state]);

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, pageResults.length - 1));
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div className="tab-visualizer-container">
      {pageResults.length > 0 && (
        <TabPageVisualizer
          page={currentPage + 1}
          bars={pageResults[currentPage].bars}
        />
      )}
      <div>
        <button onClick={handlePreviousPage} disabled={currentPage === 0}>
          Previous Page
        </button>
        <button
          onClick={handleNextPage}
          disabled={currentPage === pageResults.length - 1}
        >
          Next Page
        </button>
      </div>
    </div>
  );
};

export default TabVisualizer;
