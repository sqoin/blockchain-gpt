import mongoose, { Document, Schema } from 'mongoose';

interface IImage extends Document {
    userId: string;
    name: string;
    data: string; // Base64 image data
}

const imageSchema = new mongoose.Schema<IImage>({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    data: { type: String, required: true }, // Base64 image data
});

const Image = mongoose.model<IImage>('Image', imageSchema);

export default Image;
