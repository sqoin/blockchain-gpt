import mongoose from 'mongoose'

interface IRegister{
    ID: string,
    creation_date: Date,
    expiration_date: Date,
    name: string,
    lastName: string
    email: string
    account_status: string
    telegram_user_name: string
    github_account: string
  }
  interface RegisterModelInterface extends mongoose.Model<RegistertDoc> {
    build(attr: IRegister):RegistertDoc
  }
  interface RegistertDoc extends mongoose.Document {
    ID: string,
    creation_date: Date,
    expiration_date: Date,
    name: string,
    lastName: string
    email :string
    account_status: string
    telegram_user_name :string
    github_account: string

  }
const registerSchema = new mongoose.Schema({
    ID: {
        type: String,
        required: false
      },
    creation_date: {
      type: Date,
      required: false
    },
    expiration_date: {
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
    },
    account_status: {
      type: String,
      required: false
    },
    telegram_user_name :{
      type:String,
      required:false
    },
    github_account:{
      type: String,
      required:false
    }
  })
  registerSchema.statics.build = (attr: IRegister) => {
    return new Register(attr)
  }
  const Register = mongoose.model<RegistertDoc, RegisterModelInterface>('register', registerSchema)
 

  export { Register , IRegister}