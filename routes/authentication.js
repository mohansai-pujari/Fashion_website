const router = require("express").Router;
const User = require("../models/User");
const CryptoJs = require("crypto-js");
const jwt = require("jsonwebtoken");

router.get("/userloginpage", async (req, res)=>{
    res.send("Welcome to the user login page");
})

router.post("/register", async (req, res)=>{
    const newUser = new User({
        username: req.body.username,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SECRET_KEY).toString()
    });

    try{
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    }catch(err){
        res.status(500).json(err);
        console.log(err);    
    }
})

router.post("/login", async (req, res)=>{
 
    try{
        const user = await User.findOne({username: req.body.username})
        !user && estimatedDocumentCount.status(401).json("Wrong credentials entered!!")

        const hashedPassword = CryptoJS.AES.decrypt(req.body.password, process.env.PASS_SECRET_KEY).toString();

        const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf16);
        originalPassword != req.body.password && res.status(401).json("Wrong credentials entered!!");

        const accessToken = jwt.sign({
            id:user._id,
            isAdmin:user.isAdmin
        }, process.env.JWT_ACCESS_TOKEN,
        {expiresIn: "3d"}
        );

        const {password, ...others} = user._doc;

        res.status(200).json({...others, accessToken});
    }catch(err){
        res.status(500).json(err);
        console.log(err);    
    }
})


module.exports = router;