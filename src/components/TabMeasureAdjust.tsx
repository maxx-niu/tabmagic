import { FC, useEffect, useState } from 'react';
import { tabImage } from '../types';
import BarBoundingBox from './BarBoundingBox';
import { TabDisplayProps } from '../types';
import { v4 as uuidv4 } from 'uuid';

type BoundingBox = {
    id: string;
    box: number[];
}

const TabMeasureAdjust: FC<TabDisplayProps> = ({ tabImages, onUploadAgain }) => {
    const [boundingBoxes, setBoundingBoxes] = useState<BoundingBox[]>([]);

    const updateBox = (id: string, newBox: number[]) => {
        setBoundingBoxes((prevBoxes) => 
            prevBoxes.map(prevBox => 
                prevBox.id === id ? {...prevBox, box: newBox} : prevBox
            )
        );
    };

    const deleteBox = (id: string) => {
        setBoundingBoxes((prevList) => 
            prevList.filter(prevBox => prevBox.id !== id)
        )
    };

    const addBox = (newBox: number[]) => {
        setBoundingBoxes((prevBoxes) => [...prevBoxes, {
            id: uuidv4(),
            box: newBox
        }])
    };

    useEffect(() => {
        const extractedBoundingBoxes: BoundingBox[] = tabImages.flatMap(image => 
            image.bounding_boxes.flat().map((bb) => ({
                id: uuidv4(),
                box: bb.box
            }))
        );
        setBoundingBoxes(extractedBoundingBoxes);

    }, [tabImages]);

    return (
        <>
            <div>
                {tabImages.map((tabImage, imgIdx) => {
                    console.log(tabImage);
                    return (
                        <div 
                            key={imgIdx} 
                            style={{ 
                                backgroundImage: `url('http://localhost:5000${tabImage.image_path}')`,
                                backgroundSize: 'contain',
                                backgroundPosition: 'center',
                                width: tabImage.image_width,
                                height: tabImage.image_height,
                                position: 'relative'
                            }}
                        >
                            {
                                boundingBoxes.map((bb) => {
                                    return (   
                                        <BarBoundingBox
                                            key={bb.id}
                                            box={bb.box}
                                            onUpdate={(newBox) => updateBox(bb.id, newBox)}
                                            onDelete={() => deleteBox(bb.id)}
                                            imageHeight={tabImage.image_height}
                                            imageWidth={tabImage.image_width}
                                        ></BarBoundingBox>
                                    )
                                })
                            }
                        </div>
                    )
            })}
            </div>
            <button onClick={() => addBox([0, 0, 100, 100])}>Add a bounding box</button>
            <button onClick={() => onUploadAgain}>Upload another tab</button>
        </>
    );
};

export default TabMeasureAdjust;

/*return (<div key={imgIdx}>
                    <img 
                        src={`http://localhost:5000${tabImage.image_path}`}
                        alt='Tab Page Preview'
                        style={{ maxWidth: '100%', height: 'auto', marginBottom: '20px' }}
                    />
                    {tabImage.bounding_boxes.flat().map((box, boxIdx) => {
                        const imageNameNoExtension = tabImage.image_name.replace(/\.png$/, '');
                        const barPath = encodeURI(`/tab_boxes/${imageNameNoExtension}_bar_${boxIdx + 1}.png`);
                        return (<div key={boxIdx} style={{ marginBottom: '10px'}}>
                            <img 
                                src={`http://localhost:5000${barPath}`}
                                alt={`Bar ${boxIdx + 1}`}
                            />
                        </div>)
                    })}
                </div>)*/

