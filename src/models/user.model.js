import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },

    last_name:{
        type: String,
        required: true
    },
    age: Number,
    email: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    password:{
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["USER", "ADMIN", "PREMIUM", "GUEST"],
        default: "USER"
    },
    cartId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cart'
  }
})

const userModel = mongoose.model ("users", userSchema)

export default userModel