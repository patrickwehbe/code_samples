import React, { useContext, useState, useEffect } from 'react';
import { GlobalState } from '../../GlobalState';
import Grid from '@material-ui/core/Grid';
import './EditProducts.css';
import SearchBar from '../SearchBar/SearchBar';
import EditProduct from '../EditProduct/EditProduct';
import axios from '../../axios';
function EditProducts() {
  const state = useContext(GlobalState);
  const { search } = window.location;
  const query = new URLSearchParams(search).get('s');
  const [searchQuery, setSearchQuery] = useState(query || '');

  const [products, setProducts] = useState([]);

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

  filteredproducts.length < 1 && (
    <div>
      <p>No Products to show</p>
    </div>
  );

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
  return (
    <div className="deleteProduct" style={{ paddingLeft: '30px' }}>
      <div className="deleteProduct__search">
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </div>
      <Grid container spacing={3}>
        {filteredproducts.map((product) => {
          return (
            <Grid item xs={12} sm={6} lg={4} md={4}>
              <EditProduct product={product} key={product.key}>
                {product.product_title}
              </EditProduct>
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
}

export default EditProducts;
