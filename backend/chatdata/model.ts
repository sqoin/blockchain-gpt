import mongoose from 'mongoose';

interface Ichat {
  chatId: string;
  userId: String;

}

interface chatModelInterface extends mongoose.Model<chatDoc> {
  build(attr: Ichat): chatDoc;
}


interface chatDoc extends mongoose.Document {
  chatId: string;
  userId: String;

}

const chatSchema = new mongoose.Schema({
  chatId: {
    type: String,
    required: true,
    unique: true, // Assuming each chatId should be unique
  },
  userId: {
    type: String,
    required: true,
    unique: true,
  },
});

chatSchema.statics.build = (attr: Ichat) => {
  return new chat(attr);
};

const chat = mongoose.model<chatDoc, chatModelInterface>('chat', chatSchema);

export  { chat, Ichat };