import axios from './axios';
import React, { createContext, useEffect, useState } from 'react';
import ProductsAPI from './api/ProductsAPI';
import UserAPI from './api/UserAPI';
import ShopOrderAPI from './api/ShopOrderAPI';
import UpdateProductsAPI from './api/UpdateProductsAPI';

export const GlobalState = createContext();

export const DataProvider = ({ children }) => {
  const [category, setCategory] = useState([]);
  const [shop, setShop] = useState([]);
  const [products, setProducts] = useState([]);

  const getProducts = async () => {
    const res = await axios.get('/api/products?limit=1000&page=1');
    setProducts(res.data.results);
    localStorage.setItem('products', JSON.stringify(res.data.results));
  };

  const getShop = async () => {
    const res = await axios.get('/api/shop');

    setShop(res.data);
    localStorage.setItem('shops', JSON.stringify(res.data));
  };
  const getCategory = async () => {
    const res = await axios.get('/api/category');

    setCategory(res.data);
    localStorage.setItem('categories', JSON.stringify(res.data));
  };

  if (!localStorage.getItem('shops')) {
    getShop();
  }
  if (!localStorage.getItem('categories')) {
    getCategory();
  }
  if (!localStorage.getItem('c')) {
    localStorage.setItem('c', JSON.stringify([]));
  }
  if (
    !localStorage.getItem('products') ||
    localStorage.getItem('products').length == 0
  ) {
    getProducts();
  }
  const [token, setToken] = useState(false);
  const [r_token, setr_token] = useState(false);

  useEffect(() => {
    setr_token(localStorage.getItem('refresh_token'));
    const userInfo = localStorage.getItem('userInfo');
    const firstLogin = localStorage.getItem('firstLogin');
    if (firstLogin) {
      const refreshToken = async () => {
        const res = await axios.post('/user/refresh_token', {
          token: r_token,
        });

        setToken(res.data.accesstoken);

        setTimeout(() => {
          refreshToken();
        }, 10 * 60 * 1000);
      };
      refreshToken();
      getProducts();
    }
  }, [r_token]);

  useEffect(() => {
    getShop();
  }, []);
  useEffect(() => {
    getCategory();
  }, []);

  const state = {
    token: [token, setToken],
    productsAPI: ProductsAPI(),
    userAPI: UserAPI(token),

    shopOrderAPI: ShopOrderAPI(),
    updateOrderAPI: UpdateProductsAPI(),
  };
  return <GlobalState.Provider value={state}>{children}</GlobalState.Provider>;
};
