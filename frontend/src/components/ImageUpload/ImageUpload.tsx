import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProfileImage from "../../assets/images/ProfileImage.jpg"

import './ImageUpload.css';

interface Image {
  _id: string;
  userId: string;
  name: string;
  data: string;
}

const ImageUpload: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [userId, setUserId] = useState<string>('user123');
  const [image, setImage] = useState<Image | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchImagesByUser(userId);
  }, [userId]);

  const fetchImagesByUser = async (userId: string) => {
    try {
      const response = await axios.get(`http://localhost:3003/api/getimage/${userId}`);
      setImage(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching images by user', error);
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedImage) return;

    const formData = new FormData();
    formData.append('image', selectedImage);
    formData.append('userId', userId);

    try {
      const response = await axios.post('http://localhost:3003/api/uploadimage', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Image uploaded successfully');
      setImage(response.data);
    } catch (error) {
      console.error('Error uploading image', error);
    }
  };

  return (
    <div className='ImageUpload'>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          {image?.data ? (
            <img className='profile' src={`data:image/jpeg;base64,${image?.data}`} alt={image?.name} />
          ) : (
            <img className='profile' src={ProfileImage} alt='Default' />
          )}
          <div className='file-input-container'>
            <input type='file' accept='image/*' onChange={handleImageChange} className='file-input' />
            <label className='file-input-label' htmlFor='fileInput'>
              Choose Image
            </label>
          </div>
          <button className='confirm' onClick={handleUpload}>
            Upload Image
          </button>
        </>
      )}
    </div>
  );
};

export default ImageUpload;
