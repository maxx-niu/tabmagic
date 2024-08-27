import React, { FC } from 'react';
import { ProcessedImage } from '../types';

type TabDisplayProps = {
    processedImages: ProcessedImage[];
  }

const TabDisplay: FC<TabDisplayProps> = ({processedImages}) => {
    console.log(processedImages[0]);
    return (
        <div>
            {processedImages.map((image, index) => (
                <div key={index}>
                    <img 
                        src={`http://localhost:5000${image.image_path}`}
                        alt='churg'
                        style={{ maxWidth: '100%', height: 'auto', marginBottom: '20px' }}
                    />
                    <p>Bounding Boxes:</p>
                </div>
            ))}
        </div>
    );
};

export default TabDisplay;