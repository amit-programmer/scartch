const jwt = require("jsonwebtoken");
const ownerModel = require("../models/onwer-model");

module.exports = async function(req, res, next) {
    if (!req.cookies.token) {
        req.flash("error", "You are not logged in");
        return res.redirect("/owners/ownerlogin");
    }
    
    try {
        let decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY2);
        let owner = await ownerModel
            .findOne({ email: decoded.email })
            .select("-password");
        req.owner = owner;
        next();
    } catch (err) {
        req.flash("error", "You are not logged in");
        res.redirect("/owners/ownerlogin");
    }
};
