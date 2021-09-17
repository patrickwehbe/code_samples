// import { useState, useEffect } from "react";
// import axios from "../axios";

// function ShopAPI() {
// 	const [shop, setShop] = useState([]);
// 	const getShop = async () => {
// 		const res = await axios.get("/api/shop");
// 		res.data.forEach((shop) => {
// 			delete shop.shop_id;
// 		});
// 		setShop(res.data);
// 		localStorage.setItem("shops", JSON.stringify(res.data));
// 	};
// 	useEffect(() => {
// 		getShop();
// 	}, []);
// 	return {
// 		shops: [shop, setShop],
// 	};
// }

// export default ShopAPI;
