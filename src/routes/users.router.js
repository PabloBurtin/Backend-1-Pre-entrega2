import { Router } from "express";
import User from "../models/user.model.js";

const router = Router();

router.get("/", async (req, res)=>{
    res.json (await User.find())
})
router.get("/:id", async (req, res)=>{
    res.json (await User.findById(req.params.id))
})
router.delete("/:id", async (req, res)=>{
    res.json(await User.deleteOne({ _id:req.params.id }))
})
// router.update("/:id", async (req, res)=>{
//     res.json(await User.findByIdAndUpdate({ _id:req.params.id}))
// })


export default router