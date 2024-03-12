const Category = require("../model/product-catgory.model");

module.exports.getSubCategory = async (parentId) => {
	const getCategory = async (parentId) => {
		const subs = await Category.find({
			deleted: false,
			status: "active",
			parent_id: parentId
		});

		let allSubs = [...subs];

		for(const sub of subs) {
			const childs = await getCategory(sub.id);
			allSubs = allSubs.concat(childs);
		}

		return allSubs;
	}

	const result = await getCategory(parentId);
	return result;
}