const jwt = require("jsonwebtoken")

const gentoken = (user)=>{
return jwt.sign({email:user.email, id:user._id}, process.env.JWT_KEY);
}
const gentoken2 = (user)=>{
return jwt.sign({email:user.email, id:user._id}, process.env.JWT_KEY2);
}

module.exports.gentoken = gentoken;
module.exports.gentoken2 = gentoken2;