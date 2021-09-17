const router = require("express").Router();
const cartControl = require("../controllers/cartControl");
const auth = require("../middlewares/auth");

router.post("/items", cartControl.getCartInfo);
router.post("/info", cartControl.getCartId);
router.post("/add", cartControl.addCart);
router.post("/remove", cartControl.removeCartItem);
router.patch("/update", cartControl.editCart);
router.get("/all", cartControl.allCarts);
router.post("/product", cartControl.getProducts);
router.delete("/empty/:id", cartControl.emptyCart);

module.exports = router;
