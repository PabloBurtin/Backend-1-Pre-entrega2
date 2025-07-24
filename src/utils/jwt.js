import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import config from "../config/index.js";

dotenv.config();

const {PRIVATE_KEY} = config

export const generateToken = user => {
    const token = jwt.sign({ user }, PRIVATE_KEY)
    return token
}

export const verifySign = (token) => {
 try{
    const credentials = jwt.verify (token, PRIVATE_KEY)
    return credentials
 } catch (error){
    console.error("Invalid signature")
    return null
 }
}

