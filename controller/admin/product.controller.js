
const filterStatusHelper = require("../../helper/filterstatus");
const Product = require("../../model/product.model");
const searchHelper = require("../../helper/search");
const paginationHelper = require("../../helper/pagination");
const sysconfixAdmin = require("../../config/system");
const productCategory = require("../../model/product-catgory.model");
const createTreeHelper = require("../../helper/createTree");
const Account = require("../../model/account.model");

// [GET] /admin/products
module.exports.index = async (req, res) => {


	const filterStatus = filterStatusHelper(req.query);

	let find = {
		deleted: false
	}

	if (req.query.status) {
		find.status = req.query.status;
	}

	const objectSearch = searchHelper(req.query);
	if (objectSearch.regex) {
		find.title = objectSearch.regex;
	}

	// Pagination
	const countProducts = await Product.countDocuments(find);
	let objectPagination = paginationHelper(
		{
			limititems: 4,
			currentPage: 1
		},
		req.query,
		countProducts
	);



	// End Pagination

	// Sort
	let sort = {}
	if (req.query.sortKey && req.query.sortValue) {
		sort[req.query.sortKey] = req.query.sortValue;
	} else {
		sort.position = "desc";
	}
	// End Sort

	const products = await Product.find(find)
		.limit(objectPagination.limititems)
		.skip(objectPagination.skip)
		.sort(sort);

	for (const product of products) {
		const user = await Account.findOne({
			_id: product.createdBy.account_id
		})
		if (user) {
			product.accountFullName = user.fullName;
		}
		// Lấy ra thông tin người cập nhật gần nhất
		const updatedBy =  product.updatedBy[product.updatedBy.length - 1];
		if(updatedBy) {
			const userUpdatedBy = await Account.findOne({
				_id: updatedBy.account_id
			})
			updatedBy.accountFullName = userUpdatedBy.fullName;
		}

	}


	res.render("admin/pages/products/index", {
		pageTitle: "Danh sách sản phẩm",
		products: products,
		filterStatus: filterStatus,
		keyword: objectSearch.keyword,
		pagination: objectPagination
	});


}


// [PATCH]/admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
	const status = req.params.status;
	const id = req.params.id;

	const updatedBy = {
		account_id: res.locals.user.id,
		updatedAt: new Date()
	}

	await Product.updateOne({ _id: id }, {
		$push: { updatedBy: updatedBy },
		status: status
	});
	req.flash('success', 'Cập nhật trạng thái thành công');
	res.redirect("back");
}


// [PATCH]/admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
	console.log(req.body);

	const type = req.body.type;
	const ids = req.body.ids.split(", ");

	const updatedBy = {
		account_id: res.locals.user.id,
		updatedAt: new Date()
	}

	switch (type) {
		case "active":
			await Product.updateMany({ _id: { $in: ids } }, {
				$push: { updatedBy: updatedBy },
				status: "active"
			});
			req.flash('success', `Cập nhật trạng thái ${ids.length} thành công`);
			break;
		case "inactive":
			await Product.updateMany({ _id: { $in: ids } }, {
				status: "inactive",
				$push: { updatedBy: updatedBy }
			});
			req.flash('success', `Cập nhật trạng thái ${ids.length} thành công`);
			break;
		case "delete-all":
			await Product.updateMany({ _id: { $in: ids } }, {
				deleted: true,
				deletedAt: new Date()
			});
			req.flash('success', `Đã xóa thành công ${ids.length} sản phẩm`);
			break;
		case "change-position":
			for (items of ids) {
				let [id, position] = items.split("-");
				position = parseInt(position);

				await Product.updateOne({ _id: id }, {
					$push: { updatedBy: updatedBy },
					position: position
				})

			}
			req.flash('success', `Đã đổi vị trí thành công ${ids.length} sản phẩm`);
			break;
		default:
			break;
	}
	res.redirect("back");
}

// [DELETE]/admin/delete/:id
module.exports.deleteItems = async (req, res) => {
	const id = req.params.id;
	await Product.updateOne({ _id: id }, {
		deleted: true,
		deletedBy: {
			account_id: res.locals.user.id,
			deletedAt: new Date(),
		}
	});

	res.redirect("back");
}


module.exports.deletedItems = async (req, res) => {
	const items = await Product.find({
		deleted: true
	});
	res.render("admin/pages/products/deleted", {
		products: items,
		pageTitle: "Danh sách sản phẩm đã xóa"
	})

}

module.exports.reStoreItems = async (req, res) => {
	const id = req.params.id;
	await Product.updateOne({ _id: id }, {
		deleted: false,
		deleteAt: new Date()
	});
	req.flash('success', `Đã khôi phục sản phẩm thành công`);
	res.redirect("back");

}
// [GET] /admin/products/create
module.exports.create = async (req, res) => {
	let find = {
		deleted: false
	}
	const category = await productCategory.find(find);
	const newCategory = createTreeHelper.tree(category);

	res.render("admin/pages/products/create", {
		pageTitle: "Trang tạo mới sản phẩm",
		category: newCategory
	});
}

// [POST] /admin/products/create
module.exports.createPost = async (req, res) => {
	req.body.price = parseInt(req.body.price);
	req.body.stock = parseInt(req.body.stock);
	req.body.discountPercentage = parseInt(req.body.discountPercentage);

	if (req.body.position == "") {
		const countProducts = await Product.countDocuments();
		req.body.position = countProducts + 1;
	} else {
		req.body.position = parseInt(req.body.position);
	}

	req.body.createdBy = {
		account_id: res.locals.user.id
	}
	const product = new Product(req.body);
	await product.save();


	res.redirect(`${sysconfixAdmin.prefixAdmin}/products`)

}

// [GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => {

	try {
		const id = req.params.id;
		let find = {
			_id: id,
			deleted: false
		}
		const product = await Product.findOne(find);
		const category = await productCategory.find({ deleted: false });
		const newCategory = createTreeHelper.tree(category);

		res.render("admin/pages/products/edit", {
			pageTitle: "Trang chỉnh sửa sản phẩm",
			product: product,
			category: newCategory
		});
	} catch (error) {
		res.redirect(`${sysconfixAdmin.prefixAdmin}/products`);

	}
}


// [PATCH]/admin/products/edit/:id


module.exports.editPatch = async (req, res) => {

	const id = req.params.id;
	req.body.price = parseInt(req.body.price);
	req.body.stock = parseInt(req.body.stock);
	req.body.discountPercentage = parseInt(req.body.discountPercentage);
	req.body.position = parseInt(req.body.position);

	console.log(req.body);

	try {
		const updatedBy = {
			account_id: res.locals.user.id,
			updatedAt: new Date()
		}
		await Product.updateOne({ _id: id }, {
			...req.body,
			$push: { updatedBy: updatedBy }
		});
		req.flash("success", "Cập nhật sản phẩm thành công");
	} catch (error) {
		req.flash("error", "Cập nhật sản phẩm thất bại");
	}
	res.redirect("back");
}

// [GET] /admin/products/detail/:id

module.exports.detail = async (req, res) => {
	let find = {
		deleted: false,
		_id: req.params.id
	}

	try {
		const product = await Product.findOne(find);
		res.render("admin/pages/products/detail", {
			product: product,
			pageTitle: product.title
		});
		console.log(product);
	} catch (error) {
		res.redirect(`${sysconfixAdmin.prefixAdmin}/products`);
	}
}