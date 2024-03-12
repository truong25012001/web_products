var md5 = require('md5');
const Account = require("../../model/account.model");

module.exports.index = async (req, res) => {
	res.render("admin/pages/my-account/index",{
		pageTitle: "Thông tin cá nhân"
	})
}
// [GET] /admin/my-account/edit
module.exports.edit = async (req, res) => {
	res.render("admin/pages/my-account/edit",{
		pageTitle: "Chỉnh sửa thông tin cá nhân"
	})
}
// [Patch] /admin/my-account/edit
module.exports.editPatch = async (req, res) => {
	const id = res.locals.user.id;
	const checkMail = await Account.findOne({
		_id: {$ne: id},
		email: req.body.email,
		deleted: false
	});
	if(checkMail) {
		req.flash("error", `Email ${checkMail.email} đã tồn tại`);
		res.redirect("back");
	} else {
		if(req.body.password) {
			req.body.password = md5(req.body.password);
		} else {
			delete req.body.password;
		}
		await Account.updateOne({_id: id}, req.body);
		req.flash("success", "Cập nhật tài khoản thành công");
		res.redirect("back");
	}
}