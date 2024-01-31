import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from 'cookie-parser';

dotenv.config();

const db = process.env.MONGO_URL || "";
const app: Express = express();
const port = process.env.PORT||3000;

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





//Listening
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});