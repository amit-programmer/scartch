const express = require("express")
const router = express.Router()
const {registerUser, loginUser, logout} = require("../controllers/authcontol")
// const {gentoken} = require("../utils/gentoken")

router.get("/", function(req, res){
    res.send("hey user")
})


router.post("/register", registerUser)

router.post("/login", loginUser)

router.get("/logout", logout )
module.exports = router;