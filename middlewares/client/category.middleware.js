const createTreeHelper = require("../../helper/createTree");
const productCategory = require("../../model/product-catgory.model");

module.exports.category = async (req, res, next) => {
	let find = {
		deleted: false
	}


	const record = await productCategory.find(find);
	const newRecords = createTreeHelper.tree(record);

	res.locals.records = newRecords;
	next();
}