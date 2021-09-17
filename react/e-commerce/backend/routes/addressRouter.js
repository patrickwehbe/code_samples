const router = require("express").Router();
const addressControl = require("../controllers/addressControl");
const auth = require("../middlewares/auth");

router
	.route("/address")
	.post(addressControl.createAddress)
	.get(addressControl.getAddressByUser);
router.route("/address/all").get(addressControl.getAllAddress);

router
	.route("/address/:id")
	.delete(addressControl.deleteAddress)
	.put(addressControl.updateAddress)
	.get(addressControl.getAddressById);
module.exports = router;
