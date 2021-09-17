import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { GlobalState } from '../../GlobalState';

import Product from '../Products/Product2';
import './ProductDetails2.css';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

import axios from '../../axios';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

function ProductDetails2() {
  const classes = useStyles();
  const params = useParams();
  const state = useContext(GlobalState);
  const products = JSON.parse(localStorage.getItem('products'));
  const [detailProduct, setDetailProduct] = useState([]);
  const shops = JSON.parse(localStorage.getItem('shops'));
  const addCart = state.userAPI.addCart;
  const [color, setColor] = useState([]);
  const [size, setSize] = useState([]);
  const [selectedSize, setselectedSize] = useState('');
  const [selectedColor, setselectedColor] = useState();
  const [counter, setCounter] = useState(1);
  const [cart, setCart] = state.userAPI.cart;

  // const editCart = async (cartItem, quantity) => {
  // 	await axios.patch(
  // 		`/cart/update`,
  // 		{
  // 			product_id: product.product_id,
  // 			quantity: quantity,
  // 		},
  // 		{
  // 			headers: { Authorization: `Bearer ${token}` },
  // 		}
  // 	);
  // };
  useEffect(() => {
    window.scroll(0, 0);
  }, [detailProduct.product_id]);

  const increment = (product) => {
    setCounter((counter) => counter + 1);

    setCart([...cart]);
  };
  const decrement = (product, quantity) => {
    if (counter === 1) setCounter(1);
    else {
      setCounter((counter) => counter - 1);
    }
  };
  const getColorValue = (e) => {
    localStorage.setItem('color', e.target.value);
    setselectedColor(e.target.value);
  };

  useEffect(() => {
    const getColor = async () => {
      const res = await axios.get(
        `/api/products/details?product_id=${detailProduct.product_id}`
      );

      setColor(res.data.colors);
      setSize(res.data.sizes);
    };

    if (params.id) {
      products.forEach((product) => {
        if (product.product_id == params.id) setDetailProduct(product);
      });
    }
    getColor();
    // window.scrollTo(0, 0);
  }, [params, detailProduct.product_id]);

  if (detailProduct.length === 0) {
    return null;
  }

  return (
    <div className="productdetails">
      <div className="productdetails__top">
        <div className="productdetails__image">
          {detailProduct.product_image1 && (
            <img
              src={detailProduct.product_image1}
              alt={detailProduct.product_description}
            />
          )}
          {detailProduct.product_image2 && (
            <img
              src={detailProduct.product_image2}
              alt={detailProduct.product_description}
            />
          )}
          {detailProduct.product_image3 && (
            <img
              src={detailProduct.product_image3}
              alt={detailProduct.product_description}
            />
          )}
        </div>
        <div className="productdetails__right">
          <div>
            {shops.map((shop) => {
              if (detailProduct.shop_id == shop.shop_id) {
                return (
                  <div className="productdetails__right_logo">
                    <img style={{ width: '20%' }} src={shop.shop_logo} />
                  </div>
                );
              }
            })}
            <div className="productdetails__right_title">
              {detailProduct.product_title}
            </div>
            <div className="productdetails__right_details">
              {detailProduct.product_description}
            </div>
            <div className="productdetails__right_price">
              Price: {detailProduct.product_price.toLocaleString()} L.L.
            </div>

            <div className="productdetails__right_size">
              <p
                style={{
                  fontSize: '20px',
                  marginBottom: '0px',
                  fontWeight: 'normal',
                  paddingTop: '5px',
                  width: 'fit-content',
                }}
              >
                Size
              </p>
              <div className="productdetails__right_size_list">
                {size.map((size) => {
                  return (
                    <button
                      className={
                        selectedSize == size
                          ? 'productdetails__right_sizebtn-active'
                          : 'productdetails__right_sizebtn'
                      }
                      onClick={(e) => setselectedSize(size)}
                      value={size}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="productdetails__right_color">
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '20vw',
                }}
              >
                <FormControl className={classes.formControl}>
                  <InputLabel id="demo-simple-select-label">Color</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedColor}
                    onChange={(e) => getColorValue(e)}
                  >
                    {color.map((color) => {
                      return <MenuItem value={color}>{color}</MenuItem>;
                    })}
                  </Select>
                </FormControl>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <RemoveCircleOutlineIcon
                    onClick={() => decrement()}
                    style={{ margin: '10px', fontSize: '30px' }}
                  />
                  <span id="quantity" style={{ fontSize: '25px' }}>
                    {counter}
                  </span>
                  <AddCircleOutlineIcon
                    onClick={() => increment(detailProduct.product_id)}
                    style={{
                      margin: '10px',
                      fontSize: '30px',
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="productdetails__right_buttons">
              <Button
                onClick={() =>
                  addCart(
                    detailProduct,
                    counter,
                    selectedSize,
                    localStorage.getItem('color')
                  )
                }
                variant="contained"
                style={{ outline: 'none' }}
              >
                Add to cart
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="productdetails__bottom">
        <Typography variant="h2" align="center">
          Similar Products
        </Typography>
        <Grid container>
          {products.map((product) => {
            return product.category_id === detailProduct.category_id ? (
              <Grid item xs={12} sm={6} lg={4} md={4} center>
                <Product key={product.product_id} product={product} />
              </Grid>
            ) : null;
          })}
        </Grid>
      </div>
    </div>
  );
}

export default ProductDetails2;
