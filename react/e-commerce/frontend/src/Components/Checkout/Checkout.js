import React, { useEffect, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Link } from 'react-router-dom';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import './Checkout.css';
import SaveIcon from '@material-ui/icons/Save';

import CheckoutSummary from './CheckoutSummary';
import axios from '../../axios';
import Loading from '../Utils/Loading';
import './Checkout.css';
import './EditProfile.css';

import Alert from '@material-ui/lab/Alert';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
}));

function Checkout() {
  const classes = useStyles();
  const [userAlert, setUserAlert] = useState({ active: false, desc: '' });

  const addAlert = async (active, desc) => (
    setUserAlert({ ...userAlert, active: active, desc: desc }),
    setTimeout(function () {
      setUserAlert({ ...userAlert, active: false, desc: '' });
    }, 3000)
  );
  const id = parseInt(localStorage.getItem('id'));
  const address = JSON.parse(localStorage.getItem('userAddress'));
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const [address1, setAddress1] = useState(address.address1);
  const [address2, setAddress2] = useState(address.address1);
  const [postcode, setPostcode] = useState(address.postcode);

  const [username, setUsername] = useState(userInfo.user_username);
  const [email, setEmail] = useState(userInfo.user_email);
  const [phoneNum, setPhoneNum] = useState(userInfo.phoneNumber);
  const [city, setCity] = useState(address.city);

  const cities = [
    {
      city: 'Tripoli',
      lat: '34.4333',
      lng: '35.8333',
      country: 'Lebanon',
      iso2: 'LB',
      admin_name: 'Liban-Nord',
      capital: 'admin',
      population: '530000',
      population_proper: '192572',
    },
    {
      city: 'Beirut',
      lat: '33.8869',
      lng: '35.5131',
      country: 'Lebanon',
      iso2: 'LB',
      admin_name: 'Beyrouth',
      capital: 'primary',
      population: '361366',
      population_proper: '361366',
    },
    {
      city: 'Sidon',
      lat: '33.5606',
      lng: '35.3981',
      country: 'Lebanon',
      iso2: 'LB',
      admin_name: 'Liban-Sud',
      capital: 'admin',
      population: '200000',
      population_proper: '200000',
    },
    {
      city: 'Tyre',
      lat: '33.2667',
      lng: '35.2000',
      country: 'Lebanon',
      iso2: 'LB',
      admin_name: 'Liban-Sud',
      capital: 'minor',
      population: '160000',
      population_proper: '160000',
    },
    {
      city: 'Jo\u00fcni\u00e9',
      lat: '33.9697',
      lng: '35.6156',
      country: 'Lebanon',
      iso2: 'LB',
      admin_name: 'Mont-Liban',
      capital: 'minor',
      population: '102221',
      population_proper: '102221',
    },
    {
      city: 'Zahl\u00e9',
      lat: '33.8439',
      lng: '35.9072',
      country: 'Lebanon',
      iso2: 'LB',
      admin_name: 'B\u00e9qaa',
      capital: 'admin',
      population: '100000',
      population_proper: '100000',
    },
    {
      city: 'Nabat\u00eey\u00e9',
      lat: '33.3833',
      lng: '35.4500',
      country: 'Lebanon',
      iso2: 'LB',
      admin_name: 'Nabat\u00eey\u00e9',
      capital: 'admin',
      population: '80000',
      population_proper: '40000',
    },
    {
      city: 'Baalbek',
      lat: '34.0061',
      lng: '36.2086',
      country: 'Lebanon',
      iso2: 'LB',
      admin_name: 'Baalbek-Hermel',
      capital: 'admin',
      population: '24000',
      population_proper: '24000',
    },
    {
      city: 'Amio\u00fbn',
      lat: '34.2994',
      lng: '35.8097',
      country: 'Lebanon',
      iso2: 'LB',
      admin_name: 'Liban-Nord',
      capital: 'minor',
      population: '10000',
      population_proper: '10000',
    },
    {
      city: 'Baabda',
      lat: '33.8333',
      lng: '35.5333',
      country: 'Lebanon',
      iso2: 'LB',
      admin_name: 'Mont-Liban',
      capital: 'admin',
      population: '9000',
      population_proper: '9000',
    },
    {
      city: 'Marjayo\u00fbn',
      lat: '33.3667',
      lng: '35.5833',
      country: 'Lebanon',
      iso2: 'LB',
      admin_name: 'Nabat\u00eey\u00e9',
      capital: 'minor',
      population: '3000',
      population_proper: '3000',
    },
    {
      city: 'Jdaidet el Matn',
      lat: '33.8906',
      lng: '35.5664',
      country: 'Lebanon',
      iso2: 'LB',
      admin_name: 'Mont-Liban',
      capital: 'minor',
      population: '',
      population_proper: '',
    },
    {
      city: 'Zghart\u0101',
      lat: '34.3997',
      lng: '35.8936',
      country: 'Lebanon',
      iso2: 'LB',
      admin_name: 'Liban-Nord',
      capital: 'minor',
      population: '',
      population_proper: '',
    },
    {
      city: 'Aaley',
      lat: '33.8053',
      lng: '35.6000',
      country: 'Lebanon',
      iso2: 'LB',
      admin_name: 'Mont-Liban',
      capital: 'minor',
      population: '',
      population_proper: '',
    },
    {
      city: 'Jba\u00efl',
      lat: '34.1167',
      lng: '35.6500',
      country: 'Lebanon',
      iso2: 'LB',
      admin_name: 'Mont-Liban',
      capital: 'minor',
      population: '',
      population_proper: '',
    },
    {
      city: 'S\u00eer ed Danniy\u00e9',
      lat: '34.3853',
      lng: '36.0311',
      country: 'Lebanon',
      iso2: 'LB',
      admin_name: 'Liban-Nord',
      capital: 'minor',
      population: '',
      population_proper: '',
    },
    {
      city: 'Halba',
      lat: '34.5428',
      lng: '36.0797',
      country: 'Lebanon',
      iso2: 'LB',
      admin_name: 'Aakk\u00e2r',
      capital: 'admin',
      population: '',
      population_proper: '',
    },
    {
      city: 'Bent Jba\u00efl',
      lat: '33.1194',
      lng: '35.4333',
      country: 'Lebanon',
      iso2: 'LB',
      admin_name: 'Nabat\u00eey\u00e9',
      capital: 'minor',
      population: '',
      population_proper: '',
    },
    {
      city: 'Jezz\u00eene',
      lat: '33.5417',
      lng: '35.5844',
      country: 'Lebanon',
      iso2: 'LB',
      admin_name: 'Liban-Sud',
      capital: 'minor',
      population: '',
      population_proper: '',
    },
    {
      city: 'Batro\u00fbn',
      lat: '34.2553',
      lng: '35.6581',
      country: 'Lebanon',
      iso2: 'LB',
      admin_name: 'Liban-Nord',
      capital: 'minor',
      population: '',
      population_proper: '',
    },
    {
      city: 'H\u00e2sba\u00efya',
      lat: '33.3978',
      lng: '35.6850',
      country: 'Lebanon',
      iso2: 'LB',
      admin_name: 'Nabat\u00eey\u00e9',
      capital: 'minor',
      population: '',
      population_proper: '',
    },
    {
      city: 'Joubb Jann\u00eene',
      lat: '33.6269',
      lng: '35.7842',
      country: 'Lebanon',
      iso2: 'LB',
      admin_name: 'B\u00e9qaa',
      capital: 'minor',
      population: '',
      population_proper: '',
    },
    {
      city: 'Be\u00eft ed D\u00eene',
      lat: '33.6942',
      lng: '35.5808',
      country: 'Lebanon',
      iso2: 'LB',
      admin_name: 'Mont-Liban',
      capital: 'minor',
      population: '',
      population_proper: '',
    },
    {
      city: 'El Hermel',
      lat: '34.3942',
      lng: '36.3847',
      country: 'Lebanon',
      iso2: 'LB',
      admin_name: 'Baalbek-Hermel',
      capital: 'minor',
      population: '',
      population_proper: '',
    },
    {
      city: 'R\u00e2cha\u00efya el Ouadi',
      lat: '33.5009',
      lng: '35.8437',
      country: 'Lebanon',
      iso2: 'LB',
      admin_name: 'B\u00e9qaa',
      capital: 'minor',
      population: '',
      population_proper: '',
    },
    {
      city: 'Bcharr\u00e9',
      lat: '34.2514',
      lng: '36.0972',
      country: 'Lebanon',
      iso2: 'LB',
      admin_name: 'Liban-Nord',
      capital: 'minor',
      population: '',
      population_proper: '',
    },
  ];

  const index = cities.findIndex((e) => e.city === city);

  const cartProducts = JSON.parse(localStorage.getItem('Cart'));
  const [loading, setLoading] = useState(false);
  const shops = JSON.parse(localStorage.getItem('shops'));
  const cart = JSON.parse(localStorage.getItem('c'));

  const [order, setOrder] = useState({});

  const createOrder = async (products, items) => {
    setLoading(true);
    products.forEach((product) => {
      if (product == cartProducts[0] && cartProducts.length == 1) {
        console.log(1);
      } else if (product.shop_id != products[0].shop_id) {
        addAlert(true, 'You can only order from a shop at a time');
      }
    });
    const res2 = await axios.post(`/api/address`, {
      address1: address1,
      address2: address2,
      city: city,
      postcode: postcode,
      user_id: id,
    });

    try {
      await axios.put(`/user/profile/changeuserinfo/${id}`, {
        username: username,
        phoneNumber: phoneNum,
      });
    } catch (err) {
      addAlert(true, err.response.data.msg);
    }

    const res = await axios.post('/api/order', {
      shop_id: cartProducts[0].shop_id,
      user_id: id,
      address_id: res2.data.address_id,
    });

    setOrder(res.data);
    await products.forEach(async (product) => {
      await items.forEach(async (item) => {
        if (product.product_id == item.product_id) {
          await createOrderItem(item, res.data);
        }
      });
    });
    await axios.delete(`cart/empty/${localStorage.getItem('cId')}`);
    window.location.replace('/');
    setLoading(false);
  };

  const createOrderItem = async (cartItem, order) => {
    try {
      const res = await axios.post('/api/orderitems', {
        order_item_quantity: cartItem.quantity,
        order_id: order.order_id,
        product_id: cartItem.product_id,
        size: cartItem.product_size,
        color: cartItem.product_color,
      });
    } catch (err) {
      addAlert(true, err.response.data.msg);
    }
  };

  const checkout = async (e) => {
    e.preventDefault();

    await createOrder(cartProducts, cart);
  };

  return (
    <>
      {loading == true ? (
        <Loading />
      ) : (
        <div className="checkout">
          {userAlert.active == true ? (
            <div
              style={{
                position: 'absolute',
                top: '5%',
                width: '300px',
              }}
            >
              <Alert severity="error">{userAlert.desc}</Alert>
            </div>
          ) : null}
          <form onSubmit={checkout}>
            <div className="checkout__left">
              <div>
                <h1
                  style={{
                    paddingLeft: '20%',
                    paddingBottom: '2vh',
                    whiteSpace: 'nowrap',
                    alignSelf: 'center',
                  }}
                >
                  Billing Details
                </h1>
              </div>
              <div className="editprofile">
                <div className="editprofile__edit">
                  <div className="editprofile__edit_username">
                    <TextField
                      id="outlined-basic"
                      label="Username"
                      name="name"
                      variant="outlined"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      fullWidth
                      required
                    />
                  </div>
                  <div className="editproflie__edit_email">
                    <TextField
                      id="outlined-basic"
                      label="Email"
                      variant="outlined"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      fullWidth
                      required
                      disabled
                    />
                  </div>
                  <div className="editprofile__edit_location">
                    <Autocomplete
                      id="combo-box-demo"
                      options={cities}
                      onChange={(e, v) => setCity(v.city)}
                      defaultValue={cities[index]}
                      getOptionLabel={(option) => option.city}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="City"
                          variant="outlined"
                          fullWidth
                          required
                        />
                      )}
                      fullWidth
                    />

                    <div className="editprofile__edit_postcode">
                      <TextField
                        id="outlined-basic"
                        label="Postcode"
                        variant="outlined"
                        value={postcode}
                        fullWidth
                        onChange={(e) => setPostcode(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="edityprofile__edit_location">
                    <TextField
                      id="outlined-basic"
                      label="Street"
                      variant="outlined"
                      value={address1}
                      fullWidth
                      onChange={(e) => setAddress1(e.target.value)}
                      required
                    />
                  </div>
                  <div className="editprofile__edit_location">
                    <TextField
                      id="outlined-basic"
                      label="Building"
                      variant="outlined"
                      value={address2}
                      onChange={(e) => setAddress2(e.target.value)}
                      required
                    />
                    <div style={{ paddingLeft: '10px' }}>
                      <TextField
                        id="outlined-basic"
                        label="Phone Number"
                        variant="outlined"
                        value={phoneNum}
                        onChange={(e) => setPhoneNum(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="editprofile__edit_bottom">
                    <div className="editprofile__edit_submit">
                      <div>
                        <Link
                          to="/cart"
                          style={{
                            textDecoration: 'none',
                          }}
                        >
                          <ArrowBackIcon />
                          Go back To cart
                        </Link>
                      </div>
                      <Button
                        variant="contained"
                        size="large"
                        className={classes.button}
                        startIcon={<SaveIcon />}
                        type="submit"
                      >
                        Confirm Order
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
          <div className="checkout__right">
            <h1 style={{ textAlign: 'Center', paddingTop: '2vh' }}>
              Cart Summary
            </h1>
            <div className="checkout__right_summary">
              {cart.map((item) => (
                <>
                  {cartProducts.map((product) => {
                    if (item.product_id == product.product_id) {
                      return (
                        <CheckoutSummary
                          product={product}
                          shops={shops}
                          color={item.product_color}
                          size={item.product_size}
                        />
                      );
                    }
                  })}
                </>
              ))}
            </div>
            <div
              className="total"
              style={{
                width: '40%',
                margin: 'auto',
              }}
            >
              <h2
                style={{
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                }}
              ></h2>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
export default Checkout;
