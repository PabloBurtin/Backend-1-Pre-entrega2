import passport from "passport";
import { registerLocal, loginLocal } from "./local.strategy.js";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import User from "../../models/user.model.js";
import dotenv from "dotenv";
import config from "../index.js";

dotenv.config();

const {PRIVATE_KEY} = config


const initializedPassport = () => {
    //Estrategias
    passport.use("login", loginLocal)
    passport.use("register", registerLocal)
    passport.use("jwt", new JwtStrategy({
        secretOrKey: PRIVATE_KEY,
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor])
}, (payload, done) => {
    done(null, payload)
            }
        )
    )
    
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

function cookieExtractor(req){
    let token = null;
    if(req && req.cookies) {
        token = req.cookies['access_token'];
    }
    return token
}

export default initializedPassport