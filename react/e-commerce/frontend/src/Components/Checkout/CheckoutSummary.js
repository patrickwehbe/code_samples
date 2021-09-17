import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import './CheckoutSummary.css';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
}));

function Ordersproduct(props) {
  const classes = useStyles();

  const cartItems = JSON.parse(localStorage.getItem('c'));

  return (
    <Link
      to={`/details/${props.product.product_id}`}
      style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}
    >
      <div className="ordersproduct">
        <div className="ordersproduct__pic">
          <img
            src={props.product.product_image1}
            style={{ width: '70px' }}
            alt=""
          />
        </div>
        <div className="ordersproduct__right">
          <div className="ordersproduct__right_shop">
            {props.shops.map((shop) => {
              if (props.product.shop_id == shop.shop_id) {
                return (
                  <div className="ordersproduct__right_shop-">
                    <Avatar src={shop.shop_logo} className={classes.small} />
                    <p className="ordersproduct__right_shop-p">
                      {shop.shop_name}
                    </p>
                  </div>
                );
              }
            })}
          </div>
          <div className="orderproduct__right_product">
            <div className="ordersproduct__right_productname">
              <p className="ordersproduct__right_productname-p">
                {props.product.product_title}
              </p>
            </div>
            <div className="ordersproduct__right_productdescription">
              <p>{props.product.product_description}</p>
            </div>
          </div>
          <div className="orderproduct__right_bottom">
            <div className="orderproduct__right_productsize">
              <p>Color: {props.color}</p>
              <p>size: {props.size} </p>
            </div>

            <div className="ordersproduct__right_date">
              {cartItems.map((item) => {
                if (item.product_id == props.product.product_id) {
                  return (
                    <>
                      <p>Quantity: {item.quantity}</p>
                    </>
                  );
                }
              })}
            </div>
          </div>
        </div>
        <div className="ordersproduct__end">
          <div className="ordersproduct__end_conf">
            <p>{props.product.product_price} L.L.</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default Ordersproduct;
