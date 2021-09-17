import React, { useState, useEffect, useContext } from 'react';
import Grid from '@material-ui/core/Grid';
import axios from '../../axios';
import Product from '../Products/Product2';

import './OrdersDetails.css';

function OrderDetails() {
  const [orderProducts, setOrderProducts] = useState([]);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);

  const getOrderid = (thePath) => {
    return thePath.split('/')[5];
  };

  const getOrderStatus = (thePath) =>
    thePath.substring(thePath.lastIndexOf('/') + 1);

  const params = getOrderid(window.location.href);

  const orderStatus = getOrderStatus(window.location.href);

  useEffect(() => {
    const getOrderProducts = async () => {
      const res = await axios.get(`/api/orderitems?order_id=${params}`);
      setOrderProducts(res.data);
    };
    const getItems = async () => {
      const res = await axios.get(`/api/orderitems/info?order_id=${params}`);
      setItems(res.data);
    };

    getOrderProducts();
    getItems();
  }, []);

  useEffect(() => {
    const getTotal = () => {
      var t = 0;
      items.forEach((item) => {
        orderProducts.map((product) => {
          if (item.product_id == product.product_id) {
            t += product.product_price * item.order_item_quantity;
          }
        });
        setTotal(t);
      });
    };
    getTotal();
  }, [items, orderProducts]);
  if (orderProducts.length === 0) return null;
  return (
    <div style={{ paddingTop: '20vh', marginLeft: '5vw' }}>
      <div style={{ marginLeft: '20px', marginBottom: '30px' }}>
        {orderStatus === 'c' ? (
          <h2>Order is completed</h2>
        ) : orderStatus === 'a' ? (
          <h2>Order is accepted</h2>
        ) : orderStatus === 'd' ? (
          <h2>Order is declined</h2>
        ) : orderStatus === 'p' ? (
          <h2>Order is pending</h2>
        ) : null}
      </div>
      <Grid container>
        {orderProducts.map((product) => (
          <Grid item xs={12} sm={6} lg={4} md={4}>
            {items.map((item) => {
              if (item.product_id == product.product_id) {
                return (
                  <Product
                    key={product.product_id}
                    product={product}
                    item={item}
                  />
                );
              }
            })}
          </Grid>
        ))}
      </Grid>
      <h1>Total= {total} L.L. </h1>
    </div>
  );
}

export default OrderDetails;
