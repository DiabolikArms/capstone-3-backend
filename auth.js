const jwt = require("jsonwebtoken");
const User = require("./models/User");
const secret = "E-Commerce API";

module.exports.createAccessToken = (user) => {
	const data = {
		id: user._id,
		email: user.email,
		isAdmin: user.isAdmin
	};
	return jwt.sign(data, secret, {});
};

module.exports.verify = (req, res, next) => {
	let token = req.headers.authorization
	if(typeof token != "undefined"){
		token = token.slice(7, token.length)
		return jwt.verify(token, secret, (err, data) => {
			if(err){
				return res.send({ auth: "User not defined" });
			} else {
				next()
			}
		})
	} else {
		return res.send({ auth: "Invalid Token" });
	};
};

module.exports.decode = (token) => {
	if(typeof token != "undefined"){
		token = token.slice(7, token.length);
		return jwt.verify(token, secret, (err, data) => {
			if(err){
				return null;
			} else {
				return jwt.decode(token, { complete: true }).payload;
			};
		})
	} else {
		return null;
	}
}