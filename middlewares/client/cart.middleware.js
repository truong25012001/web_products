const Cart = require("../../model/cart.model");

module.exports.cartId = async (req, res, next) => {
	if(!req.cookies.cartId) {
		const cart = new Cart();
		await cart.save();
		
		const time = 7 * 24 * 60 * 60 * 1000;
		res.cookie("cartId", cart.id, {
			expires: new Date(Date.now() + time) 
		});

	} else {
		const cart = await Cart.findOne({
			_id: req.cookies.cartId,
		});
		
		let totalQuantity = 0;
			
		cart.products.forEach(item => {
			totalQuantity += item.quantity;
		});

		cart.totalQuantity = totalQuantity;

		res.locals.cart = cart;
		
	}

	next();
}