import mongoose from 'mongoose'

interface IRegister{
    ID: string,
    date: Date,
    name: string,
    lastName: string
    email: string
    
  }
  interface RegisterModelInterface extends mongoose.Model<RegistertDoc> {
    build(attr: IRegister):RegistertDoc
  }
  interface RegistertDoc extends mongoose.Document {
    ID: string,
    date: Date,
    name: string,
    lastName: string
    email :string
  }
const registerSchema = new mongoose.Schema({
    ID: {
        type: String,
        required: false
      },
    date: {
      type: Date,
      required: false
    },
    name:{
        type: String,
        required: false
    },
    lastName:{
        type: String,
        required: false
    },
    email:{
      type: String,
      required:false
    }
  })
  registerSchema.statics.build = (attr: IRegister) => {
    return new Register(attr)
  }
  const Register = mongoose.model<RegistertDoc, RegisterModelInterface>('register', registerSchema)
 

  export { Register , IRegister}