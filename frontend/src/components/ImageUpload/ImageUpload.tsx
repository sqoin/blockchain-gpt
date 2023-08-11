import React, { useState,useEffect  } from 'react';
import axios from 'axios';
interface Image {
    _id: string;
    name: string;
    path: string;
  }
const ImageUpload: React.FC = () => {
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [userId, setUserId] = useState<string>('user123');
    const [image, setImage] = useState<Image>();

    useEffect(() => {
        fetchImagesByUser(userId);
    }, [userId]);

    const fetchImagesByUser = async (userId: string) => {
        try {
            const response = await axios.get(`http://localhost:3003/api/getimage/${userId}`);
            setImage(response.data);
            console.log('====================================');
            console.log("image : ",image);
            console.log('====================================');
        } catch (error) {
            console.error('Error fetching images by user', error);
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
            setImageUrl(`http://localhost:3003/${response.data.path}`);
        } catch (error) {
            console.error('Error uploading image', error);
        }
    };

    return (
        <div>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            <button onClick={handleUpload}>Upload Image</button>
            {imageUrl && <img src={imageUrl} alt="Uploaded" />}
        </div>
    );
};

export default ImageUpload;
