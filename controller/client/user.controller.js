const User = require("../../model/user.model");
const md5 = require("md5");
const generate = require("../../helper/generate");
const ForgotPasswod = require("../../model/forgot-password.model");
const sendMailHelper = require("../../helper/sendMail");
const Cart = require("../../model/cart.model");

// [GET] /user/register
module.exports.register = (req, res) => {
	res.render("client/pages/user/register", {
		pageTitle: "Đăng kí tài khoản"
	})
}

// [POST] /user/register
module.exports.registerPost = async (req, res) => {
	const checkEmail = await User.findOne({
		email: req.body.email
	});

	if (checkEmail) {
		req.flash("error", "Email đã tồn tại");
		res.redirect("back");
		
	} else {
		req.body.password = md5(req.body.password);
		const user = new User(req.body);
		await user.save();
		res.cookie("tokenUser", user.tokenUser);
		res.redirect("/");
	}
	


}

// [GET] /user/login
module.exports.login = (req, res) => {
	res.render("client/pages/user/login", {
		pageTitle: "Đăng nhập"
	})
}

// [POST] /user/login
module.exports.loginPost = async (req, res) => {
	const email = await User.findOne({
		email: req.body.email,
		deleted: false
	});

	if (!email) {
		req.flash("error", "Email không tồn tại");
		res.redirect("back");
		return;
	} 

	if(email.password !== md5(req.body.password)){
		req.flash("error", "Mật khẩu không đúng");
		res.redirect("back");
		return;
	}
	

	if(email.status === "inactive") {
		req.flash("error", "Tài khoản đã bị khóa");
		res.redirect("back");
		return;
	}
	const cartId = req.cookies.cartId;

	const cart = await Cart.updateOne({
		_id: cartId
	}, {
		user_id: email.id
	})
	res.cookie("tokenUser", email.tokenUser);
	res.redirect("/");


}

// [GET] /user/logout
module.exports.logout = (req, res) => {
	res.clearCookie("tokenUser");
	res.redirect("/");
}


// [GET] /user/password/forgot
module.exports.forgotPassword = (req, res) => {
	
	res.render("client/pages/user/forgot-password", {
		pageTitle: "Lấy lại mật khẩu",
	});
}

// [POST] /user/password/forgot
module.exports.forgotPasswordPost = async (req, res) => {

	const email = req.body.email;

	const user = await User.findOne({
		email: req.body.email,
		deleted: false
	});

	if(!user) {
		req.flash("error", "Email không tồn tại");
		res.redirect("back");
		return;
	}

	// Lưu thông tin vào DB
	const otp = generate.generateRadomNumber(6);
	const objectForgotPassword = {
		email: email,
		otp: otp,
		expireAt: Date.now()
	}

	const forgotPasswod = new ForgotPasswod(objectForgotPassword);
	await forgotPasswod.save();

	// Lưu thông tin vào DB
	const subject = "Mã OTP xác minh lấy lại mật khẩu";
	const html = `Mã OTP lấy lại mật khẩu là: <b>${otp}</b>`;

	sendMailHelper.sendMail(email, subject, html);

	res.redirect(`/user/password/otp?email=${email}`);

	
}


// [GET] /user/password/otp

module.exports.otpPassword = (req, res) => {
	const email = req.query.email;

	res.render("client/pages/user/otp-password", {
		pageTitle: "Nhập mã otp",
		email: email
	})
}

// [POST] /user/password/otp

module.exports.otpPasswordPost = async (req, res) => {
	const email = req.body.email;
	const otp = req.body.otp;

	const result = await ForgotPasswod.findOne({
		email: email,
		otp: otp
	});

	if(!result) {
		req.flash("error", "otp không hợp lệ");
		res.redirect("back");
		return;
	}

	const user = await User.findOne({
		email: email
	})

	res.cookie("tokenUser", user.tokenUser);
	res.redirect("/user/password/reset")


}

// [GET] /user/password/reset

module.exports.reset = (req, res) => {

	res.render("client/pages/user/reset-password", {
		pageTitle: "Đổi mật khẩu",
		
	})
}

// [POST] /user/password/reset

module.exports.resetPost = async (req, res) => {
	const password = req.body.password;
	const confirmPassword = req.body.confirmPassword;
	const tokenUser = req.cookies.tokenUser;


	await User.updateOne({
		tokenUser: tokenUser
	}, {
		password: md5(password)
	});

	res.redirect("/");
}

// [GET] /user/info

module.exports.info = async (req, res) => {

	res.render("client/pages/user/info", {
		pageTitle: "Thông tin tài khoản",
	})
}