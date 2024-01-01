const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");

const router = require("express").Router();
const Order = require("../models/Order");

//Create order
router.post("/createorder", verifyToken, async (req, res) => {
    const newOrder = new Order(req.body);

    try {
        const savedOrder = await newOrder.save();
        res.status(200).json(savedOrder);
    }catch (err) {
        res.status(500).json({err});
    }
});

//Update order
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {

    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {new: true});
        res.status(200).json(updatedOrder);
    }catch (err) {
        res.status(500).json({err});
    }
});

//Delete cart
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.status(200).json("Order has been deleted successfully");
    }catch (err) {
        res.status(500).json({err});
    } 
})

//Get USER orders
router.get("/find/:userIid", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const orders = await Order.find({userId: req.params.userId});
        res.status(200).json({orders});
    }catch (err) {
        res.status(500).json({err});
    } 
})

//Get all orders
router.get("/findall", verifyTokenAndAdmin, async (req, res) => {
    const qNew = req.query.new;
    try {
        let orders;
        if(qNew) orders = await Order.find.sort({createdAt: -1});   //.limit(5);
        else orders = await Order.find();
        res.status(200).json({orders});
    }catch (err) {
        res.status(500).json({err});
    } 
})

//Get user stats
router.get("/incomestats", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const lastPreviousMonth = new Date(new Date(date.setMonth(lastMonth.getMonth() - 1)));
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
    try {
        const income = await Order.aggregate([
            {$match: {createdAt: {$gte: lastPreviousMonth}}}, //gte -> greater than
            {$project: {month: {$month: "$createdAt"}, sales: "$amount,"}},
            {$group: {_id: "$month", total: {$sum: "$sales"}}}
        ])
        res.status(200).json({income});
    }catch (err) {
        res.status(500).json({err});
    } 
})

module.exports = router;