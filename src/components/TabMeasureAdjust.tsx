import { FC, useEffect, useState } from 'react';
import BarBoundingBox from './BarBoundingBox';
import { TabDisplayProps } from '../types';
import { v4 as uuidv4 } from 'uuid';

type BoundingBox = {
    id: string;
    box: number[];
}

const TabMeasureAdjust: FC<TabDisplayProps> = ({ tabImages, onUploadAgain }) => {
    const [boundingBoxes, setBoundingBoxes] = useState<BoundingBox[][]>([]);
    const [flashId, setFlashId] = useState<string | null>(null);

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

    useEffect(() => {
        const extractedBoundingBoxes: BoundingBox[][] = tabImages.map(image => 
            image.bounding_boxes.flat().map((bb) => ({
                id: uuidv4(),
                box: bb.box
            }))
        );
        setBoundingBoxes(extractedBoundingBoxes);
        console.log(tabImages);
    }, [tabImages]);


    return (
        <>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center', // Center horizontally
                justifyContent: 'center', // Center vertically
                margin: 'auto'
            }}>
                <h1>
                    Detected bounding boxes for each bar
                </h1>
                <p style={{ margin: 0 }}>
                    Adjust and add bounding boxes to ensure each bar is properly encapsulated
                </p>
                {tabImages.map((tabImage, imgIdx) => {
                    return (
                        <div key={imgIdx}>
                            <button onClick={() => addBox([0, 0, 100, 100], imgIdx)}>Add a bounding box</button>
                            <div
                                style={{
                                    backgroundImage: `url('http://localhost:5000${tabImage.image_path}')`,
                                    backgroundSize: 'contain',
                                    backgroundPosition: 'center',
                                    width: tabImage.image_width,
                                    height: tabImage.image_height,
                                    position: 'relative',
                                }}
                            >
                                {
                                    boundingBoxes[imgIdx]?.map((bb) => {
                                        return (
                                            <BarBoundingBox
                                                key={bb.id}
                                                box={bb.box}
                                                onDelete={() => deleteBox(bb.id, imgIdx)}
                                                imageHeight={tabImage.image_height}
                                                imageWidth={tabImage.image_width}
                                                flash={bb.id === flashId}
                                            />
                                        )
                                    })
                                }
                            </div>
                        </div>
                    )
                })}
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
