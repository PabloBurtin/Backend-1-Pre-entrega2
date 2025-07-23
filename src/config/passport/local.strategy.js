import { Strategy } from "passport-local";
import User from "../../models/user.model.js";
import { createHash, isValidPassword } from "../../utils/hash.js";

async function verifyRegister(req, username, password, done) {
    //logica de registro de usuario
    const { first_name, last_name, age, role } = req.body;
    try{
        const userFound = await User.findOne ({email: username })
        if (userFound) return done (null, false, { message: "El usuario ya existe"})
        const newUser ={
            first_name,
            last_name,
            age,
            role,
            password: createHash(password),
            email: username,
        };
        const newDoc = await User.create(newUser)
        return done (null, newDoc)
    }
    catch(error){
        console.error(error);
        return done ("Internal server error (view console)")
    }
}

async function verifyLogin(username, password, done) {
    try{
        const user = await User.findOne({ email: username })
        if (!user || !isValidPassword(user, password)) {
            return done (null, false, {message: "Usuario o contraseña incorrecta"})
        }
    }
    catch(error){
        console.error(error);
        return done ("Internal server error (view console)")
    }
}

export const registerLocal = new Strategy({ usernameField: "email", passReqToCallback: true}, verifyRegister )
export const loginLocal = new Strategy({ usernameField: "email"}, verifyLogin )