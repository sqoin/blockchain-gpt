import mongoose from 'mongoose';

interface Ichat {
  chatId: string;
}

interface chatModelInterface extends mongoose.Model<chatDoc> {
  build(attr: Ichat): chatDoc;
}

interface chatDoc extends mongoose.Document {
  chatId: string;
}

const chatSchema = new mongoose.Schema({
  chatId: {
    type: String,
    required: true,
    unique: true, // Assuming each chatId should be unique
  },
});

chatSchema.statics.build = (attr: Ichat) => {
  return new chat(attr);
};

const chat = mongoose.model<chatDoc, chatModelInterface>('chat', chatSchema);

export { chat, Ichat };