const Account = require("../../model/account.model");
const systemConfig = require("../../config/system");
var md5 = require('md5');
const Role = require("../../model/roles.model");
// [GET] /admin/accounts

module.exports.index = async (req, res) => {
	let find = {
		deleted: false
	}

	const records = await Account.find(find).select("-password -token");
	for (const record of records) {
		const role = await Role.findOne({
			_id: record.role_id,
			deleted: false
		});
		record.role = role;
	}

	res.render("admin/pages/accounts/index", {
		pageTitle: "Danh sách tài khoản",
		records: records
	});
}

// [GET] /admin/accounts/create
module.exports.create = async (req, res) => {
	const role = await Role.find({
		deleted: false
	})
	res.render("admin/pages/accounts/create", {
		roles: role,
		pageTitle: "Tạo mới tài khoản",
	});
}

// [POST] /admin/acounts/create
module.exports.createPost = async (req, res) => {
	const checkMail = await Account.findOne({
		deleted: false,
		email: req.body.email
	});

	if (checkMail) {
		req.flash("error", `Email ${req.body.email} đã tồn tại!`)
		res.redirect("back");
	} else {
		req.body.password = md5(req.body.password);
		const record = new Account(req.body);
		await record.save();
		res.redirect(`${systemConfig.prefixAdmin}/accounts`);
	}


}

module.exports.edit = async (req, res) => {
	let find = {
		deleted: false
	}

	const records = await Account.find(find).select("-password -token");
	for (const record of records) {
		const role = await Role.findOne({
			_id: record.role_id,
			deleted: false
		});
		record.role = role;
	}

	res.render("admin/pages/accounts/index", {
		pageTitle: "Danh sách tài khoản",
		records: records
	});
}

// [GET] admin/accounts/edit/:id

module.exports.edit = async (req, res) => {
	const id = req.params.id;
	let find = {
		_id: id,
		deleted: false
	}
	try {
		const data = await Account.findOne(find);
		const role = await Role.find({
			deleted: false
		})
		res.render("admin/pages/accounts/edit", {
			data: data,
			roles: role,
			pageTitle: "Chỉnh sửa tài khoản"
		})
	} catch (error) {
		res.redirect(`${systemConfig.prefixAdmin}/accounts`);
	}
}

// [PATCH] /admin/accounts/edit/:id
module.exports.editPatch = async (req, res) => {
	const id = req.params.id;
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
