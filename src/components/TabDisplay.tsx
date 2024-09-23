import React, { FC } from 'react';
import { ProcessedImage } from '../types';

type TabDisplayProps = {
    processedImages: ProcessedImage[];
    onUploadAgain: () => void;
}

const TabDisplay: FC<TabDisplayProps> = ({processedImages, onUploadAgain}) => {
    return (
        <div>
            {processedImages.map((processedImage, imgIdx) => {
                console.log(processedImage);
                return (<div key={imgIdx}>
                    <img 
                        src={`http://localhost:5000${processedImage.image_path}`}
                        alt='Tab Page Preview'
                        style={{ maxWidth: '100%', height: 'auto', marginBottom: '20px' }}
                    />
                    {processedImage.bounding_boxes.flat().map((box, boxIdx) => {
                        const imageNameNoExtension = processedImage.image_name.replace(/\.png$/, '');
                        const barPath = encodeURI(`/tab_boxes/${imageNameNoExtension}_bar_${boxIdx + 1}.png`);
                        return (<div key={boxIdx} style={{ marginBottom: '10px'}}>
                            <img 
                                src={`http://localhost:5000${barPath}`}
                                alt={`Bar ${boxIdx + 1}`}
                            />
                        </div>)
                    })}
                </div>)
            })}
            <button onClick={onUploadAgain}>Upload another tab</button>
        </div>
    );
};

export default TabDisplay;