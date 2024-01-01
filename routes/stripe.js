const router = require("express").Router();

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

router.post("/payment", async (req, res) => {
    stripe.charges.create({
        source: req.body.tokenId,
        amount: req.body.amount,
        currency: "INR"
    }, (stripeErr, stripeRes) => {
        if(stripeErr) res.status(500).send(stripeErr);
        else res.status(200).send(stripeRes);
    })
})

module.exports = router;