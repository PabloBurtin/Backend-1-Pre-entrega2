import express from "express";
import dotenv from 'dotenv';
import mongoose from "mongoose";

//Importación de rutas
import productsRouter from "./routes/products.router.js";
import cartRouter from "./routes/cart.router.js";
import viewsRouter from "./routes/views.router.js";
import sessionRouter from "./routes/session.router.js"
import usersRouter from "./routes/users.router.js";

import { engine } from "express-handlebars";
import { Server } from "socket.io";
import http from "http";
import Product from "./models/product.model.js";
import hbs from "express-handlebars"
import config from "./config/index.js";
import passport from "passport"
import session from "express-session"
import cookieParser from "cookie-parser";
import initializedPassport from "./config/passport/config.js";



dotenv.config()

const { PORT, MONGO_URI, SECRET } = config;
const app = express();
const server = http.createServer(app);
const io = new Server(server);


app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(session({
    secret: SECRET, 
    saveUninitialized: true,
    resave: false,
    cookie: {
        secure: false,
        httpOnly: true,
        sameSite: true,
        maxAge: 60 * 60 * 1000
    }
}))

initializedPassport();
app.use(passport.initialize());
app.use(passport.session())

//Rutas
app.use("/", viewsRouter);
app.use("/api/users", usersRouter)
app.use("/api/session", sessionRouter)
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);


app.engine("handlebars", hbs.engine());
app.set("views", import.meta.dirname + "/views");
app.set("view engine", "handlebars");



io.on("connection", (socket)=> {
  // console.log("Nuevo usuario conectado");

  socket.on("newProduct", async(productData)=> {
    try {
      const newProduct = new  Product (productData);
      await newProduct.save()
    
      const products = await Product.find().lean();
      io.emit("productAdded", newProduct);
    } catch (error) {
      socket.emit('Error', {message: error.message});
    }
  });

    socket.on('delete-product', async (productId) => {
    try {
      await Product.findByIdAndDelete(productId);
      const products = await Product.find().lean();
      io.emit('products', products);
    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });


  socket.on('request-products', async () => {
    try {
      const products = await Product.find().lean();
      socket.emit('products', products);
    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });

});

server.listen(PORT, ()=> console.log(`Servidor iniciado en: http://localhost:${PORT}`) );

mongoose.connect(MONGO_URI)
  .then (()=> console.log("MongoDB connected succesfully"))
  .catch((error)=>{
    console.error({error: err.message})
    process.exit(1)
  })