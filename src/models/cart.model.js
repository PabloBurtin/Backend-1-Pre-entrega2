import mongoose from "mongoose";

const cartSchema = new mongoose.Schema ({
    products: {
        type : [
            {
                product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
                quantity: { type: Number, default: 1, min: 1 }
            }
        ],
        default: []
    },
    createdAt: { type: Date, default: Date.now}
})

const Cart = mongoose.model("Cart", cartSchema)

export default Cart