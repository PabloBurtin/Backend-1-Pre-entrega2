import express from "express";
import {getAllProducts, getProductById, createProduct, updatedProduct, deleteProduct} from "../controllers/product.controller.js";
import uploader from "../utils/uploader.js";

const productsRouter = express.Router();


productsRouter.get ("/", getAllProducts);

productsRouter.get("/:pid", getProductById);
    
productsRouter.post("/", uploader.single('thumbnail'), createProduct);
    
productsRouter.put("/:pid", updatedProduct);
    
productsRouter.delete("/:pid", deleteProduct);

    //endpoint para practicar aggregations
productsRouter.get ("/aggregations/example", async(req,res)=>{
      try{
        const response = await Product.aggregate([
          //1 - Traemos los productos que dentro del campo "description" contenga la palabra "moderno"
          { $match: { $text: {$search: "moderno"}}},
          // 2 -Traer lo productos que cuesten más de $60.000
          {$match: {price: {$gt: 60000}}},
          //3- Realizamos uina proyección para traer los datos que nos interesan
          {
            $project:{
              title: 1,
              description: 1,
              category: 1,
              price: 1
            }
          }
        ]);

        res.status(200).json({status: "success", payload: response})
      }
      catch (error) {
        res.status(404).json({ message: error.message });
      }
    })
    
    export default productsRouter;