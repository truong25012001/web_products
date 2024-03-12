const User = require("../../model/user.model");

module.exports.infoUser = async (req, res, next) => {
	if (req.cookies.tokenUser) {
		const user = await User.findOne({
			tokenUser: req.cookies.tokenUser,
			deleted: false,
			status: "active"
		}).select("-password");

		if (user) {
			res.locals.user = user;
		}
		console.log(req.cookies.tokenUser);
		console.log(user);
	}

	

	

	next();
}