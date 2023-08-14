import { Request, Response } from 'express';
import fs from 'fs';
import Image from '../models/Image';

class ImageController {
    async uploadImage(req: Request, res: Response) {
        try {
            if (!req.file) {
                return res.status(400).json({ message: 'No image provided' });
            }

            const userId = req.body.userId;
            const name = req.file.originalname;
            const imagePath = req.file.path;

            // Read image file and convert to base64
            const imageBuffer = fs.readFileSync(imagePath);
            const base64Image = imageBuffer.toString('base64');

            // Create or update image in MongoDB
            let image = await Image.findOne({ userId });

            if (!image) {
                image = new Image({
                    userId,
                    name,
                    data: base64Image,
                });
            } else {
                image.name = name;
                image.data = base64Image;
            }

            const savedImage = await image.save();

            // Delete the temporary image file
            fs.unlinkSync(imagePath);

            res.status(200).json(savedImage);
        } catch (error) {
            console.error('Error storing image', error);
            res.status(500).json({ message: 'Error storing image' });
        }
    }

    async getImagesByUser(req: Request, res: Response) {
        try {
            const userId = req.params.userId;
            const images = await Image.findOne({ userId });
            res.status(200).json(images);
        } catch (error) {
            console.error('Error fetching images by user', error);
            res.status(500).json({ message: 'Error fetching images by user' });
        }
    }
}

export default new ImageController();
