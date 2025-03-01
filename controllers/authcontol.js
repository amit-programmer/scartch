const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { gentoken } = require("../utils/gentoken");
const flash = require("connect-flash");

module.exports.registerUser = async (req, res) => {
    try {
        let { fullname, email, password } = req.body;

        let user = await userModel.findOne({ email: email });
        if (user) {
            req.flash("error", "You already have an account, please login.");
            return res.redirect("/");
        }

        // Function to check if any field is missing
        function isValidInput(fullname, email, password) {
            return fullname && email && password;
        }

        if (!isValidInput(fullname, email, password)) {
             req.flash("error" ,"All fields are required" );
            return res.redirect("/");
        }

        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(password, salt, async function (err, hash) {
                if (err) return res.send(err.message);
                else {
                    let user = await userModel.create({
                        fullname,
                        email,
                        password: hash
                    });
                    let token = gentoken(user);
                    res.cookie("token", token);
                    req.flash("success", "User is created");
                    res.redirect("/");
                }
            });
        });
    } catch (err) {
        res.send(err.message);
    }
};

module.exports.loginUser = async (req, res) => {
    let { email, password } = req.body;

    let user = await userModel.findOne({ email: email });
    if (!user) {
        req.flash("error", "Invalid email or password");
        return res.redirect("/");
    }

    let isPasswordValid = await bcrypt.compare(password, user.password, function (err, result) {
        if (result) {
            let token = gentoken(user);
            res.cookie("token", token);
            res.redirect("/shop");
        } else {
            req.flash("error", "Invalid email or password");
            return res.redirect("/");
        }
    });
};

module.exports.logout = async (req, res) => {
    res.clearCookie("token");
    res.redirect("/");
};
