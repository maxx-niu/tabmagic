import React, { FC } from 'react';
import { UploadSuccessfulBoxProps } from '../types';

const UploadSuccessfulBox: FC<UploadSuccessfulBoxProps> = ({isOpen, onCancel, setProcessedImages}) => {
  if(!isOpen) return null;

  const confirmProcessing = async() => {
    try {
      const response = await fetch('http://localhost:5000/process', {
        method: 'POST'
      });

      if (!response.ok) {
        throw new Error('File upload failed');
      }
      const processedData = await response.json();
      setProcessedImages(processedData);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
        <p>Upload successful, is this what you would like to use?</p>
        <button onClick={onCancel}>Cancel</button>
        <button onClick={confirmProcessing}>Confirm</button>
    </div>
  );
};

export default UploadSuccessfulBox;