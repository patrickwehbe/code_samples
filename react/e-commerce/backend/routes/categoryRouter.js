const router = require("express").Router();
const categoryControl = require("../controllers/categoryControl");
const auth = require("../middlewares/auth");
const authAdmin = require("../middlewares/authAdmin");

router
	.route("/category")
	.get(categoryControl.getCategories)
	.post(categoryControl.createCategory);

router
	.route("/category/:id")
	.delete(categoryControl.deleteCategory)
	.put(categoryControl.updateCategory);

module.exports = router;
