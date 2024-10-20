import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import express from "express";
import dotenv from "dotenv";
dotenv.config()
import mongoose from "mongoose";
 mongoose.set('strictQuery', false);
import bodyParser from "body-parser";
import ejs from "ejs";
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

import userRoutes from './routes/userRoutes.js';
const PORT = process.env.PORT || 5000;
dotenv.config({ path: './env' });
import path from "path";
const __dirname = path.resolve();
const static_path = path.join(__dirname, "../page");

app.use(express.static(static_path));

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("db connected successfully")).catch((err) => console.log("db is not connected", err));

// //Pages
// app.get("/", (req, res) => {
//   res.sendFile(__dirname + '/page/login.html')
// });

// app.get("/welcome", (req, res) => {
//   res.sendFile(__dirname + '/page/welcome.html')
// })

// app.get("/reg", (req, res) => {
//   res.sendFile(__dirname + '/page/reg.html')
// })


// app.get("/resetPasswordEmail", (req, res) => {
//   res.sendFile(__dirname + '/page/resetPasswordEmail.html')
// })

// app.get("/userPasswordReset/:id/:token", (req, res) => {
//   res.sendFile(__dirname + '/page/userPasswordReset.html')
// })

// const corsOptions = {
//   origin: 'http://localhost:3000',
//   optionsSuccessStatus: 200, 
// };

// app.use(cors(corsOptions));


app.use(express.json());
app.use(express.urlencoded({ extended: false }))

app.use("/api/user", userRoutes);

app.listen(PORT, () => console.log(`server up and running at ${PORT}`));


