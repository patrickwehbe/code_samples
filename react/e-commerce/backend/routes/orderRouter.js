const router = require("express").Router();
const orderControl = require("../controllers/orderControl");
const orderItemControl = require("../controllers/orderItemControl");

router
	.route("/order")
	.get(orderControl.getOrdersByUser)
	.post(orderControl.createOrder);
router.route("/order/shop").get(orderControl.getOrdersByShop);
router.route("/order/all").get(orderControl.getAllOrder);
router
	.route("/order/:id")
	.put(orderControl.updateOrder)
	.delete(orderControl.deleteOrder);
	
router.route("/orderitems/info").get(orderItemControl.getOrderItemsInformation);

router
	.route("/orderitems")
	.get(orderItemControl.getOrderItems)
	.post(orderItemControl.createOrderItem);

module.exports = router;
