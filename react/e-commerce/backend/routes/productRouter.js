const router = require("express").Router();
const productControl = require("../controllers/productControl");

router
  .route("/products")
  .get(productControl.getProducts)
  .post(productControl.createProducts);

router
  .route("/products/:id")
  .delete(productControl.deleteProducts)
  .put(productControl.updateProducts);

router
  .route("/products/details")
  .get(productControl.getProductDetails)
  .post(productControl.createProductDetails);

router.route("/products/getbyid").get(productControl.getProductsByShopId);
router
  .route("/products/getbycategory")
  .get(productControl.getPorductsByCategory);
router
  .route("/products/details/:id")
  .put(productControl.updateProductDetails)
  .delete(productControl.deleteProductDetails);

router.route("/products/info").get(productControl.getProductById);

module.exports = router;
