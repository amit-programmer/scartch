const express = require('express');
const router = express.Router();
const ownerModel = require('../models/onwer-model');
const flash = require('connect-flash');
const { ownerlogin, ownerregister, ownerlogout, owner } = require('../controllers/ownerauth');
const ownerlogged = require("../middlewares/ownerlogged")

if (process.env.NODE_ENV === "development") {
    router.post("/create", async function (req, res) {
        try {
            let owner = await ownerModel.find();
            if (owner.length > 0) {
                return res.status(501).send("You don't have permission to create owner");
            }
            let { fullname, email, password, image, Gst } = req.body;
            let createdOwner = await ownerModel.create({
                fullname,
                email,
                password,
                image,
                Gst
            });
            res.status(201).send(createdOwner);
        } catch (err) {
            res.status(500).send("Internal Server Error");
        }
    });
}

router.get("/admin", function (req, res) {
    let success = req.flash("success");
    res.render("createproducts", { success });
});

router.get("/ownerregister", function (req, res) {
    res.render("ownerindex");
});

router.get("/ownerlogin", function (req, res) {
    res.render("owner-login");
});

router.get("/owner",ownerlogged, owner);
router.post("/ownerlogin", ownerlogin);
router.post("/ownerregister", ownerregister);
router.get("/ownerlogout", ownerlogout);

module.exports = router;
