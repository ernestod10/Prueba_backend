import mongoose ,{Schema,Document}from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();
const salt = 10;

export interface IUser extends Document {
    username:string;
    email:string;
    password:string;
    token?:string;
}

const userSchema:Schema = new mongoose.Schema({
    username:       {type:String, required:true,maxlength : 50},
    email:           {type:String, required:true,trim:true, unique:true},
    password:        {type:String, required:true,minlength:8 },
    token:           {type:String}
});

//hash contraseña con middleware de mongoose
userSchema.pre<IUser>("save", async function (next) {
    const user = this;
    if (!user.isModified("password")) {
        return next();
    }
    try {
        const hashedPassword = await bcrypt.hash(user.password, (await bcrypt.genSalt(salt)));
        user.password = hashedPassword;
        return next();
    } catch (error: any) {
        return next(error);
    }
});

//Comparar contraseña hasheada con la almacenada en la bd para el inicio de sesion
userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password); //Devuelve true si la contraseña es correcta
};

//Genera token de login con JWT
userSchema.methods.generateToken = function (): string {
    var user = this;
    var token = jwt.sign({_id:user._id},process.env.SECRET || '', {expiresIn:'1h'})
    return token; //Devuelve el token generado
}
//Revisa si el usuario ya tiene un token
userSchema.methods.checkToken = function (): boolean {
    return this.token ? true : false; //Devuelve true si el usuario ya tiene un token
}

//Busca usuario por token para la auth 
userSchema.statics.findByToken = function (token: string): Promise<IUser | null> {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.SECRET || '', async function (err: any, decode: any) {
            if (err) {
                return reject(err);
            }
            try {
                const userDoc = await User.findOne({ _id: decode, token: token });
                resolve(userDoc); // Puede devolver null si no encuentra el usuario
            } catch (error) {
                reject(error); // Error en la consulta
            }
        });
    });
}

//logout
userSchema.methods.deleteToken = function (token: string) {
    var user = this;
    return User.updateOne({ _id: user._id }, { $unset: { token: 1 } });
}



const User = mongoose.model<IUser>("User",userSchema);

export default User;