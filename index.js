const express = require("express");
const app = express();

const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const authRoute = require("./routes/authentication");
const userRoute = require("./routes/user");
const productRoute = require("./routes/product");
const orderRoute = require("./routes/order");
const cartRoute = require("./routes/cart");

mongoose.connect(process.env.MONGODB_CONNECT_URL).then(() => {
    console.log("Mongoose DB Connection successful")
}).catch((err) => {
    console.error("Couldn't connect to DB: ",err);
})

app.use(express.json());
app.use("/v1/users", userRoute);
app.use("/v1/auth", authRoute);
app.use("/v1/products", productRoute);
app.use("/v1/orders", orderRoute);
app.use("/v1/carts", cartRoute);

app.listen(process.env.PORT || 5006, () => {
    console.log("server started at port 5006");
})