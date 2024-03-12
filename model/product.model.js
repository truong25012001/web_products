const mongoose = require("mongoose");
const   slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const productSchema = new mongoose.Schema({
	title: String,
	product_category_id:{
		type: String,
		default: ""
	},
	description: String,
	price: Number,
	discountPercentage: Number,
	stock: Number,
	thumbnail: String,
	createdBy: {
		account_id: String,
		createAt: {
			type: Date,
			default: Date.now
		}
	},
	status: String,
	featured: String,
	position: Number,
	slug: {
		 type: String,
		 slug: "title" 
	},
	deleted: {
		type: Boolean,
		default: false
	},
	deletedBy: {
		account_id: String,
		deletedAt: Date
	},
	updatedBy: [
		{
			account_id: String,
			updatedAt: Date
		} 
	]
}, {
	timestamps: true
});

const Product = mongoose.model("Product", productSchema, "products");
module.exports = Product;