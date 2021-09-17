import React, { useEffect, useState } from 'react';
import Product from '../Products/Product2';

import axios from '../../axios';

import Grid from '@material-ui/core/Grid';

import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import SearchBar from '../SearchBar/SearchBar';

import { makeStyles } from '@material-ui/core/styles';
import _ from 'lodash';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
}));

function ProductCategory() {
  let filteredproducts = [];
  const classes = useStyles();
  const { search } = window.location;
  const query = new URLSearchParams(search).get('s');
  const [searchQuery, setSearchQuery] = useState(query || '');
  const [state, setState] = React.useState({
    categories: '',
    shops: '',
    sizes: '',
    prices: '',
  });

  const handleChange = (event) => {
    const name = event.target.name;
    setState({
      ...state,
      [name]: event.target.value,
    });
  };

  const products = JSON.parse(localStorage.getItem('products'));
  const [shopProduct, setShopProduct] = useState([]);
  const getLastItem = (thePath) =>
    thePath.substring(thePath.lastIndexOf('/') + 1);

  const filterproducts = (
    products,
    query,
    category_id,
    shop_id,
    price,
    size
  ) => {
    // if (!query) {
    //   return products;
    // }

    return shopProduct.filter((product) => {
      const productName = product.product_title;
      const productCategory = product.category_id;
      const productShop = product.shop_id;
      const productPrice = product.product_price;
      const productDetails = products[0].product_details;

      // if (shop_id != '' && price != '') {
      //   return productName.includes(query) && productShop == shop_id;
      // }
      // Category null
      if (category_id == '' && shop_id == '' && price == '' && size == '') {
        return products && productName.includes(query);
      } else if (category_id == '' && shop_id != '') {
        return productShop == shop_id && productName.includes(query);
      } else if (category_id != '' && shop_id != '' && price != 0) {
        return (
          productCategory == category_id &&
          productShop == shop_id &&
          productName.includes(query)
        );

        //category and shop null
      } else if (category_id == '' && shop_id == '' && price != '') {
        return productName.includes(query);
      }

      // category shop and price null
      else if (category_id != '' && shop_id == '') {
        return productCategory == category_id && productName.includes(query);
      } else if (category_id != '' && shop_id != '') {
        return (
          productCategory == category_id &&
          productShop == shop_id &&
          productName.includes(query)
        );
      } else if (category_id != '' && shop_id == '') {
        return productCategory == category_id && productName.includes(query);
      } else if (category_id == '' && shop_id != '' && price == '') {
        return productName.includes(query);
      } else if (
        category_id == '' &&
        shop_id == '' &&
        price == '' &&
        size != ''
      ) {
        return productDetails.forEach((detail) => {
          return detail.product_size.toLowerCase() == size.toLowerCase();
        });
      } else if (shop_id != '') {
        return productShop == shop_id && productName.includes(query);
      } else {
        return productShop == shop_id && productName.includes(query);
      }
    });
  };

  // var t = products.filter(
  //   (product) =>
  //     product.product_details.length < 5 && product.product_details.length > 1
  // );
  // t.filter((product) => {
  //   return product.product_details.includes('product_color1');
  // });

  // console.log(t);

  if (state.prices == 'low') {
    filteredproducts = filterproducts(
      products,
      searchQuery,
      state.categories,
      state.shops,
      state.prices,
      state.sizes
    );
    filteredproducts = _.sortBy(filteredproducts, 'product_price', 'asc');
  } else if (state.prices == 'high') {
    filteredproducts = filterproducts(
      products,
      searchQuery,
      state.categories,
      state.shops,
      state.prices,
      state.sizes
    );
    filteredproducts = _.sortBy(
      filteredproducts,
      'product_price',
      'asc'
    ).reverse();
  } else {
    filteredproducts = filterproducts(
      products,
      searchQuery,
      state.categories,
      state.shops,
      state.prices,
      state.sizes
    );
  }

  const params = getLastItem(window.location.href);
  useEffect(() => {
    const getProducts = async () => {
      const res = await axios.get(
        `/api/products/getbyid?page=1&limit=10000&shop_id=${params}`
      );
      setShopProduct(res.data.results);
    };
    getProducts();
  }, [params]);

  if (shopProduct.length === 0)
    return (
      <h1 style={{ textAlign: 'center', paddingTop: '50vh' }}>
        No products Found
      </h1>
    );

  return (
    <>
      <div
        className="filters"
        style={{
          paddingTop: '8vh',
          paddingBottom: '8vh',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {' '}
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <Grid
          container
          style={{
            paddingTop: '8vh',
            paddingBottom: '8vh',
            justifyContent: 'center',
          }}
        >
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="age-native-simple">
              {filteredproducts.length} Items
            </InputLabel>
          </FormControl>

          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="age-native-simple">Category</InputLabel>
            <Select
              native
              value={state.categories}
              onChange={handleChange}
              inputProps={{
                name: 'categories',
                id: 'age-native-simple',
              }}
            >
              <option aria-label="None" value="" />
              {JSON.parse(localStorage.getItem('categories')).map(
                (category) => (
                  <option value={category.category_id}>
                    {category.category_name}
                  </option>
                )
              )}
            </Select>
          </FormControl>
          {/* <FormControl className={classes.formControl}>
            <InputLabel htmlFor="age-native-simple">Sizes</InputLabel>
            <Select
              native
              value={state.sizes}
              onChange={handleChange}
              inputProps={{
                name: 'sizes',
                id: 'age-native-simple',
              }}
            >
              <option aria-label="None" value="" />
              {sizesArray.map((size) => (
                <option value={size}>{size}</option>
              ))}
            </Select>
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="age-native-simple">Colors</InputLabel>
            <Select
              native
              value={state.color}
              onChange={handleChange}
              inputProps={{
                name: 'color',
                id: 'age-native-simple',
              }}
            >
              <option aria-label="None" value="" />
              {sizesArray.map((size) => (
                <option value={size}>{size}</option>
              ))}
            </Select>
          </FormControl> */}
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="age-native-simple">Price</InputLabel>
            <Select
              native
              value={state.prices}
              onChange={handleChange}
              inputProps={{
                name: 'prices',
                id: 'age-native-simple',
              }}
            >
              <option aria-label="None" value="" />
              <option value="high">High to Low</option>
              <option value="low">Low to High</option>
            </Select>
          </FormControl>
        </Grid>
      </div>
      <div className="" style={{ paddingLeft: '30px' }}>
        <Grid container>
          {filteredproducts.map((product) => {
            return (
              <Grid item xs={12} sm={6} lg={4} md={4}>
                <Product key={product.product_id} product={product} />
              </Grid>
            );
          })}
        </Grid>
      </div>
    </>
  );
}

export default ProductCategory;
