import express from "express";
import productsRouter from "./routes/products.router.js";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from 'dotenv'
import mongoose from "mongoose";
import cartRouter from "./routes/cart.router.js";
import viewsRouter from "./routes/views.router.js";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import http from "http";
import connectMongoDB from "./config/db.js";
import Product from "./models/product.model.js";

dotenv.config()

const app = express();
const server = http.createServer(app);
const io = new Server(server);




app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", './src/views');


const PORT = process.env.PORT;
app.use(express.json());
app.use(express.static("public"));

connectMongoDB ();

app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);
app.use("/", viewsRouter);


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