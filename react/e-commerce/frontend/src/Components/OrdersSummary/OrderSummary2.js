import React, { useContext, useState, useRef, useEffect } from 'react';
import { DataGrid } from '@material-ui/data-grid';
import axios from '../../axios';
import { Redirect } from 'react-router';

function ManageProducts() {
  const orders = JSON.parse(localStorage.getItem('orders'));
  const shops = JSON.parse(localStorage.getItem('shops'));
  const list = [];
  const [address, setaddress] = useState({});
  const [popup, setPopup] = useState(false);

  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef);

  function useOutsideAlerter(ref) {
    useEffect(() => {
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          setPopup(false);
        }
      }

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [ref]);
  }

  const getshop = (id) => {
    return shops.map((shop) => {
      if (shop.shop_id === id) {
        return shop.shop_name;
      }
    });
  };

  const redirect = (id) => {
    return orders.map((order) => {
      if (order.order_id === id) {
        window.location.href = `/order/details/${id}/${
          order.order_status === 'completed'
            ? 'c'
            : order.order_status === 'accepted'
            ? 'a'
            : order.order_status === 'declined'
            ? 'd'
            : order.order_status === 'pending'
            ? 'p'
            : null
        }`;
      }
    });
  };

  const getaddress = async (id) => {
    return orders.map(async (order) => {
      if (order.order_id === id) {
        const res = await axios.get(`/api/address/${order.address_id}`);
        setaddress(res.data);
        setPopup(true);
      }
    });
  };

  orders.map((order) => {
    list.push({
      id: order.order_id,
      col1: getshop(order.shop_id),
      col2: order.order_status,
      col3: order.order_eta !== '' ? order.order_eta : '-',
      col4: 'address',
    });
  });
  const row = { list };

  const columns = [
    { field: 'id', headerName: 'ID', width: 50 },
    { field: 'col1', headerName: 'Shop', width: 120 },
    { field: 'col2', headerName: 'Status', width: 100 },
    { field: 'col3', headerName: 'eta', width: 100 },
    { field: 'col4', headerName: 'address', width: 100 },
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          paddingTop: '20vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '550px',
        }}
      >
        <div>
          <h2>Orders</h2>
        </div>
        <div style={{ width: '100%' }}>
          <DataGrid
            rows={list}
            columns={columns}
            autoHeight="true"
            disableColumnMenu
            onCellClick={(row) =>
              row.value !== 'address'
                ? redirect(row.row.id)
                : getaddress(row.row.id)
            }
          />
        </div>
      </div>
      {popup === true ? (
        <div
          ref={wrapperRef}
          style={{
            position: 'absolute',
            top: '50%',
            backgroundColor: 'rgb(185, 185, 185)',
            width: '200px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxShadow: '5px 5px 15px 0px rgb(120, 120, 120)',
            borderRadius: '20px',
            padding: '10px',
          }}
        >
          <p>
            <span>Address1: </span>
            {address.address1}
          </p>
          <p>
            <span>Address2: </span>
            {address.address2}
          </p>
          <p>
            <span>city: </span>
            {address.city}
          </p>
          <p>
            <span>Post code: </span>
            {address.postcode}
          </p>
        </div>
      ) : null}
    </div>
  );
}

export default ManageProducts;
