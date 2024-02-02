import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from 'cookie-parser';
import User,{ IUser } from "./user/UserModel";
import bodyParser  from "body-parser";

dotenv.config();

const db = process.env.MONGO_URL || "";
const app: Express = express();
const port = process.env.PORT||3000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
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

//Login Route
app.post('/login', (req:Request, res:Response) => {
  User.findOne({
    username: req.body.username
  }).then((user:IUser | null) => {
    if (!user) {
      return Promise.reject();
    }
    return user.comparePassword(req.body.password).then((isMatch:boolean) => {
      if (!isMatch) {
        return Promise.reject();
      }
      var token = user.generateToken();
      return user.save().then(() => {
        res.cookie('auth', token).send('Login exitoso');
      });
    });
  }).catch(() => {
    res.status(401).send('Usuario o contraseña incorrectos');
  });
}
);

//Logout Route
app.get('/logout', (req:Request, res:Response) => {
  try {
  const token = req.cookies.auth;
  if (!token) {
    return res.status(401).send('No estas logueado');
  }
  User.findByToken(token).then((user: IUser | null) => {
    if (!user) {
      return res.status(404).send('Usuario no encontrado');
    }return user.deleteToken(token).then(() => {
      res.clearCookie('auth').send('Logout exitoso');
    }).catch((error: any) => {
      console.error('Error:', error);
      res.status(500).send('Internal Server Error');
    });
  }).catch((error: any) => {
    console.error('Error encontrando al usuario:', error);
    res.status(500).send('Internal Server Error');
  });} catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

//search logged user
app.get('/user', (req: Request, res: Response) => {
  try {
    const token = req.cookies.auth;
    if (!token) {
      return res.status(401).send('No estás logueado');
    }
    console.log(token);
    User.findByToken(token)
      .then((user: IUser | null) => {

        if (!user) {
          return res.status(404).send('Usuario no encontrado');
        }
        res.send(user);
      })
      .catch((error: any) => {

        res.status(500).send('Internal Server Error');
      });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});


//list all users
app.get('/users', (req:Request, res:Response) => {
  User.find().then((users:IUser[]) => {
    res.send(users);
  }).catch((error: any) => {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  });
});

//Listening
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
export default app;