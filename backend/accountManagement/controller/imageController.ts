import { Request, Response } from 'express';
import Image from '../models/Image';

interface ExtendedRequest extends Request {
    file: any;
}

class ImageController {
    async uploadImage(req: Request, res: Response) {
        try {
            if (!(req as ExtendedRequest).file) {
                return res.status(400).json({ message: 'No image provided' });
            }

            const userId = req.body.userId;
            const name = (req as ExtendedRequest).file.originalname;
            const path = (req as ExtendedRequest).file.path;

            const image = new Image({ userId, name, path });
            const savedImage = await image.save();
            // const imageUrl = `http://localhost:3003/${(req as ExtendedRequest).file.path}`;
            // res.status(200).json({ message: 'Image uploaded successfully', imageUrl });
            res.status(200).json(savedImage);
        } catch (error) {
            console.error('Error uploading image', error);
            res.status(500).json({ message: 'Error uploading image' });
        }
    }

    async getImagesByUser(req: Request, res: Response) {
        try {
            const userId = req.params.userId;
            const images = await Image.find({ userId });

            res.status(200).json(images);
        } catch (error) {
            console.error('Error fetching images by user', error);
            res.status(500).json({ message: 'Error fetching images by user' });
        }
    }
}

export default new ImageController();
