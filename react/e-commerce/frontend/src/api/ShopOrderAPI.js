import { useState, useEffect } from 'react';
import axios from '../axios';

function ShopOrderAPI() {
  const [shopOrder, setShopOrder] = useState([]);

  const getShopOrder = async () => {
    const res = await axios.get(
      `/api/order/shop?shop_id=${localStorage.getItem('shopId')}`
    );
    //console.log(res.data);
    setShopOrder(res.data);
  };

  useEffect(() => {
    getShopOrder();
  }, []);

  return { shopOrder: [shopOrder, setShopOrder] };
}

export default ShopOrderAPI;
