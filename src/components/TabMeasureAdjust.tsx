import { FC, useEffect, useState } from 'react';
import { tabImage } from '../types';
import BarBoundingBox from './BarBoundingBox';

type TabDisplayProps = {
    tabImages: tabImage[];
    onUploadAgain: () => void;
}

const TabMeasureAdjust: FC<TabDisplayProps> = ({ tabImages, onUploadAgain }) => {
    const [boundingBoxes, setBoundingBoxes] = useState<number[][]>([]);

    const updateBox = (index: number, newBox: number[]) => {
        const updatedBoxes = [...boundingBoxes];
        updatedBoxes[index] = newBox;
        setBoundingBoxes(updatedBoxes);
    };

    const deleteBox = (index: number) => {
        const updatedBoxes = boundingBoxes.filter((_, i) => i !== index);
        setBoundingBoxes(updatedBoxes);
    };

    useEffect(() => {
        const extractedBoundingBoxes = tabImages.flatMap(image => 
            image.bounding_boxes.flat().map(bb => bb.box)
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
                                boundingBoxes.map((bb, bbIdx) => {
                                    return (   
                                        <BarBoundingBox
                                            key={bbIdx}
                                            box={bb}
                                            onUpdate={(newBox) => updateBox(bbIdx, newBox)}
                                            onDelete={() => deleteBox(bbIdx)}
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
            <button onClick={onUploadAgain}>Upload another tab</button>
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

