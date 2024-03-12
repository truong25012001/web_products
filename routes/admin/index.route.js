const dashboardRoutes = require("./dashboard.route");
const systemConfig = require("../../config/system");
const productRoutes = require("./product.route");
const productsCategoryRoutes = require("./products-category.route");
const roleRoutes = require("./role.route");
const authRoutes = require("./auth.route");
const accountRoutes = require("./account.route");
const myAccountRoutes = require("./my-account.route");
const settingRoutes = require("./setting.route");
const middleware = require("../../middlewares/admin/auth.middleware");

module.exports = (app) => {
	const PATH_ADMIN = systemConfig.prefixAdmin;
	app.use(PATH_ADMIN + "/dashboard",
		middleware.requireAuth,
		dashboardRoutes
	);
	app.use(PATH_ADMIN + "/products",
		middleware.requireAuth,
		productRoutes
	);
	app.use(PATH_ADMIN + "/products-category",
		middleware.requireAuth,
		productsCategoryRoutes
	);
	app.use(PATH_ADMIN + "/roles",
		middleware.requireAuth,
		roleRoutes
	);

	app.use(PATH_ADMIN + "/accounts",
		middleware.requireAuth,
		accountRoutes
	);
	app.use(PATH_ADMIN + "/auth", authRoutes);

	app.use(PATH_ADMIN + "/my-account",
		middleware.requireAuth,
		myAccountRoutes
	);

	app.use(PATH_ADMIN + "/settings",
		middleware.requireAuth,
		settingRoutes
	);

}