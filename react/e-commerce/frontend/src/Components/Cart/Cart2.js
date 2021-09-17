import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GlobalState } from '../../GlobalState';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import { useConfirm } from 'material-ui-confirm';
import Button from '@material-ui/core/Button';
import './Cart2.css';
import axios from '../../axios';

const useStyles = makeStyles({
  root: {
    minWidth: 500,
    maxWidth: 500,
    minHeight: 820,
  },
  media: {
    minHeight: 800,
  },
});

function Cart() {
  const state = useContext(GlobalState);

  const confirm = useConfirm();
  const [cart, setCart] = state.userAPI.cart;
  const [total, setTotal] = useState(0);
  const c = JSON.parse(localStorage.getItem('c'));
  const cartProducts = JSON.parse(localStorage.getItem('Cart'));

  const getCartProducts = state.userAPI.getCartProducts;
  const getCart = state.userAPI.getCart;

  const handleDelete = (product) => {
    confirm({
      description: `This will remove  ${product.product_title} from your cart.`,
    })
      .then(() => {
        cart.forEach(async (item, index) => {
          if (item.product_id == product.product_id) {
            await axios.post('/cart/remove', {
              cart_item_id: item.cart_item_id,
            });
            cart.splice(index);
            setCart([...cart]);
            getCartProducts();
            getCart();
          }
        });
      })
      .catch(() => console.log('Deletion cancelled.'));
  };

  useEffect(() => {
    const getTotal = () => {
      var t = 0;
      c.forEach((item) => {
        cartProducts.map((product) => {
          if (item.product_id == product.product_id) {
            t += product.product_price * item.quantity;
          }
        });
        setTotal(t);
      });
    };

    getTotal();
  }, [cartProducts]);

  if (cart.length === 0)
    return (
      <h2
        style={{
          textAlign: 'center',
          fontSize: '5rem',
          paddingTop: '20vh',
        }}
      >
        Cart Empty
      </h2>
    );

  return (
    <div>
      {cartProducts.map((product) => (
        <div className="detail cart" style={{ width: '50vw' }}>
          <IconButton
            onClick={() => handleDelete(product)}
            style={{
              color: 'red',
              marginLeft: '100%',
              outline: 'none',
            }}
          >
            <CloseIcon />
          </IconButton>
          <img src={product.product_image1} alt="" style={{ width: '20vw' }} />

          <div className="box-detail">
            <h2>{product.product_title}</h2>

            <p>{product.product_description}</p>
            <h3>{product.product_price} L.L. </h3>
            <div className="">
              {c.map((item) => {
                if (item.product_id == product.product_id) {
                  return <h3>Quantity: {item.quantity}</h3>;
                }
              })}
            </div>
          </div>
        </div>
      ))}

      <div className="total">
        <h3>Total: {total} L.L. </h3>
      </div>
      <div className="" style={{ margin: 'auto', width: '50%' }}>
        <Button variant="contained">
          <Link
            style={{
              color: 'black',
              textDecoration: 'none',
              textAlign: 'center',
              fontSize: '12px',
            }}
            to="/checkout"
          >
            Checkout
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default Cart;
