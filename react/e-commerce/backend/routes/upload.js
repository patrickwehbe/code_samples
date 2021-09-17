const router = require("express").Router();
const cloudinary = require("cloudinary");
const auth = require("../middlewares/auth");
const authShopOwner = require("../middlewares/authShopOwner");
const authAdmin = require("../middlewares/authAdmin");
const Product = require("../models/product");
const fs = require("fs");
const multer = require("multer");
const path = require("path");

//Cloudinary config api

// cloudinary.config({
// 	cloud_name: process.env.CLOUD_NAME,
// 	api_key: process.env.CLOUD_API_KEY,
// 	api_secret: process.env.CLOUD_API_SECRET,
// });

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		const dir = "./images";
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir);
		}
		cb(null, "./images");
	},
	filename: (req, file, cb) => {
		const ext = file.mimetype.split("/")[1];
		cb(null, `${Date.now()}.${ext}`);
	},
});

const upload = multer({ storage: storage }).array("files", 12);

router.post("/uploadimage", (req, res, next) => {
	upload(req, res, function (err) {
		if (err) {
			return res.send(err);
		}
		const image = req.files;

		res.send(image);
	});
});

router.post("/deleteimage/:id", (req, res, next) => {
	const file = path.resolve(__dirname + `/../images/${req.params.id}`);
	if (file) {
		fs.unlinkSync(file);
		res.json("deleted");
	}
});

router.get("/getImage/:id", (req, res) => {
	res.sendFile(path.resolve(__dirname + `/../images/${req.params.id}`));
});

// upload route
//Only Admin can use
// router.post("/upload", (req, res) => {
// 	try {
// 		console.log(req.files);
// 		if (!req.files || Object.keys(req.files).length === 0) {
// 			return res.status(400).json({ msg: "No files were uploaded" });
// 		}

// 		const file = req.files.file;
// 		if (file.size > 1024 * 1024) {
// 			removeTmp(file.tempFilePath);
// 			return res.status(400).json({ msg: "File size too large." }); // 1024 * 1024 = 1mb ------> 1024 * 1024 * 5 = 5mb ...
// 		}

// 		if (file.mimetype !== "image/jpeg" && file.mimetype !== "image/png") {
// 			removeTmp(file.tempFilePath);
// 			return res.status(400).json({
// 				msg: "File format Invalid. Accept only JPEG or PNG files.",
// 			});
// 		}

// 		cloudinary.v2.uploader.upload(
// 			file.tempFilePath,
// 			{ folder: "images" },
// 			async (err, result) => {
// 				if (err) throw err;
// 				removeTmp(file.tempFilePath);

// 				// res.json({ result }); get all the infos

// 				res.json({
// 					public_id: result.public_id,
// 					url: result.secure_url,
// 				});
// 			}
// 		);
// 	} catch (err) {
// 		res.status(500).json({ msg: err.message });
// 	}
// });

// Destroy route
//Only Admin can use

router.post("/destroy", (req, res) => {
	try {
		const { public_id } = req.body;
		if (!public_id)
			return res.status(400).json({ msg: "No images selected" });

		cloudinary.v2.uploader.destroy(public_id, async (err, result) => {
			if (err) throw err;
			res.send("Image Successfully deleted");
		});
	} catch (err) {
		return res.status(500).json({ msg: err.message });
	}
});

const removeTmp = (path) => {
	fs.unlink(path, (err) => {
		if (err) throw err;
	});
};

module.exports = router;
