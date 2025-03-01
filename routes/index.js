const express = require("express");
const router = express.Router();
const isLoggedin = require("../middlewares/isLoggedin");
const flash = require("connect-flash");
const productModel = require("../models/product-model");
const userModel = require("../models/user-model");

router.get("/", (req, res) => {
    const error = req.flash("error");
    const success = req.flash("success");
    res.render("index", { error, success, loggedin: false });
});

router.get("/shop", isLoggedin, async (req, res) => {
    let products = await productModel.find();
    let success = req.flash("success");
    res.render("shop", { products, success });
});

router.get("/account", isLoggedin, async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email });
    const error = req.flash("error");
    const success = req.flash("success");
    res.render("account", { user, error, success });
});

router.get("/cart", isLoggedin, async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email }).populate("cart");

    // Check if the cart is empty
    if (!user.cart || user.cart.length === 0) {
        return res.render("cart", { user, bill: 0, cartItems: [] });
    }

    // Calculate bill for each item in the cart
    let cartItems = user.cart.map(item => ({
        ...item._doc,
        bill: Number(item.price + 20) - Number(item.discount)
    }));

    res.render("cart", { user, bill: 0, cartItems });
});

router.get("/addtocart/:id", isLoggedin, async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email });
    user.cart.push(req.params.id);
    await user.save();
    console.log("Product ID added to cart:", req.params.id);
    console.log("Updated cart:", user.cart);
    req.flash("success", "Product added to cart");
    res.redirect("/shop");
});

module.exports = router;
