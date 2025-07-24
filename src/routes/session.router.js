import { Router } from "express";
import passport from "passport"
import { generateToken, verifySign } from "../utils/jwt.js";


const router = Router();

router.post ("/login", (req, res)=>{
    try{
        const access_token = generateToken(req.user);

        res.cookie('access_token', access_token, {
            httpOnly: true,
            maxAge: 60 * 60 * 1000
        });
        res.redirect('/products')
    }catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error al generar token"})
    }
});

router.post ("/register",  (req, res)=>{
    try{
        const access_token = generateToken(req.user);

        res.cookie('access_token', access_token, {
            httpOnly: true,
        })
        res.redirect('/login')
        
    }catch (error){
        console.error(error);
        res.status(500).json({ success: false, message: "Error al general el token" })

    }
});

router.post ("logout", (req, res)=>{
    req.logout(err=> {
        res.clearCookie('access_token');
        res.json({ succes: true, message: "Sesión cerrada correctamente"})
    })
});

router.get("/api/session/current", ()=>{})

router.get("/products", passport.authenticate("jwt", {session: false }), (req, res) =>
{
    if(req.user) {
        res.redirect("/session/products")
    }else{
        res.status(401).json({ error: "No esta autorizado. Ingrese su usuario y contraseña"})
    }

    
} )

export default router