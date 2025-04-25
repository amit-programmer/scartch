const userModel = require("../models/user-model");
const ownerModel = require("../models/onwer-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { gentoken, gentoken2 } = require("../utils/gentoken");
const flash = require("connect-flash");

const isValidInput = (fields) => {
    return fields.every(field => field);
};

const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

module.exports.registerUser = async (req, res) => {
    try {
        let { fullname, email, password } = req.body;

        if (!isValidInput([fullname, email, password])) {
            req.flash("error", "All fields are required");
            return res.redirect("/");
        }

        let user = await userModel.findOne({ email });
        if (user) {
            req.flash("error", "You already have an account, please login.");
            return res.redirect("/");
        }

        const hashedPassword = await hashPassword(password);
        let newUser = await userModel.create({
            fullname,
            email,
            password: hashedPassword
        });

        let token = gentoken(newUser);
        res.cookie("token", token);
        req.flash("success", "User is created");
        res.redirect("/");
    } catch (err) {
        res.send(err.message);
    }
};

module.exports.loginUser = async (req, res) => {
    let { email, password } = req.body;

    if (!isValidInput([email, password])) {
        req.flash("error", "All fields are required");
        return res.redirect("/");
    }

    let user = await userModel.findOne({ email });
    if (!user) {
        req.flash("error", "Invalid email or password");
        return res.redirect("/");
    }

    let isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
        let token = gentoken(user);
        res.cookie("token", token);
        res.redirect("/shop");
    } else {
        req.flash("error", "Invalid email or password");
        res.redirect("/");
    }
};

module.exports.logout = async (req, res) => {
    res.clearCookie("token");
    res.redirect("/");
};
