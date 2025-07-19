import { Router } from "express";
import passport from "passport"

const router = Router();

router.post ("/login", passport.authenticate("login", {successRedirect: "/products", failureRedirect:"/failed"}));

router.post ("/register", passport.authenticate("register", {successRedirect:"/login", failureRedirect:"/failed"}));

router.post ("logout", (req, res)=>{
    req.logut(err=> {
        if (err) {
            console.error (err);
            return res.status(500).json({fatal_error: "view console"})
        }
        return res.redirect("/")
    })
});

export default router