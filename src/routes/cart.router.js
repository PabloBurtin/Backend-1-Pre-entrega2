import express from "express";
import { getCartById, createCart, addProductToCart, deleteProductFromCart, updateCart, updateProductQuantity,emptyCart, deleteCartByUser } from "../controllers/cart.controller.js";
import passport from "passport";

const cartRouter = express.Router();

cartRouter.post ("/", 
    passport.authenticate('session'),
        createCart);

cartRouter.get ("/:cid", getCartById);
cartRouter.post ("/:cid/products/:pid",addProductToCart);
cartRouter.put ("/:cid", updateCart);
cartRouter.put('/:cid/products/:pid', updateProductQuantity);
cartRouter.delete('/:cid/products/:pid', deleteProductFromCart);
cartRouter.delete('/:cid', emptyCart)
cartRouter.delete('/delete/:uid', deleteCartByUser)


export default cartRouter;