import { FC, useEffect, useState } from 'react';
import BarBoundingBox from './BarBoundingBox';
import { TabDisplayProps } from '../types';
import { v4 as uuidv4 } from 'uuid';
import '../styles/TabMeasureAdjust.css'

type BoundingBox = {
    id: string;
    box: number[];
}

const TabMeasureAdjust: FC<TabDisplayProps> = ({ tabImages, onUploadAgain }) => {
    const [boundingBoxes, setBoundingBoxes] = useState<BoundingBox[][]>([]);
    const [flashId, setFlashId] = useState<string | null>(null);
    const [availableHeight, setAvailableHeight] = useState(window.innerHeight);
    const [currentPage, setCurrentPage] = useState(0);

    const deleteBox = (id: string, pageIndex: number) => {
        setBoundingBoxes((prevBoxes) => 
            prevBoxes.map((boxes, idx) => 
                idx === pageIndex ? boxes.filter(box => box.id !== id) : boxes
            )
        );
    };

    const addBox = (newBox: number[], pageNumber: number) => {
        const newId = uuidv4();
        setBoundingBoxes((prevBoxes) => 
            prevBoxes.map((box, index) => 
                index === pageNumber ? [...box, { id: newId, box: newBox }] : box
            )
        );
        setFlashId(newId);
        setTimeout(() => setFlashId(null), 500);
    };

    const updateBox = (updatedBox: number[], boxId: string, pageIndex: number) => {
        setBoundingBoxes((prevBoxes) =>
            prevBoxes.map((boxes, idx) =>
                idx === pageIndex
                    ? boxes.map((box) =>
                          box.id === boxId ? { ...box, box: updatedBox } : box
                      )
                    : boxes
            )
        );
    };
    
    const handleResize = () => {
        setAvailableHeight(window.innerHeight);
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        const extractedBoundingBoxes: BoundingBox[][] = tabImages.map(image => 
            image.bounding_boxes.flat().map((bb) => ({
                id: uuidv4(),
                box: bb.box
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

    const maxHeight = availableHeight * 0.80;
    const scaleFactor = Math.min(1, maxHeight / tabImages[currentPage].image_height);
    console.log(scaleFactor);

    return (
        <>
            <div className='tab-measure-adjust' style={{height: availableHeight}}>
                <h2 style={{marginTop: 0}}>
                    Detected bounding boxes for each bar
                </h2>
                <p style={{ margin: 0 }}>
                    Adjust and add bounding boxes to ensure each bar is properly encapsulated
                </p>
                <div>
                    <button onClick={() => addBox([0, 0, 100, 100], currentPage)}>Add a bounding box</button>
                    <div
                        key={currentPage}
                        style={{
                            backgroundImage: `url('http://localhost:5000${tabImages[currentPage].image_path}')`,
                            backgroundSize: 'contain',
                            backgroundPosition: 'center',
                            width: tabImages[currentPage].image_width * scaleFactor,
                            height: tabImages[currentPage].image_height * scaleFactor,
                            position: 'relative',
                            border: '1px solid black'
                        }}
                    >
                        {boundingBoxes[currentPage]?.map((bb) => {
                            const scaledBox = bb.box.map((value) =>
                                value * scaleFactor
                            );       
                            return (
                                <BarBoundingBox
                                    key={bb.id}
                                    box={scaledBox}
                                    onDelete={() => deleteBox(bb.id, currentPage)}
                                    imageHeight={tabImages[currentPage].image_height * scaleFactor}
                                    imageWidth={tabImages[currentPage].image_width * scaleFactor}
                                    flash={bb.id === flashId}
                                    onUpdate={(newBox) => updateBox(newBox, bb.id, currentPage)}
                                    scaleFactor={scaleFactor}
                                />
                            );
                        })}
                    </div>
                </div>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '20px'
                }}>
                    <button 
                        onClick={handlePreviousPage} 
                        disabled={currentPage === 0}
                        style={{
                            backgroundColor: 'gray',
                            color: 'white',
                            border: 'none',
                            borderRadius: '10px',
                            padding: '10px 20px',
                            cursor: 'pointer'
                        }}
                    >
                        Previous
                    </button>
                    <button 
                        onClick={handleNextPage} 
                        disabled={currentPage === tabImages.length - 1}
                        style={{
                            backgroundColor: 'gray',
                            color: 'white',
                            border: 'none',
                            borderRadius: '10px',
                            padding: '10px 20px',
                            cursor: 'pointer'
                        }}
                    >
                        Next
                    </button>
                </div>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '10px',
                    marginTop: '20px'
                }}>
                    <button 
                        onClick={() => onUploadAgain()} 
                        style={{
                            backgroundColor: 'gray',
                            color: 'white',
                            border: 'none',
                            borderRadius: '10px',
                            padding: '10px 20px',
                            cursor: 'pointer'
                        }}
                    >
                        Upload another tab
                    </button>
                    <button 
                        onClick={() => {console.log("TODO")}} 
                        style={{
                            backgroundColor: 'green',
                            color: 'white',
                            border: 'none',
                            borderRadius: '10px',
                            padding: '10px 20px',
                            cursor: 'pointer'
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
