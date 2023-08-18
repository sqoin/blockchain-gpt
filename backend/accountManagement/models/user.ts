import mongoose from 'mongoose'

interface IUser{
    ID: string,
    creation_date: Date,
    expiration_date: Date,
    name: string,
    lastName: string,
    email: string,
    account_status: string,
    telegram_user_name: string,
    github_account: string,
    paymentDate?: Date
  }
  interface UserModelInterface extends mongoose.Model<UsertDoc> {
    build(attr: IUser):UsertDoc
  }
  interface UsertDoc extends mongoose.Document {
    ID: string,
    creation_date: Date,
    expiration_date: Date,
    name: string,
    lastName: string,
    email :string,
    account_status: string,
    telegram_user_name :string,
    github_account: string,
    paymentDate?: Date
  }
const userSchema = new mongoose.Schema({
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
    },
    paymentDate: {
      type: Date,
      required: false,
    }
  })
  userSchema.statics.build = (attr: IUser) => {
    return new User(attr)
  }
  const User = mongoose.model<UsertDoc, UserModelInterface>('User', userSchema)
 

  export { User , IUser}