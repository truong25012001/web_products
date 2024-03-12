const Cart = require("../../model/cart.model");
const Product = require("../../model/product.model");
const productHelper = require("../../helper/product");

// [GET] /cart/
module.exports.index = async (req, res) => {
	const cartId = req.cookies.cartId;
	const cart = await Cart.findOne({
		_id: cartId
	});
	let totalPrice = 0;
	if(cart.products.length > 0) {
		for (const item of cart.products) {
			const productId = item.product_id;
			const productInfo = await Product.findOne({
				_id: productId
			}).select("title thumbnail slug price discountPercentage");
			productHelper.priceNew(productInfo);
			item.productInfo = productInfo;
			item.totalPrice = item.productInfo.priceNew * item.quantity;
			totalPrice += item.totalPrice;
		}
	}
	cart.totalPrice = totalPrice;

	res.render("client/pages/cart/index", {
		pageTitle: "Giỏ hàng",
		cartDetail: cart
	});
}

// [POST] /cart/add/:productId
module.exports.addPost = async (req, res) => {
	const productId = req.params.productId;
	const quantity = parseInt(req.body.quantity);
	const cartId = req.cookies.cartId;

	const cart = await Cart.findOne({
		_id: cartId
	});

	const checkProductInCart = cart.products.find(item => item.product_id == productId);

	if(checkProductInCart) {
		const quantityNew = quantity + checkProductInCart.quantity;
		await Cart.updateOne({
			_id: cartId,
			"products.product_id": productId
		}, {
			'$set': {
				"products.$.quantity": quantityNew
			}
		});
		req.flash("success", "Thêm sản phẩm vào giỏ hàng thành công");
		res.redirect("back");
	} else {
		const objectCart = {
			product_id: productId,
			quantity: quantity
		}
	
		await Cart.updateOne({
			_id: cartId
		},{
			$push: {products: objectCart}
		});
		req.flash("success", "Đã thêm sản phẩm vào giỏ hàng");
		res.redirect("back");
	}


}

// [GET] /cart/delete/:productId

module.exports.delete = async (req, res) => {
	const productId = req.params.productId;
	const cartId = req.cookies.cartId;

	await Cart.updateOne({
		_id: cartId
	}, {
		'$pull': {'products': {'product_id': productId}}
	});
	req.flash("success", "Đã xóa sản phẩm khỏi giỏ hàng");
	res.redirect("back");
}

// [GET] /cart/update/:productId/quantity
module.exports.update = async (req, res) => {
	const productId = req.params.productId;
	const cartId = req.cookies.cartId;
	const quantity = req.params.quantity;

	await Cart.updateOne({
		_id: cartId,
		'products.product_id': productId
	}, {
		'$set': {
			"products.$.quantity": quantity
		}
	});

	
	req.flash("success", "Cập nhật số lượng thành công");
	res.redirect("back");
}