import React, { FC, useEffect, useState } from "react";

type PreviewProps = {
  file: File;
  onConfirm: () => void;
  onDeny: () => void;
};

const Preview: FC<PreviewProps> = ({ file, onConfirm, onDeny }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  return (
    <div>
      <h4>Your selected file (preview): </h4>
      <h5>{file.name}</h5>
      {previewUrl && (
        <div>
          <img
            src={previewUrl}
            alt="File preview"
            style={{ maxWidth: "100%", maxHeight: "300px", marginBottom: "10px" }}
          />
        </div>
      )}
      <p>Is this what you would like to have analyzed?</p>
      <button type="button" onClick={onDeny}>
        No
      </button>
      <button type="button" onClick={onConfirm}>
        Yes
      </button>
    </div>
  );
};

export default Preview;
