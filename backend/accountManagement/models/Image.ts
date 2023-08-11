import mongoose, { Document, Schema } from 'mongoose';


const imageSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    path: { type: String, required: true },
});

const Image = mongoose.model('Image', imageSchema);


export default Image;
