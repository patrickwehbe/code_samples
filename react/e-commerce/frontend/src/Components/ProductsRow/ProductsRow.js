import React, { useState } from 'react';

import './ProductsRow.css';
import Product from '../Products/Product2';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import SearchBar from '../SearchBar/SearchBar';
import _ from 'lodash';

import { makeStyles } from '@material-ui/core/styles';

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
function ProductsRow() {
  let filteredproducts = [];
  const classes = useStyles();
  const sizesArray = [
    'XX-Small',
    'X-Small',
    'Small',
    'Medium',
    'Large',
    'X-Large',
    'XX-Large',
    'XXX-Large',
  ];

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
  const { search } = window.location;
  const query = new URLSearchParams(search).get('s');
  const [searchQuery, setSearchQuery] = useState(query || '');

  const products = JSON.parse(localStorage.getItem('products'));

  // const page = async () => {
  // 	const res = await axios.get(`/api/products?page=${count}&limit=10"`);
  // 	setProducts(products.concat(res.data.results));
  // };

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

    return products.filter((product) => {
      const productName = product.product_title;
      const productCategory = product.category_id;
      const productShop = product.shop_id;
      const productPrice = product.product_price;
      const productDetails = products[0].product_details;

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

  const [menu, setMenu] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });
  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    setMenu({ ...menu, [anchor]: open });
  };

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
            <InputLabel htmlFor="age-native-simple">Categories</InputLabel>
            <Select
              native
              value={state.age}
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
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="age-native-simple">Shops</InputLabel>
            <Select
              native
              value={state.shop}
              onChange={handleChange}
              inputProps={{
                name: 'shops',
                id: 'age-native-simple',
              }}
            >
              <option aria-label="None" value="" />
              {JSON.parse(localStorage.getItem('shops')).map((shop) => (
                <option value={shop.shop_id}>{shop.shop_name}</option>
              ))}
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

      <div className="productsRow" style={{ padding: '0 30px' }}>
        <Grid container spacing={2}>
          {filteredproducts.map((product) => {
            return (
              <Grid item xs={12} sm={6} lg={4} md={4}>
                <Product key={product.product_id} product={product} />
              </Grid>
            );
          })}
        </Grid>
        {/* <div className="fab">
          {['right'].map((anchor) => (
            <React.Fragment key={anchor}>
              <Fab
                onClick={toggleDrawer(anchor, true)}
                style={{
                  position: 'fixed',
                  bottom: '15vh',
                  right: '30px',
                  outline: 'none',
                  backgroundColor: 'Gray',
                }}
              >
                <AddIcon style={{ color: 'white' }} />
              </Fab>
              <SwipeableDrawer
                anchor={anchor}
                open={menu[anchor]}
                // onClose={toggleDrawer(anchor, false)}
                onOpen={toggleDrawer(anchor, true)}
              >
                {list(anchor)}
              </SwipeableDrawer>
            </React.Fragment>
          ))}
        </div> */}
      </div>
      {products.length === 0 && (
        <div style={{ textAlign: 'Center' }}>No Available Products</div>
      )}
    </>
  );
}

export default ProductsRow;
