const productCategory = require("../../model/product-catgory.model");
const systemConfig = require("../../config/system");
const createTreeHelper = require("../../helper/createTree");
// [GET] /admin/products-category
module.exports.index = async (req, res) =>{
	let find = {
		deleted: false
	}


	const record = await productCategory.find(find);
	const newRecords = createTreeHelper.tree(record);

	res.render("admin/pages/products-category/index", {
		pageTitle: "Danh mục sản phẩm", 
		record: newRecords
	});
}

// [GET] /admin/products-category/create
module.exports.create = async (req, res) =>{
	let find = {
		deleted: false
	}


	const records = await productCategory.find(find);
	const newRecords = createTreeHelper.tree(records);

	res.render("admin/pages/products-category/create", {
		pageTitle: "Tạo danh mục sản phẩm", 
		records: newRecords
	});
}


//[POST] /admin/product-category/create
module.exports.createPost = async (req, res) => {
	if(req.body.position == "") {
		const count = await productCategory.countDocuments();
		req.body.position = count + 1;
	} else {
		req.body.position = parseInt(req.body.position);
	}

	const record = new productCategory(req.body);
	await record.save();
	res.redirect(`${systemConfig.prefixAdmin}/products-category`);
}

//[GET]/admin/products-category/edit
module.exports.edit = async (req, res) => {
	const id = req.params.id;

	const data = await productCategory.findOne({
		_id: id,
		deleted: false
	});

	let find = {
		deleted: false
	}

	const records = await productCategory.find(find);
	const newRecords = createTreeHelper.tree(records);

	res.render("admin/pages/products-category/edit", {
		pageTitle: "Chỉnh sửa danh mục sản phẩm",
		data: data,
		records: newRecords
	})
}

//[PATCH] /admin/products-category/edit

module.exports.editPatch = async (req, res) => {
	const id = req.params.id;
	req.body.position = parseInt(req.body.position);

	
	console.log(req.body);

	 await productCategory.updateOne({_id: id}, req.body);
	res.redirect("back");
}