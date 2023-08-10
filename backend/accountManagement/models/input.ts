
import mongoose, { Document, Schema } from 'mongoose';

interface IInput extends Document {
  userId: string;
  input: string;
}

const inputSchema: Schema = new Schema({
  userId: { type: String, required: true },
  input: { type: String, required: true },
});

const Input = mongoose.model<IInput>('Input', inputSchema);

export default Input;
