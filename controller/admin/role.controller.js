const role = require("../../model/roles.model.js");
const systemConfig = require("../../config/system");

//[GET] /admin/roles/
module.exports.index = async (req, res) => {
	let find = {
		deleted: false
	}
	const records = await role.find(find);

	res.render("admin/pages/role/index", {
		pageTitle: 'Trang nhóm quyền',
		records: records
	})
}

//[GET] /admin/roles/create
module.exports.create = async (req, res) => {
	res.render("admin/pages/role/create", {
		pageTitle: "Thêm mới nhóm quyền"
	})
}

//[POST] /admin/roles/create
module.exports.createPost = async (req, res) => {
	const record = new role(req.body);
	await record.save();

	res.redirect(`${systemConfig.prefixAdmin}/roles`);
}

//[GET] /admin/roles/edit/:id
module.exports.edit = async (req, res) => {

	try {

		const id = req.params.id;
		let find = {
			_id: id,
			deleted: false,
			
		}
		
		const data = await role.findOne(find);
	
		res.render("admin/pages/role/edit", {
			pageTitle: "Sửa nhóm quyền",
			data: data
		})
	} catch (error) {
		console.log("ok");
		res.redirect(`${systemConfig.prefixAdmin}/roles`);
	}

	
}


//[GET] /admin/roles/create
module.exports.create = async (req, res) => {
	res.render("admin/pages/role/create", {
		pageTitle: "Thêm mới nhóm quyền"
	})
}

//[POST] /admin/roles/create
module.exports.createPost = async (req, res) => {
	const record = new role(req.body);
	await record.save();

	res.redirect(`${systemConfig.prefixAdmin}/roles`);
}

//[PATCH] /admin/roles/edit/:id
module.exports.editPatch = async (req, res) => {

	try {

		const id = req.params.id;

		await role.updateOne({_id: id}, req.body);
		req.flash("success", "Cập nhật nhóm quyền thành công !");


	} catch (error) {

		req.flash("error", "Cập nhật nhóm quyền thất bại!");
	}

	res.redirect("back");

	
}

//[GET] /admin/roles/permissions
module.exports.permissions = async (req, res) => {

	let find = {
		deleted:false,
	}

	const record = await role.find(find);

	res.render("admin/pages/role/permissions", {
		pageTitle: "Phân quyền",
		records: record
	});
}

//[PATCH] /admin/roles/permissions

module.exports.permissionsPatch = async (req, res) => {
	const permissions = JSON.parse(req.body.permissions);

	for (const item of permissions) {
		await role.updateOne({_id: item.id}, {permission: item.permissions});
	}
	req.flash("success", "Cập nhật phân quyền thành công");
	res.redirect("back");
}
