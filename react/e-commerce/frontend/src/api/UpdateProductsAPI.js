import { useEffect, useState } from "react";
import axios from "../axios";

function UpdateProductsAPI() {
  const [updateProduct, setUpdateProduct] = useState([]);
  const getUpdateProduct = async () => {
    const res = await axios.get("/api/products/:id");

    setUpdateProduct(res.data.results);
  };

  useEffect(() => {
    getUpdateProduct();
  }, []);

  return { updateproduct: [updateProduct, setUpdateProduct] };
}

export default UpdateProductsAPI;
