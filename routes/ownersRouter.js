const express = require('express');
const router = express.Router();
const ownerModel = require('../models/onwer-model');
const flash = require('connect-flash');


if (process.env.NODE_ENV === "development") {
    router.post("/create", async function (req, res) {
        try {
            let owner = await ownerModel.find();
            if (owner.length > 0) {
                return res.status(501).send("You don't have permission to create owner");
            }
            let { fullname, email, password } = req.body;
            let createdOwner = await ownerModel.create({ 
                fullname,
                 email,
                  password 
                });
            res.status(201).send(createdOwner);
        } catch (err) {
            res.send(err.message);
            res.status(500).send("Internal Server Error");
        }
    });
}

router.get("/admin", function (req, res) {
    let success = req.flash("success");
 
    res.render("createproducts", {success });
});

module.exports = router;
