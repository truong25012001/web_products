const Product = require("../../model/product.model");
const Category = require("../../model/product-catgory.model");
const productHelper = require("../../helper/product");
const productCategoryHelper = require("../../helper/product-category");
// [GET] /products
module.exports.index = async (req, res) => {

	const products = await Product.find({
		status: "active",
		deleted: false
	}).sort({ position: "desc" });


	const newProducts = products.map(item => {
		item.priceNew = (item.price * (100 - item.discountPercentage) / 100).toFixed();
		return item;
	})

	res.render('client/pages/product/index', {
		pageTitle: "Danh sách sản phẩm",
		products: newProducts
	});
}


// [GET] /products/detail/:slugProduct

module.exports.detail = async (req, res) => {
	try {
		const slug = req.params.slugProduct;

		let find = {
			slug: slug,
			deleted: false,
			status: "active"
		}


		const product = await Product.findOne(find);
		if(product.product_category_id) {
			const category = await Category.findOne({
				deleted: false,
				status: "active",
				_id: product.product_category_id
			});
			product.category = category;
		}

		productHelper.priceNew(product);

		res.render("client/pages/product/detail", {
			product: product,
			pageTitle: product.title
		})
	} catch (error) {
		res.redirect("/products");
	}
}

// [GET] /products/:slugCategory
module.exports.slugCategory = async (req, res) => {

	const category = await Category.findOne({
		deleted: false,
		status: "active",
		slug: req.params.slugCategory
	});


	const list = await productCategoryHelper.getSubCategory(category.id);
	const listId = list.map(item => item.id);

	const products = await Product.find({
		deleted: false,
		status: "active",
		product_category_id: { $in: [category.id, ...listId] }
	}).sort({ position: "desc" });

	const newProducts = productHelper.priceNewProduct(products);

	res.render('client/pages/product/index', {
		pageTitle: category.title,
		products: newProducts
	});
}


