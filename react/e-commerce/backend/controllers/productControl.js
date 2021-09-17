const Product = require("../models/product");
const ProductDetails = require("../models/product_details");

const productControl = {
  getProducts: async (req, res) => {
    try {
      const page = parseInt(req.query.page);
      const limit = parseInt(req.query.limit);
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const result = {};
      const colors = [];
      const sizes = [];

      const products = await Product.findAll({
        include: ProductDetails,
      });
      if (endIndex < products.length) {
        result.next = {
          page: page + 1,
          limit: limit,
        };
      }
      if (startIndex > 1) {
        result.previous = {
          page: page - 1,
          limit: limit,
        };
      }

      result.results = products.slice(startIndex, endIndex);

      // res.json({
      // 	status: "success",
      // 	result: products.length,
      // 	products: products,
      // });

      res.send(result);
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
  createProducts: async (req, res) => {
    try {
      const {
        title,
        description,
        price,
        image1,
        image2,
        image3,
        category,
        shop,
      } = req.body;
      if (!image1)
        return res.status(400).json({ msg: "No image was uploaded." });
      const product = await Product.findOne({
        where: { product_title: title },
      });
      if (product)
        return res.status(400).json({ msg: "Product already exists." });
      const newProduct = await Product.create({
        product_title: title.toLowerCase(),
        product_description: description,
        product_price: price,
        product_image1: image1,
        product_image2: image2,
        product_image3: image3,
        category_id: category,
        shop_id: shop,
      });

      // res.json(msg:newProduct);
      res.status(201).json({
        msg: "New Product created successfully.",
        newProduct: newProduct,
      });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
  deleteProducts: async (req, res) => {
    try {
      await Product.destroy({ where: { product_id: req.params.id } });
      res.json({ msg: "Product Deleted Successfully." });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
  updateProducts: async (req, res) => {
    try {
      const {
        title,
        description,
        price,
        image1,
        image2,
        image3,
        category,
        shop,
      } = req.body;
      // if (!images) return res.status(400).json(msg:"No image were uploaded");
      await Product.update(
        {
          product_title: title.toLowerCase(),
          product_description: description,
          product_price: price,
          product_image1: image1,
          product_image2: image2,
          product_image3: image3,
          category_id: category,
          shop_id: shop,
        },
        { where: { product_id: req.params.id } }
      );
      res.json({ msg: "Updated a product" });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
  getProductsByShopId: async (req, res) => {
    try {
      const page = parseInt(req.query.page);
      const limit = parseInt(req.query.limit);
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const result = {};

      const products = await Product.findAll({
        where: { shop_id: req.query.shop_id },
      });
      if (endIndex < products.length) {
        result.next = {
          page: page + 1,
          limit: limit,
        };
      }
      if (startIndex > 1) {
        result.previous = {
          page: page - 1,
          limit: limit,
        };
      }

      result.results = products.slice(startIndex, endIndex);

      // res.json({
      // 	status: "success",
      // 	result: products.length,
      // 	products: products,
      // });

      res.send(result);
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
  getPorductsByCategory: async (req, res) => {
    try {
      const page = parseInt(req.query.page);
      const limit = parseInt(req.query.limit);
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const result = {};

      const products = await Product.findAll({
        where: { category_id: req.query.category_id },
      });
      if (endIndex < products.length) {
        result.next = {
          page: page + 1,
          limit: limit,
        };
      }
      if (startIndex > 1) {
        result.previous = {
          page: page - 1,
          limit: limit,
        };
      }

      result.results = products.slice(startIndex, endIndex);

      // res.json({
      // 	status: "success",
      // 	result: products.length,
      // 	products: products,
      // });

      res.send(result);
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
  getProductDetails: async (req, res) => {
    try {
      const colors = [];
      const sizes = [];
      const productDetails = await ProductDetails.findAll({
        where: { product_id: req.query.product_id },
      });
      productDetails.forEach((product) => {
        colors.push(product.product_color);
        sizes.push(product.product_size);
      });
      res.status(200).json({
        product_details: productDetails,
        colors: [...new Set(colors)],
        sizes: [...new Set(sizes)],
      });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
  createProductDetails: async (req, res) => {
    try {
      const { product_id, product_size, product_color } = req.body;
      const product = await Product.findOne({
        where: { product_id: req.body.product_id },
      });
      if (!product) return res.status(400).json({ msg: "product not found" });

      // await ProductDetails.destroy({ where: { product_id: product_id } });

      const productDetails = await ProductDetails.create({
        product_id: product_id,
        product_size: product_size,
        product_color: product_color,
      });

      res.status(201).json({
        msg: "product details added",
        productDetails: productDetails,
      });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },

  deleteProductDetails: async (req, res) => {
    try {
      const product = await Product.findOne({
        where: { product_id: req.params.id },
      });
      if (!product) return res.status(400).json({ msg: "product not found" });

      const pd = await ProductDetails.findAll({
        where: { product_id: req.params.id },
      });

      if (pd.length < 1)
        return res.status(400).json({ msg: "productdetails not found" });

      await ProductDetails.destroy({ where: { product_id: req.params.id } });

      res.status(200).json({
        msg: "product details deleted",
      });
    } catch {
      res.status(500).json({ msg: err.message });
    }
  },

  updateProductDetails: async (req, res) => {
    try {
      const { product_size, product_color } = req.body;
      const product = await ProductDetails.findAll({
        where: {
          product_size: product_size,
          product_color: product_color,
        },
      });
      res.json(product);
    } catch (err) {
      res.status(500).json({ msg: error.message });
    }
  },
  getProductById: async (req, res) => {
    try {
      const product = await Product.findOne({
        where: { product_id: req.query.product_id },
      });
      res.status(200).json(product);
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = productControl;
