import express from "express";
import Product from "../models/product.model.js";
import Cart from "../models/cart.model.js";

const viewsRouter = express.Router();

viewsRouter.get ('/', async (req, res)=>{
  try{
    const products = await Product.find().lean();
    res.render('home', { products })
  }catch(error){
    res.status(500).send({message: 'Error al cargar la pagina'})
  }
})

viewsRouter.get ('/products', async (req, res) => {
  try{
    const {limit = 10, page = 1, sort, query} = req.query;

    const filter = query
    ? {$or : [{category: query}, {status: query === "true"}]}:{};

    const sortOption = sort === 'asc' ? {price: 1} : sort === 'desc' ? {price: -1}: {};

    const option = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: sortOption,
      lean: true
    };

    const result = await Product.paginate(filter, option);

    res.render ('index', {
      products: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage
    });
  }catch (error){
    res.status(500).send('Error en la carga de productos.')

  }
})

viewsRouter.get('/products/:pid', async (req, res)=>{
  try{
    const { pid } = req.params;
    const product = await Product.findById(pid).lean();
    if (!product) return res.status(404).send ('El producto no fue encontrado o no existe');
    res.render ('productDetail', {product});
  }catch(error){
    res.status(500).send('Error al cargar el producto');
  }
})

viewsRouter.get ('/carts/:cid', async (req,res)=>{
  try{
    const { cid } = req.params;
    const cart = await Cart.findById(cid).populate('products.product').lean();
    if (!cart) return res.status(404).send ('El carrito no fue encontrado o no existe');
    res.render ('cart', {cart});
  }catch(error){
    res.status(500).send('Error al cargar el carrito');
  }
})


viewsRouter.get("/realtimeproducts", async(req, res)=> {
  try{
    const products = await Product.find().lean();
    res.render("realTimeProducts", { products });
  }catch(error){
    res.status(500).send({ message: error.message });
  }
});

export default viewsRouter;