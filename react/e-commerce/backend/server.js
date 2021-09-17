require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const path = require("path");

//MiddleWares

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
	cors({
		origin: function (origin, callback) {
			return callback(null, true);
		},
		optionsSuccessStatus: 200,
		credentials: true,
		exposedHeaders: ["set-cookie"],
	})
);

// app.use(
// 	fileUpload({
// 		useTempFiles: "true",
// 	})
// );

//Routes

app.use("/user", require("./routes/userRouter"));
app.use("/cart", require("./routes/cartRouter"));
app.use("/api", require("./routes/categoryRouter"));
app.use("/api", require("./routes/upload"));
app.use("/api", require("./routes/productRouter"));
app.use("/api", require("./routes/shopRouter"));
app.use("/api", require("./routes/addressRouter"));
app.use("/api", require("./routes/orderRouter"));
app.use("/", (req, res) => {
	res.sendFile(path.resolve(__dirname + `/index.html`));
});

const port = process.env.PORT || 7000;
app.listen(port, () => {
	console.log("Server running on port: ", port);
});
