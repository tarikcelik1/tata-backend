import express from "express";
import morgan from "morgan";
import { checkSchema } from "express-validator";
import { protect } from "./modules/aut";
import { createNewUser, getUser, getUserEmail, signin, updateUser2 } from "./handlers/user";
import { handleInputError } from "./modules/middleware";
import { validatorForUser, validatorSign } from "./modules/validationSchemas";
import cors from "cors";
import router from "./router";
import multer from "multer";
import { Server } from "socket.io";
import http from "http";

const app = express();
const corsOptions = {
  origin: true, // Allow all origins
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // Enable cookies and HTTP authentication if needed
  optionsSuccessStatus: 204, // HTTP status code to respond with for preflight requests
};
app.use(cors(corsOptions));


app.use(morgan("dev"));
var bodyParser = require("body-parser");
app.use(bodyParser.json({ limit: "20mb" }));
app.use(bodyParser.urlencoded({ limit: "20mb", extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "'Welcome to Tata-API'" });
});

//app.post('/createUser',checkSchema(validatorForUser),handleInputError,createNewUser)
app.post("/createUser", createNewUser);
app.post("/signin", checkSchema(validatorSign), handleInputError, signin);
app.use("/api", protect, router);
app.put('/updateUser2/:id', updateUser2);
app.get('/getUserEmail/:id', getUserEmail);
export default app;
