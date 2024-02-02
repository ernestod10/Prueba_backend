import mongoose, { Schema, Document, Model } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();
const salt = 10;

export interface IUser extends Document {
    username:string;
    email:string;
    password:string;
    password2:string;
    token?:string;
    comparePassword: (password: string) => Promise<boolean>;
    generateToken: () => string;
    checkToken: () => boolean;
    findByToken: (token: string) => Promise<IUser | null>;
    deleteToken: (token: string) => any; 

}
export interface IUserModel extends Model<IUser> {
    findByToken: (token: string) => Promise<IUser | null>;
}

const userSchema: Schema = new mongoose.Schema({
    username:       {type:String, required:true,maxlength : 50},
    email:           {type:String, required:true,trim:true, unique:true},
    password:        {type:String, required:true,minlength:8 },
    password2:       {type:String, required:true,minlength:8 },
    token:           {type:String}
});
//hash contraseña 
function hashPassword(password:string): string {
    return bcrypt.hashSync(password, salt);
}
//Middleware de mongoose para hashear la contraseña antes de guardarla
userSchema.pre("save", async function (next) {
    let user = this as unknown as IUser;
    if (user.isModified("password")) {
        user.password = hashPassword(user.password);
        user.password2 = hashPassword(user.password2);
    }
    next();
});

//Comparar contraseña hasheada con la almacenada en la bd para el inicio de sesion
userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password); //Devuelve true si la contraseña es correcta
};

//Genera token de login con JWT
userSchema.methods.generateToken = function (): string {
    var user:any  = this;
    var token = jwt.sign({_id:user._id},process.env.SECRET || '', {expiresIn:'1h'})
    return token; //Devuelve el token generado
}
//Revisa si el usuario ya tiene un token
userSchema.methods.checkToken = function (): boolean {
    return !!this['token'];//Devuelve true si el usuario ya tiene un token
}

//Busca usuario por token para
userSchema.statics.findByToken = async function (token: string): Promise<IUser | null> {
    try {
        const decodedToken = jwt.verify(token, process.env.SECRET || '') as { _id: string, iat: number, exp: number};
        if (decodedToken.iat < decodedToken.exp) {
        return await this.findOne({ _id: decodedToken._id });}
        else {
            return null;
        }
    } catch (error) {
        return null;
    }
};


//logout
userSchema.methods.deleteToken = function (token: string) {
    var user:any = this;
    return User.updateOne({ _id: user._id }, { $unset: { token: 1 } });
}




const User:IUserModel = mongoose.model<IUser,IUserModel>("User", userSchema);


export default User;