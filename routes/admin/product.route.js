const express = require("express");
const router = express.Router();
const controller = require("../../controller/admin/product.controller");
const multer = require('multer');

const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");
const upload = multer();
const validate = require("../../validates/admin/product.validate");


router.get("/", controller.index);
router.patch("/change-status/:status/:id", controller.changeStatus);
router.patch("/change-multi", controller.changeMulti);
router.delete("/delete/:id", controller.deleteItems);
router.get("/deletedproducts", controller.deletedItems);
router.patch("/restore/:id", controller.reStoreItems);
router.get("/create", controller.create);
router.post("/create",
	upload.single('thumbnail'),
	uploadCloud.upload,
	validate.createPost,
	controller.createPost
);
router.get("/edit/:id", controller.edit);
router.patch("/edit/:id",
	upload.single('thumbnail'),
	uploadCloud.upload,
	validate.createPost,
	controller.editPatch
);
router.get("/detail/:id", controller.detail);


module.exports = router;