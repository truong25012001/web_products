const Cart = require("../../model/cart.model");
const Product = require("../../model/product.model");
const productHelper = require("../../helper/product");
const Order = require("../../model/order.model");
// [GET] /checkout
module.exports.index = async (req, res) => {
	const cartId = req.cookies.cartId;
	const cart = await Cart.findOne({
		_id: cartId
	});
	let totalPrice = 0;
	if (cart.products.length > 0) {
		for (const item of cart.products) {
			const productId = item.product_id;
			const product = await Product.findOne({
				_id: productId,
			}).select("title thumbnail slug price discountPercentage");

			productHelper.priceNew(product);
			item.productInfo = product;

			item.totalPrice = item.productInfo.priceNew * parseInt(item.quantity);

			totalPrice += item.totalPrice;
		}
		cart.totalPrice = totalPrice;
	}
	res.render("client/pages/checkout/index", {
		pageTitle: "Đặt hàng",
		cartDetail: cart
	})
}

// [GET]  /checkout/order

module.exports.order = async (req, res) => {
	const cartId = req.cookies.cartId;
	const userInfo = req.body;

	const cart = await Cart.findOne({
		_id: cartId,
	});
	let products = [];
	for (const product of cart.products) {
		const objectProduct = {

			product_id: product.product_id,
			quantity: product.quantity,
			price: 0,
			discountPercentage: 0

		}

		const productInfo = await Product.findOne({
			_id: product.product_id
		})

		objectProduct.price = productInfo.price;
		objectProduct.discountPercentage = productInfo.discountPercentage;
		products.push(objectProduct);
	}

	const orderInfo = {
		cart_id: cartId,
		userInfo: userInfo,
		products: products
	}

	const order = new Order(orderInfo);
	order.save();

	await Cart.updateOne({
		_id: cartId
	}, {
		products: []
	})

	res.redirect(`/checkout/success/${order.id}`);

}

// [GET]  /checkout/success/:orderId
module.exports.success = async (req, res) => {
	const orderId = req.params.orderId;

	const order = await Order.findOne({
		_id: orderId
	})

	for (const product of order.products) {
		const productInfo = await Product.findOne({
			_id: product.product_id
		})
		product.productInfo = productInfo;

		productHelper.priceNew(product);
		product.totalPrice = product.price * product.quantity;
	}

	order.totalPrice = order.products.reduce((sum, item) => sum + item.totalPrice, 0);

	res.render("client/pages/checkout/success", {
		pageTitle: "Đặt hàng thành công",
		order: order
	})
}