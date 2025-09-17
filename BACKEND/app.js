import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/config/mongo.config.js";
import short_url from "./src/routes/short_url.route.js";
import authRoutes from "./src/routes/auth.route.js";
dotenv.config();
import { redirectFromShortUrl } from "./src/controller/short_url.controller.js";
import { errorHandler } from "./src/utils/errorHandler.js";
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

//url creation (short url created)
app.use("/api/create", short_url);

// auth
app.use("/api/auth", authRoutes);

//redirect to url
app.get("/:id", redirectFromShortUrl);

//error handler
app.use(errorHandler);

app.listen(3000,()=>{
    connectDB();
    console.log("server is running on http://localhost:3000");
})