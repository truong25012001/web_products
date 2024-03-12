const Setting = require("../../model/settings-general.model");

module.exports.general = async (req, res) => {
	const settingGeneral = await Setting.findOne({});
	res.render("admin/pages/settings/general", {
		pageTitle: "Cài đặt chung",
		settingGeneral: settingGeneral
	})
}


module.exports.generalPatch = async (req, res) => {
	const settingGeneral = await Setting.find({});
	if (settingGeneral) {
		await Setting.updateOne({
			_id: settingGeneral.id
		}, req.body);
	} else {
		const setting = new Setting(req.body);
		await setting.save();

	}

	res.redirect("back");
}