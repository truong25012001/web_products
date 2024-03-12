const Product = require("../../model/product.model");
const productHelper = require("../../helper/product");
const createTreeHelper = require("../../helper/createTree");
const productCategory = require("../../model/product-catgory.model");
// [GET] /

module.exports.index = async (req, res) => {
	//Lấy ra sản phẩm nổi bật
	const productFeatured = await Product.find({
		deleted: false,
		status: "active",
		featured: "1"
	}).limit(6);
	const newProducts = productHelper.priceNewProduct(productFeatured);
	
	//Lấy ra sản phẩm nổi bật


	// Lấy ra sản phẩm mới nhất
	const productNew = await Product.find({
		status: "active",
		deleted: false
	}).sort({position: "desc"}).limit(6);
	const productsNew = productHelper.priceNewProduct(productNew);
	// Lấy ra sản phẩm mới nhất
	res.render("client/pages/home/index", {
		pageTitle: "Trang chủ",
		productFeatured: newProducts,
		productsNew: productsNew,
		layoutProductCategory: productsNew
	});
}