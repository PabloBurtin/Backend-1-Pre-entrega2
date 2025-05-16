import express from "express";
import { getCartById, createCart, addProductToCart, deleteProductFromCart, updateCart, updateProductQuantity,emptyCart } from "../controllers/cart.controller.js";

const cartRouter = express.Router();

cartRouter.post ("/", createCart);
cartRouter.get ("/:cid", getCartById);
cartRouter.post ("/:cid/products/:pid", addProductToCart);
cartRouter.put ("/:cid", updateCart);
cartRouter.put('/:cid/products/:pid', updateProductQuantity);
cartRouter.delete('/:cid/products/:pid', deleteProductFromCart);
cartRouter.delete('/:cid', emptyCart)


export default cartRouter;