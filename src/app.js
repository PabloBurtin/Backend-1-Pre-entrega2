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


// io.on("connection", (socket)=> {
//   // console.log("Nuevo usuario conectado");

//   socket.on("newProduct", async(productData)=> {
//     try {
//       const newProduct = await productManager.addProduct(productData);

//       io.emit("productAdded", newProduct);
//     } catch (error) {
//       console.error("Error al añadir el producto");
//     }
//   });

// });

server.listen(PORT, ()=> console.log(`Servidor iniciado en: http://localhost:${PORT}`) );