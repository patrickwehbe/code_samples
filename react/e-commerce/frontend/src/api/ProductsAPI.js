import { useEffect, useState } from "react";
import axios from "../axios";

function ProductsAPI() {
	const [products, setProducts] = useState([]);
	const getProducts = async () => {
		const res = await axios.get("/api/products?page=1&limit=10");
		setProducts(res.data.results);
	};

	useEffect(() => {
		getProducts();
	}, []);

	return { products: [products, setProducts] };
}

export default ProductsAPI;
