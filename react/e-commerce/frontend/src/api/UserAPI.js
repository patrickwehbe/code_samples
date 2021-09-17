import { useState, useEffect } from 'react';
import axios from '../axios';

function UserAPI(token) {
  const [isLogged, setIsLogged] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isProvier, setIsProvider] = useState(false);
  const [cart, setCart] = useState([]);
  const [history, setHistory] = useState([]);
  const [userId, setUserId] = useState(0);
  const [cartId, setCartId] = useState(0);
  const [cartProducts, setCartProducts] = useState([]);
  const [userInfoUpdated, setUserInfoUpdated] = useState([]);
  const [reload, setReload] = useState(0);

  const getCartProducts = async () => {
    const res = await axios.post('/cart/product', {
      cart_id: cartId,
    });
    setCartProducts(res.data);
    localStorage.setItem('Cart', JSON.stringify(res.data));
    localStorage.setItem('cId', cartId);
  };

  useEffect(() => {
    if (token) {
      localStorage.setItem('at', token);
      const getUser = async () => {
        try {
          const res = await axios.get('/user/info', {
            headers: { Authorization: `Bearer ${token}` },
          });

          setUserId(res.data.id);
          if (userId != 0) {
            localStorage.setItem('id', userId);
          }

          setIsLogged(true);
          localStorage.setItem('user', true);
          if (res.data.role === 0) {
            setIsAdmin(false);
          } else if (res.data.role === 1) {
            setIsProvider(true);
            localStorage.setItem('provider', true);
            try {
              const res2 = await axios.get(
                `/user/shopowner?user_id=${res.data.id}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              localStorage.setItem('shopId', res2.data);
            } catch (err) {
              alert(err.response.data.msg);
            }
          } else {
            setIsAdmin(true);
          }
        } catch (err) {
          alert(err.response.data.msg);
        }
      };

      const getAddressByUser = async () => {
        const res = await axios.get(`/api/address?user_id=${userId}`);

        res.data.address.length === 0
          ? localStorage.setItem(
              'userAddress',
              JSON.stringify({
                address_id: 0,
                address1: '',
                address2: '',
                postcode: '',
                city: '',
                user_id: userId,
              })
            )
          : localStorage.setItem(
              'userAddress',
              JSON.stringify(res.data.address.slice(-1).pop())
            );
      };
      const getOrders = async () => {
        const res = await axios.get(`/api/order/?user_id=${userId}`);
        localStorage.setItem('orders', JSON.stringify(res.data));
      };

      const getUserInfo = async () => {
        const res = await axios.get(
          `/user/profile/getuserbyid?user_id=${userId}`
        );
        setUserInfoUpdated(res.data.updatedAt);
        const data = res.data;
        delete data.user_password;
        localStorage.setItem('userInfo', JSON.stringify(data));
      };

      if (userId != '0') {
        getAddressByUser();
        getUserInfo();
        if (!localStorage.getItem('provider')) {
          getCart();
          getCartId();
          getCartProducts();
          getOrders();
        }
      }
      getUser();
    }
    if (cartId == 0) {
      getCartId();
    }
  }, [token, userId, cartId, userInfoUpdated, reload]);

  const getCartId = async () => {
    const res = await axios.post('/cart/info', {
      user_id: userId,
    });
    setCartId(res.data.cartId[0].cart_id);
  };

  const getCart = async () => {
    const info = await axios.post('/cart/items', {
      cart_id: cartId,
    });
    setCart(info.data);
    localStorage.setItem('c', JSON.stringify(info.data));
  };

  const addCart = async (product, quantity = 1, size, color) => {
    if (!isLogged) return alert('Please login to continue buying');

    const check = cart.every((item) => {
      return item.product_id !== product.product_id;
    });
    if (!check) {
      alert('product already in cart');
    } else {
      await axios.post(
        '/cart/add',
        {
          cart_id: cartId,
          product_id: product.product_id,
          quantity: quantity,
          size: size,
          color: color,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setCart([...cart, { ...product }]);
      getCart();
      getCartProducts();
    }
  };

  return {
    isLogged: [isLogged, setIsLogged],
    isAdmin: [isAdmin, setIsAdmin],
    isProvider: [isProvier, setIsProvider],
    cart: [cart, setCart],
    addCart: addCart,
    getCartProducts: getCartProducts,
    getCart: getCart,
    history: [history, setHistory],
    userId: [userId, setUserId],
    cartId: [cartId, setCartId],
    cartProducts: [cartProducts, setCartProducts],
    userInfoUpdated: [userInfoUpdated, setUserInfoUpdated],
    reload: [reload, setReload],
  };
}

export default UserAPI;
