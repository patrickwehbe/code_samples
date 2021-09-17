import React, { useState, useEffect } from 'react';

import Grid from '@material-ui/core/Grid';
import './DeleteProduct.css';
import SearchBar from '../SearchBar/SearchBar';
import CrossProduct from '../CrossProducts/CrossProduct';
import axios from '../../axios';

function DeleteProduct() {
  const { search } = window.location;
  const query = new URLSearchParams(search).get('s');
  const [searchQuery, setSearchQuery] = useState(query || '');
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const getProducts = async () => {
      const res = await axios.get(
        `api/products/getbyid?limit=1000&page=1&shop_id=${JSON.parse(
          localStorage.getItem('shopId')
        )}`
      );
      setProducts(res.data.results);
    };
    getProducts();
  }, []);

  const filterproducts = (products, query) => {
    if (!query) {
      return products;
    }

    return products.filter((product) => {
      const productName = product.product_title.toLowerCase();
      return productName.includes(query);
    });
  };
  const filteredproducts = filterproducts(products, searchQuery);

  return (
    <div className="deleteProduct" style={{ paddingLeft: '30px' }}>
      <div className="deleteProduct__search">
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </div>
      <Grid container spacing={3} style={{ paddingTop: '5vh' }}>
        {filteredproducts.map((product) => {
          return (
            <Grid item xs={12} sm={6} lg={4} md={4}>
              <CrossProduct product={product} key={product.key}>
                {product.product_title}
              </CrossProduct>
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
}

export default DeleteProduct;
