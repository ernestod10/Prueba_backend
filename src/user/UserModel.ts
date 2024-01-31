import mongoose ,{Schema,Document}from "mongoose";

export interface IUser extends Document {
    firstname:string;
    lastname:string;
    email:string;
    password:string;
    repeat_password:string;
    token?:string;
}

const userSchema:Schema = new Schema({
    firstname: {type:String, required:true,maxlength : 50},
    lastname: {type:String, required:true,maxlength : 50},
    email: {type:String, required:true,trim:true, unique:true},
    password: {type:String, required:true,minlength:8 },
    repeat_password: {type:String, required:true,minlength:8},
    token: {type:String}
});

const UserModel = mongoose.model<IUser>("User",userSchema);

export default UserModel;