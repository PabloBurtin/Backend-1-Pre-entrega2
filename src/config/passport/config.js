import passport from "passport";
import { registerLocal, loginLocal } from "./local.strategy.js"
import User from "../../models/user.model.js";

const initializedPassport = () => {
    //Estrategias
    passport.use("login", loginLocal)
    passport.use("register", registerLocal)
    
    //Serealización del usuario

    passport.serializeUser((user, done)=> {
        done(null, user.id)
    });

    passport.deserializeUser(async (id, done)=> {
        const user = await User.findById(id);
        delete user.password;
        done(null, user)
    })
}

export default initializedPassport