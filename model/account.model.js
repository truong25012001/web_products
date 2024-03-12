const mongoose = require("mongoose");
const generate = require("../helper/generate");

const accountSchema = new mongoose.Schema(
	{
		fullName: String,
		email: String,
		password: String,	
		token: {
			type: String,
			default: generate.generateRadomString(20)
		},
		phone: String,
		avatar: String,
		role_id: String,
		status: String,
		deleted: {
			type: Boolean,
			default: false
		},
		deleteAt: Date
	}, {
		timestamps: true
	}
);

const Account = mongoose.model("Acount", accountSchema, "accounts");
module.exports = Account;