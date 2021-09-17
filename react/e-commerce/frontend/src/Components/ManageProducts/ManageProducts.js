import React, { useContext, useState, useEffect } from 'react';
import { GlobalState } from '../../GlobalState';
import { DataGrid } from '@material-ui/data-grid';
import axios from '../../axios';

function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [select, setSelection] = useState([]);
  const list = [];
  products.map((product) => {
    list.push({
      id: product.product_id,

      col2: product.product_title,
      col3: product.product_description,
      col4: product.product_price,
      col5: product.product_image1,
      col6: product.product_image2,
      col7: product.product_image3,
    });
  });
  console.log(list);
  const row = { list };

  const columns = [
    { field: 'id', headerName: 'Product Id', width: 200 },
    { field: 'col2', headerName: 'Product Title', width: 200 },
    { field: 'col3', headerName: 'Product Description', width: 200 },
    { field: 'col4', headerName: 'Product Price', width: 200 },
    { field: 'col5', headerName: 'Product Image1', width: 200 },
    { field: 'col6', headerName: 'Product Image2', width: 200 },
    { field: 'col7', headerName: 'Product Image3', width: 200 },
  ];

  useEffect(() => {
    const getProducts = async () => {
      const res = await axios.get(
        `api/products/getbyid?limit=1000&page=1&shop_id=${localStorage.getItem(
          'shopId'
        )}`
      );
      setProducts(res.data.results);
    };
    getProducts();
  }, []);

  return (
    <div style={{ height: 400, width: '100%', paddingTop: '20vh' }}>
      <DataGrid
        rows={list}
        columns={columns}
        autoHeight="true"
        checkboxSelection
        onSelectionChange={(newSelection) => {
          setSelection(newSelection.rows);
        }}
      />
      {select}
    </div>
  );
}

export default ManageProducts;
