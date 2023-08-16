
import mongoose, { Document, Schema } from 'mongoose';

interface IInput extends Document {
  userId: string;
  input: string;
  date: Date;
}

const inputSchema: Schema = new Schema({
  userId: { type: String, required: true },
  input: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

const Input = mongoose.model<IInput>('Input', inputSchema);

export default Input;
