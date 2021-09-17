import React, { useContext, useState, useEffect } from 'react';

import { GlobalState } from '../../GlobalState';

import { makeStyles } from '@material-ui/core/styles';

// Icons
import MailIcon from '@material-ui/icons/Mail';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import PhoneIcon from '@material-ui/icons/Phone';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';

import { Link, useParams } from 'react-router-dom';
import pic from '../../images/profile_pic.svg';
import axios from '../../axios';

import './Profile2.css';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(0),
    },
  },
}));

function Profile() {
  const classes = useStyles();

  const state = useContext(GlobalState);

  const [userId] = state.userAPI.userId;
  const products = JSON.parse(localStorage.getItem('products'));
  const params = useParams();

  const userinfo = JSON.parse(localStorage.getItem('userInfo'));
  const useraddress = JSON.parse(localStorage.getItem('userAddress'));

  const [selectedDate, setSelectedDate] = useState('');
  const [gender, setGender] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [postCode, setPostCode] = useState('');
  const [username, setUsername] = useState('');
  const [password] = useState('***********');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [userPoints, setUserPoints] = useState('');
  const [phonenum, setPhonenum] = useState('');
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [finishCount, setfinishCount] = useState(0);
  const [rejectedCount, setrejectedCount] = useState(0);
  const [acceptCount, setAcceptCount] = useState(0);

  const getOrders = async () => {
    const res = await axios.get(`/api/order?user_id=${userId}`);
    setOrders(res.data);
    localStorage.setItem('orders', JSON.stringify(res.data));
  };

  const t = () => {
    JSON.parse(localStorage.getItem('orders')).map((order) => {
      if (order.order_status == 'pending') {
        setPendingCount((pendingCount) => pendingCount + 1);
      } else if (order.order_status == 'Completed') {
        setfinishCount((finishCount) => finishCount + 1);
      } else if (order.order_status == 'rejected') {
        setrejectedCount((rejectedCount) => rejectedCount + 1);
      } else {
        setAcceptCount((acceptCount) => acceptCount + 1);
      }
    });
  };

  useEffect(() => {
    if (!localStorage.getItem('orders')) {
      getOrders();
    }

    // setUserPoints(userinfo.user_points);
    userinfo.gender === null
      ? setGender('Not Selected')
      : setGender(userinfo.gender);
    setAddress1(useraddress.address1);
    setAddress2(useraddress.address2);
    setPostCode(useraddress.postcode);
    setUsername(userinfo.user_username);
    userinfo.phoneNumber === null
      ? setPhonenum('Not provided')
      : setPhonenum(userinfo.phoneNumber);
    setEmail(userinfo.user_email);
    setCity(useraddress.city);
    userinfo.birthDate === null
      ? setSelectedDate('Not Selected')
      : setSelectedDate(userinfo.birthDate.substring(0, 10));
  }, [userId]);

  useEffect(() => {
    if (params.id) {
      products.forEach((product) => {
        if (product.product_id == params.id) setRecommendedProducts(product);
      });
    }
  }, [params]);
  useEffect(() => {
    t();
  }, []);

  return (
    <div className="profile">
      <div className="option">
        <div className="option__top">
          <div className="option__top_pic">
            <div className="option__pic">
              <img
                src={pic}
                alt="logo"
                style={{
                  width: '70px',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'end',
                }}
              />
            </div>
          </div>
          <div className="option__top_points">
            <p className="option__top_points-pnum">
              {/* <span title="Points Gained">{userPoints}</span>
              <p className="option__top_points-ptitle">Points</p> */}
            </p>
          </div>
        </div>
        <div className="option__">
          <div className="option__disc">
            <p className="option__disc_name">{username}</p>
            <div className="option__disc_email">
              <MailIcon />
              <p className="option__disc_email-p">{email}</p>
            </div>
            <div className="option__disc_location">
              <LocationOnIcon />
              <p className="option__disc_location-p">
                {city + ' ' + address1 + ' ' + address2}
              </p>
            </div>
            <div className="option__disc_phone">
              <PhoneIcon />
              <p className="option__disc_phone-p">{phonenum}</p>
            </div>
            <div className="option__disc_gender">
              <PermIdentityIcon />
              <p className="option__disc_gender-p">{gender}</p>
            </div>
            <div className="option__disc_cal">
              <CalendarTodayIcon />
              <p className="option__disc_cal-p">{selectedDate}</p>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="option__bottom">
            <div className="option__bottom_N-orders">
              <p>
                Orders:{' '}
                <span>{JSON.parse(localStorage.getItem('orders')).length}</span>
              </p>
            </div>
            <div className="option__bottom_orders-pending">
              <p className="option__bottom_orders-pending-p">
                Pending: <span>{pendingCount}</span>
              </p>
              <p className="option__bottom_orders-pending-p">
                Complete: <span>{finishCount}</span>
              </p>
              <p className="option__bottom_orders-pending-p">
                Accept: <span>{acceptCount}</span>
              </p>
              <p className="option__bottom_orders-pending-p">
                Rejected: <span>{rejectedCount}</span>
              </p>
            </div>
          </div>
          <div className="option__edit">
            <div className={classes.root}>
              <Link to="/editprofile">Edit Profile</Link>
            </div>
            <div className={classes.root}>
              <Link to="/allorders" size="small" fullWidth={true}>
                Show all orders
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="profile__recommendedProducts">
        <div className="profile__recommendedProducts_title">
          {/* <p>Recommended Products</p> */}
          {/* <div className="profile__recommendedProducts_title_showorders">
						<a
							href="/allorders"
							style={{
								textDecoration: "none",
								color: "inherit",
							}}>
							<p>Show all orders</p>
						</a>
					</div> */}
        </div>
        {/* <Grid container>
          {products.map((product) => {
            return product.category_id === recommendedProducts.category_id ? (
              <Grid item xs={12} md={4}>
                <Product key={product.product_id} product={product} />
              </Grid>
            ) : null;
          })}
        </Grid> */}
      </div>
    </div>
  );
}

export default Profile;
