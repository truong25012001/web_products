const Product = require("../../model/product.model");
const newPriceProductHelper = require('../../helper/product');

// [GET] /search
module.exports.index = async (req, res) => {
	const keyword = req.query.keyword;
	let newProduct = [];

	if (keyword) {
		const regex = new RegExp(keyword, "i");
		const products = await Product.find({
			deleted: false,
			status: "active",
			title: regex
		})

		newProduct = newPriceProductHelper.priceNewProduct(products);

	}

	res.render("client/pages/search/index", {
		pageTitle: "Kết quả tìm kiếm",
		keyword: keyword,
		products: newProduct
	})
}