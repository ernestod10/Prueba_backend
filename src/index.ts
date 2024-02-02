import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from 'cookie-parser';
import User,{ IUser } from "./user/UserModel";
import auth from "./auth/auth";
import bodyParser  from "body-parser";

dotenv.config();

const db = process.env.MONGO_URL || "";
const app: Express = express();
const port = process.env.PORT||3000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Database Connection
mongoose.Promise = global.Promise;
mongoose.connect(db, )
  .then(() => {
    console.log("Database connected");
  })
  .catch((err: any) => {
    console.error("Error connecting to database:", err);
  });
  
//Routes
app.get('/', (req:Request, res:Response) => {
  res.send('Prueba Avilatek');
});

//Sign-up Route
app.post('/signup', (req:Request, res:Response) => {
  console.log(req.body);
  //Validar datos
  if (!req.body.username || !req.body.email || !req.body.password) {
    res.status(400).send('Faltan datos');
  }
  if (req.body.password.length < 8) {
    res.status(400).send('La contraseña debe tener al menos 8 caracteres');
  }
  if (!req.body.email.includes('@')) {
    res.status(400).send('Email invalido');
  }
  if (req.body.username.length > 50) {
    res.status(400).send('El nombre de usuario es muy largo');
  }
  if (req.body.email.length > 50) {
    res.status(400).send('El email es muy largo');
  }
  if (req.body.password!==req.body.password2) {
    res.status(400).send('Las contraseñas no coinciden');
  }
  var newuser = new User(req.body);

  newuser.save().then((user:IUser) => {
    res.status(200).send(user);
  }
  ).catch((err:any) => {
    res.status
    (400).send(err);
  }
  );

});



//Listening
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});