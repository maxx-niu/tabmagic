import { useCallback, useState, FC } from 'react';
import { FileRejection, useDropzone } from 'react-dropzone';
import '../styles/UploadComponent.css';
import UploadErrorBox from './UploadErrorBox';
import TabDisplay from './TabDisplay';
import Preview from './Preview';
import { tabImage } from '../types';
import LoadingBars from './LoadingBars';
import TabMeasureAdjust from './TabMeasureAdjust';

const UploadComponent: FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [showUploadErrorBox, setShowUploadErrorBox] = useState(false);
  const [uploadError, setUploadError] = useState<{
    code: string,
    message: string
  }>({code: '', message: ''});
  const [processedImages, setProcessedImages] = useState<tabImage[]>([]);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
    if(rejectedFiles.length === 0){
      // do something with the accepted files
      setFile(acceptedFiles[0]);
      setShowPreview(true);
    } else {
      // do something with rejected files
      if(rejectedFiles.length > 1){
        setShowUploadErrorBox(true);
        setUploadError({code: 'too-many-files', message: 'Too many files'});
      }
      else{
        setShowUploadErrorBox(true);
        setUploadError(rejectedFiles[0]['errors'][0]);
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'], 'image/png': ['.png'] },
    maxSize: 10000 * 1000 * 1000, // 10 MB max file size
    maxFiles: 1,
  });

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setIsProcessing(true);

    try {
      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('File upload failed');
      }
    } catch (error) {
      setShowUploadErrorBox(true);
      setUploadError({ code: 'upload-failed', message: error instanceof Error ? error.message : 'An unknown error occurred' });
    }
    try {
      const response = await fetch('http://localhost:5000/process', {
        method: 'POST'
      });

      if (!response.ok) {
        throw new Error('File upload failed');
      }
      const processedData = await response.json();
      setProcessedImages(processedData);
      setShowPreview(false);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsProcessing(false);  // End processing regardless of outcome
    }
  };

  return (
    <>
      <div className='upload-component'>
        { processedImages.length === 0 && !file &&
          <form className='upload-component-form'>
            <div {...getRootProps(
              {className: 'upload-component-box'}
              )}>
              <input {...getInputProps()} />
              {
                isDragActive ? // triggers if user drags something over the drop-zone
                  <p>Drop PDF tabs or tab images here</p> :
                  <p>Click to add or drag PDF/image tabs here</p>
              }
            </div>
          </form>
        }
        {
          file && showPreview && !isProcessing && <Preview file={file} onConfirm={handleUpload} onDeny={() => {
            setFile(null)
            setShowPreview(false)
          }}/>
        }
        <UploadErrorBox
          isOpen={showUploadErrorBox}
          error={uploadError}
          onClose={() => {
            setShowUploadErrorBox(false);
            setUploadError({code: '', message: ''});
          }}
        />
        {isProcessing ? (
          <LoadingBars />
        ) : (
          processedImages.length > 0 && <TabMeasureAdjust tabImages={processedImages} onUploadAgain={() => {
            setProcessedImages([])
            setFile(null)
            setShowPreview(false)
          }}/>
        )}
      </div>
    </>
  )
}

export default UploadComponent