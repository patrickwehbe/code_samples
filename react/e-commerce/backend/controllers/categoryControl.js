const Category = require("../models/category");

const categoryControl = {
	getCategories: async (req, res) => {
		try {
			const categories = await Category.findAll();
			res.status(200).send(categories);
		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}
	},
	createCategory: async (req, res) => {
		try {
			//check if the user is an admin
			//if user role = 1 ------------> admin
			// res.json(msg:"check admin success");

			const { name } = req.body;
			const category = await Category.findOne({
				where: { category_name: name },
			});
			if (category)
				return res
					.status(400)
					.json({ msg: "This category already exist." });
			const newCategory = await Category.create({ category_name: name });

			res.json({
				msg: `Created new Category: ${newCategory.category_name}`,
			});
		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}
	},
	deleteCategory: async (req, res) => {
		try {
			await Category.destroy({ where: { category_id: req.params.id } });
			res.json({ msg: "Category successfully deleted" });
		} catch (err) {
			res.status(500).json({ msg: err.message });
		}
	},
	updateCategory: async (req, res) => {
		try {
			const { name } = req.body;
			const category = await Category.update(
				{ category_name: name },
				{
					where: {
						category_id: req.params.id,
					},
				}
			);
			res.json({ msg: "updated Category" });
		} catch (err) {
			res.status(500).json({ msg: err.message });
		}
	},
};

module.exports = categoryControl;
