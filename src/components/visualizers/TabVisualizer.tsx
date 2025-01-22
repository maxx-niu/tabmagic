import { FC, useEffect, useState } from "react";
import { BarNoteResults } from "../../types";
import { useLocation } from "react-router-dom";
import TabPageVisualizer from "./TabPageVisualizer";

interface PageResult {
  bars: {
    bar: number;
    notes: any[];
  }[];
}

const TabVisualizer: FC = () => {
  const location = useLocation();
  const noteResults = (location.state?.noteResults || []) as BarNoteResults[];
  const [pageResults, setPageResults] = useState<PageResult[]>([]);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    console.log(noteResults);
    const pages = splitPages(noteResults);
    setPageResults(pages);
  }, [noteResults]);

  const handleNextPage = () => {
    setCurrentPage((prevPage) =>
      Math.min(prevPage + 1, pageResults.length - 1)
    );
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  const numPages = noteResults[noteResults.length - 1].page;
  const splitPages = (noteResults: BarNoteResults[]): PageResult[] => {
    const pagesMap: { [key: number]: PageResult } = {};

    noteResults.forEach((result) => {
      const { page, bar } = result;
      if (!pagesMap[page]) {
        pagesMap[page] = { bars: [] };
      }
      pagesMap[page].bars.push({ bar, notes: [] });
    });

    const result = Object.values(pagesMap);
    console.log(result);
    return result;
  };

  return (
    <>
      <div className="tab-visualizer-container">
        {pageResults.length > 0 && (
          <TabPageVisualizer
            page={currentPage + 1}
            bars={pageResults[currentPage].bars.length}
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
    </>
  );
};

export default TabVisualizer;
