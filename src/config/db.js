import mongoose from "mongoose";
import dotenv from "dotenv";
import '../models/user.model.js';
import '../models/cart.model.js';
import '../models/product.model.js';


dotenv.config();

const connectMongoDB = async() => {
    try {
        await mongoose.connect(process.env.URI_MONGODB);
        console.log ("Conectado con MongoDB")
    }catch (error)
    {
        console.error("Error al conectar con MongoDB")
    }
}

export default connectMongoDB