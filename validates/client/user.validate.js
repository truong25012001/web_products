module.exports.registerPost = (req, res, next) => {
	if(!req.body.fullName) {
		req.flash("error", "Vui lòng nhập họ tên");
		res.redidect("back");
		return;
	}

	if(!req.body.password) {
		req.flash("error", "Vui lòng nhập mật khẩu");
		res.redidect("back");
		return;
	}
	if(!req.body.email) {
		req.flash("error", "Vui lòng nhập email");
		res.redidect("back");
		return;
	}
	next();
}

module.exports.loginPost = (req, res, next) => {

	if(!req.body.password) {
		req.flash("error", "Vui lòng nhập mật khẩu");
		res.redidect("back");
		return;
	}
	if(!req.body.email) {
		req.flash("error", "Vui lòng nhập email");
		res.redidect("back");
		return;
	}
	next();
}

module.exports.forgotPasswordPost = (req, res, next) => {

	if(!req.body.email) {
		req.flash("error", "Vui lòng nhập email");
		res.redidect("back");
		return;
	}
	next();
}

module.exports.resetPasswordPost = (req, res, next) => {

	if(!req.body.password) {
		req.flash("error", "Vui lòng nhập password");
		res.redidect("back");
		return;
	}

	if(!req.body.confirmPassword) {
		req.flash("error", "Vui lòng nhập xác nhận mật khẩu");
		res.redidect("back");
		return;
	}

	if (req.body.password !== req.body.confirmPassword) {
		req.flash("error", `Mật khẩu không khớp!`);
		res.redirect("back");
		return;
	}
	next();
}