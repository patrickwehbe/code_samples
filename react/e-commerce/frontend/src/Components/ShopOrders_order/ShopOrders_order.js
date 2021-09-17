import React, { useEffect, useState } from 'react';

import CheckoutSummary from '../Checkout/CheckoutSummary';

import './ShopOrders_order.css';

import axios from '../../axios';

import Alert from '@material-ui/lab/Alert';

function ShopOrders_order() {
  const [userAlert, setUserAlert] = useState({
    active: false,
    desc: '',
    severity: '',
  });

  const addAlert = async (active, desc, severity) => (
    setUserAlert({
      ...userAlert,
      active: active,
      desc: desc,
      severity: severity != undefined ? severity : 'error',
    }),
    setTimeout(function () {
      setUserAlert({
        ...userAlert,
        active: false,
        desc: '',
        severity: '',
      });
    }, 3000)
  );

  const getLastItem = (thePath) =>
    thePath.substring(thePath.lastIndexOf('/') + 1);
  const params = getLastItem(window.location.href);
  const shops = JSON.parse(localStorage.getItem('shops'));

  const [products, setproducts] = useState([]);

  const order_id = JSON.parse(localStorage.getItem('order_id'));

  const getOrderProducts = async () => {
    try {
      const productsres = await axios.get(`/api/orderitems?order_id=${params}`);

      setproducts(productsres);
    } catch (err) {
      addAlert(true, err.response.data.msg);
    }
  };

  useEffect(() => {
    getOrderProducts();
  }, []);

  return (
    <div className="orderssummary">
      {userAlert.active == true ? (
        <div
          style={{
            position: 'absolute',
            top: '5%',
            width: '300px',
          }}
        >
          <Alert severity={userAlert.severity}>{userAlert.desc}</Alert>
        </div>
      ) : null}
      <div className="orderssummary__">
        <div className="ordersummary__order">
          <div className="ordersummary__order_order">
            <div className="ordersummary__order_order_products">
              {products.map((product) => {
                return (
                  <div className="ordersummary__orderitems">
                    <CheckoutSummary product={product} shops={shops} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShopOrders_order;
