module.exports.createPost = (req, res, next) => {
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

module.exports.editPatch = (req, res, next) => {
	if(!req.body.fullName) {
		req.flash("error", "Vui lòng nhập họ tên");
		res.redirect("back");
		return;
	}
	
	if(!req.body.email) {
		req.flash("error", "Vui lòng nhập email");
		res.redirect("back");
		return;
	}
	next();
}