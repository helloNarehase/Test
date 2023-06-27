import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import './App.css';

const App = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [convertedImagePath, setConvertedImagePath] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  const [imageTimestamp, setImageTimestamp] = useState(Date.now()); // 현재 시간 정보 저장

  useEffect(() => {
    if (convertedImagePath) {
      // 이미지가 변환된 후에 이미지 URL을 업데이트하기 위해 timestamp를 갱신합니다.
      setImageTimestamp(Date.now());
    }
  }, [convertedImagePath]);
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    previewFile(event.target.files[0]);
  };

  const handleDrop = (acceptedFiles) => {
    setSelectedFile(acceptedFiles[0]);
    previewFile(acceptedFiles[0]);
  };

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
  };

  const handleUpload = async () => {
    setConvertedImagePath("")
    if (!selectedFile) {
      alert('Please select an image file.');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await axios.post('http://localhost:5000/api/convert', formData);
      const { image_path } = response.data;
      setConvertedImagePath(image_path);
      previewFile(selectedFile); // 이미지 업로드 후에 미리보기 처리
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred during image conversion.');
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop: handleDrop });

  return (
    <div>
      <h1>Image Converter</h1>

      <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
        <input {...getInputProps()} onChange={handleFileChange} />
        {isDragActive ? (
          <p>Drop the image file here...</p>
        ) : (
          <p>Drag and drop an image file here, or click to select a file.</p>
        )}
      </div>

      {previewImage && (
        <div>
          <h2>Selected Image Preview</h2>
          <img src={previewImage} alt="Preview" className="preview-image" />
        </div>
      )}

      <button onClick={handleUpload}>Convert</button>

      {convertedImagePath && (
        <div>
          <h2>Converted Image</h2>
          <img
            src={`http://localhost:5000/${convertedImagePath}?${imageTimestamp}`} // 이미지 URL에 timestamp를 추가
            alt="Converted"
          />
        </div>
      )}
    </div>
  );
};

export default App;
