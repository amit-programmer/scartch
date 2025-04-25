const express = require("express");
const router = express.Router();
const isLoggedin = require("../middlewares/isLoggedin");
const flash = require("connect-flash");
const productModel = require("../models/product-model");
const userModel = require("../models/user-model");
const methodOverride = require("method-override");


// const flash = require("express-flash");
// const session = require("express-session");



// router.use(flash());

// router.use((req, res, next) => {

//     next();
// });


router.use(methodOverride("_method"));


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
        bill: Number(item.price) - Number(item.discount)
    }));
const cart = user.cart.forEach((product)=>{
     const total =  Number(product.price + 20) - Number(product.discount)
     return total
    
})
  
    res.render("cart", { user, cartItems ,cart});
});

router.get("/addtocart/:id", isLoggedin, async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email });
    user.cart.push(req.params.id);
    await user.save();
    // console.log("Product ID added to cart:", req.params.id);
    // console.log("Updated cart:", user.cart);
    req.flash("success", "Product added to cart");
    res.redirect("/shop");
});

router.delete("/cart/delete/:id", isLoggedin, async (req, res) => {
    try {
        let user = await userModel.findOne({ email: req.user.email });

        // Remove the product from the cart
        user.cart = user.cart.filter(item => item.toString() !== req.params.id);

        await user.save(); // Save changes

         req.flash("success", "Product removed from cart");
        // res.locals.messages = flash;
        res.redirect("/cart", {success});
    } catch (error) {
        console.error("Error deleting item:", error);
        res.redirect("/cart");
    }
});




module.exports = router;
