import Cart from "../models/cart.model.js";

const getCartById = async (req, res) => {
    try{
        const cart = Cart.findById(req.params.cid).populate('products.product');
        if(!cart) return res.status(404).json({status: 'error', message: "No se encontro el carrito"});
        res.status(200).json({status: 'success', payload: cart});
    }catch(error){
        res.status(500).json({status: 'error', message: error.message});
    }
}

const createCart = async (req, res) => {
      try{
        const newCart = new Cart ({products: []})
        const saved = await newCart.save();
        res.status(201).json({status: 'success', payload: saved})
    }catch(error){
        res.status(500).json({status: 'error', message: error.message});
    }
}

const addProducToCart = async (req, res) =>{
    const {cid, pid} = req.params;
    try{
        const cart = await Cart.findById(cid);
        if(!cart) return res.status(404).json({status: 'error', message: 'El carrito no existe'});
        const existing = cart.products.find (p => p.product.toString() === pid);
        if (existing){
            existing.quantity +=1;
        } else {
            cart.products.push({product: pid, quantity: 1})
        }

        await cart.save();
        res.status(201).json({status: 'success', payload: cart})
    }catch(error){
        res.status(500).json({status: 'error', message: error.message});
    }
}

const deleteProductFromCart = async (req, res)=>{
    const {cid, pid}=req.params
    try{
        const cart =await Cart.findById(cid);
        if(!cart) return res.status(404).json({status: 'error', message: 'El carrito no existe'});

        cart.products = cart.products.filter(p => p.product.toString() !==pid);
        await cart.save();
        res.status(200).json({status: 'success', message: 'Producto retirado'})
    }catch(error){
        res.status(500).json({status: 'error', message: error.message});
    }
}

const updateCart = async (req,res) =>{
       const {cid}=req.params
    try{
        const cart =await Cart.findById(cid);
        if(!cart) return res.status(404).json({status: 'error', message: 'El carrito no existe'});

        cart.products = req.body.product;
        await cart.save();
        res.status(200).json({status: 'success', payload: cart})
    }catch(error){
        res.status(500).json({status: 'error', message: error.message});
    }
}

const updateProductQuantity = async (req, res) => {
       const {cid, pid}=req.params
       const {quantity} = req.body
    try{
        const cart =await Cart.findById(cid);
        if(!cart) return res.status(404).json({status: 'error', message: 'El carrito no existe'});

        const product = cart.products.find (p => p.product.toString() === pid)
        if (!product) return res.status(404).json({status: 'error', message: 'El producto no existe en el carrito'})
        product.quantity = quantity
        await cart.save();
        res.status(200).json({status: 'success', payload: cart})
    }catch(error){
        res.status(500).json({status: 'error', message: error.message});
    }
}

const emptyCart = async (req, res) => {
    try{
        const cart =await Cart.findById(req.params.cid);
        if(!cart) return res.status(404).json({status: 'error', message: 'El carrito no existe'});

        cart.products = []
        await cart.save();
        res.status(200).json({status: 'success', message:'Se vacio el carrito'})
    }catch(error){
        res.status(500).json({status: 'error', message: error.message});
    }
}

export {getCartById, createCart, addProducToCart, deleteProductFromCart, updateCart, updateProductQuantity, emptyCart}