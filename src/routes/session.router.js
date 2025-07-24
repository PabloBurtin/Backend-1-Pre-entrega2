import { Router } from "express";
import passport from "passport"
import { generateToken, verifySign } from "../utils/jwt.js";


const router = Router();

router.post ("/login", (req, res, next)=>{
    passport.authenticate("login", { session: false }, (err, user, info) => {
        if (err) {
            return res.status(500).redirect('/login?error=server_error');
        }
        if (!user) {
            return res.status(401).redirect('/login?error=invalid_credentials');
        }
        
        // Generar token JWT
        const access_token = generateToken(user);
        
        // Configurar cookie
        res.cookie('access_token', access_token, {
            httpOnly: true,
            maxAge: 3600000
        });
        
        return res.redirect('/products');
    })(req, res, next);
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

router.get("/logout", (req, res) => {
    res.clearCookie('access_token');
    res.redirect('/login');
});

router.get("/current", passport.authenticate("jwt", { session: false }), (req, res) => {
    res.json({ user: req.user });
});

export default router