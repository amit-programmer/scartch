const express = require('express');
const router = express.Router();
const upload = require("../config/multer-config");
const productModel = require("../models/product-model");
const flash = require("connect-flash");

router.post("/create", upload.single("image"), async function (req, res) {
    try {
        let { name, price, discount, bgcolor, panelcolor, textcolor } = req.body;

        let product = await productModel.create({
            image: req.file.buffer, // Save image in buffer format
            name,
            price,
            discount,
            bgcolor,
            panelcolor,
            textcolor
        });

        req.flash("success", "Product Created Successfully"); // ✅ Correct way
        
        res.redirect("/owners/admin"); // ✅ Redirect after setting flash
    } catch (err) {
        req.flash("error", "Internal Server Error");
        res.redirect("/owners/admin");
    }
});

module.exports = router;
