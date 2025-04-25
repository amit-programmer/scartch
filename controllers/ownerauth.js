const ownerModel = require("../models/onwer-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { gentoken2 } = require("../utils/gentoken");
const flash = require("connect-flash");

const isValidInput = (fields) => {
    return fields.every(field => field);
};

const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

module.exports.ownerlogout = async (req, res) => {
    res.clearCookie("token");
    res.redirect("/owners/ownerlogin");
};

module.exports.ownerlogin = async (req, res) => {
    let { email, password } = req.body;

    if (!isValidInput([email, password])) {
        req.flash("error", "All fields are required");
        return res.redirect("/owners/ownerlogin");
    }

    let user = await ownerModel.findOne({ email });
    if (!user) {
        req.flash("error", "Invalid email or password");
        return res.redirect("/owners/ownerlogin");
    }

    let isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
        let token = gentoken2(user);
        res.cookie("token", token);
        res.redirect("/owners/owner"); // Redirect to owner.ejs page after successful login
    } else {
        req.flash("error", "Invalid email or password");
        res.redirect("/owners/ownerlogin");
    }
};

module.exports.ownerregister = async (req, res) => {
    try {
        let { fullname, email, password, image, Gst } = req.body;

        if (!isValidInput([fullname, email, password, image, Gst])) {
            req.flash("error", "All fields are required");
            return res.redirect("/owners/ownerlogin");
        }

        let user = await ownerModel.findOne({ email });
        if (user) {
            req.flash("error", "You already have an account, please login.");
            return res.redirect("/owners/ownerlogin");
        }

        const hashedPassword = await hashPassword(password);
        let newUser = await ownerModel.create({
            fullname,
            email,
            password: hashedPassword,
            image,
            Gst
        });

        let token = gentoken2(newUser);
        res.cookie("token", token);
        req.flash("success", "User is created");
        res.redirect("/owners/ownerlogin");
    } catch (err) {
        res.send(err.message);
    }
};

module.exports.owner = async (req, res) => {
    try {
        const token = req.cookies.token;
        const decoded = jwt.verify(token, process.env.JWT_KEY2);
        const owner = await ownerModel.findById(decoded.id);
        res.render("owner", { owner });
    } catch (err) {
        res.redirect("/owners/ownerlogin");
    }
};
