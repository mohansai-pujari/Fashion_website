const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.token;
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_ACCESS_TOKEN, (err,user)=>{
            if(err) res.status(403).json("Token is not valid!");
            req.user = user;
            next();
        })
    } else {
        if(err) res.status(401).json("You are not authenticated!");
    }
}

const verifyTokenAndAuthorization = function(req, res, next) {
    verifyToken(req, res, ()=>{
        if (req.user == req.params.id || req.user.isAdmin) {
            next();
        } else {
            res.status(403).json("You are not allowed to access this account")
        }
    });
}

const verifyTokenAndAdmin = function(req, res, next) {
    verifyToken(req, res, ()=>{
        if (req.user.isAdmin) {
            next();
        } else {
            res.status(403).json("You are not admin");
        }
    });
}

module.exports = {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin}