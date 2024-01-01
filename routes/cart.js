const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");

const router = require("express").Router();
const Cart = require("../models/Cart");

//Create cart
router.post("/createcart", verifyToken, async (req, res) => {
    const newCart = new Cart(req.body);

    try {
        const savedCart = await newCart.save();
        res.status(200).json(savedCart);
    }catch (err) {
        res.status(500).json({err});
    }
});

//Update cart
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {

    try {
        const updatedCart = await Cart.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {new: true});
        res.status(200).json(updatedCart);
    }catch (err) {
        res.status(500).json({err});
    }
});

//Delete cart
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        await Cart.findByIdAndDelete(req.params.id);
        res.status(200).json("Cart has been deleted successfully");
    }catch (err) {
        res.status(500).json({err});
    } 
})

//Get USER cart
router.get("/find/:userIid", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const cart = await Cart.findOne({userId: req.params.userId});
        res.status(200).json({cart});
    }catch (err) {
        res.status(500).json({err});
    } 
})

//Get all
router.get("/findall", verifyTokenAndAdmin, async (req, res) => {
    const qNew = req.query.new;
    try {
        let carts
        if(qNew) carts = await Cart.find.sort({createdAt: -1});   //.limit(5);
        else carts = await Cart.find();
        res.status(200).json({carts});
    }catch (err) {
        res.status(500).json({err});
    } 
})

module.exports = router;