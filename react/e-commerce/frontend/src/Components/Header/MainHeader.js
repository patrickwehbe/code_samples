import React, { useContext, useEffect, useState } from 'react';
import { GlobalState } from '../../GlobalState';
import './MainHeader.css';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import DehazeIcon from '@material-ui/icons/Dehaze';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import IconButton from '@material-ui/core/IconButton';
import { Link } from 'react-router-dom';
import logo from '../../images/logoname.svg';
import nitchdLogo from '../../images/nitchd_logo_name-removebg-preview.svg';
import axios from '../../axios';
import hoodieLogo from '../../images/hoodie.svg';
import skirtLogo from '../../images/skirt.svg';
import silver_accessoriesLogo from '../../images/silver_accessories.svg';
import braceletLogo from '../../images/bracelet.svg';
import dressLogo from '../../images/dress.svg';
import handbagLogo from '../../images/handbag.svg';
import hatLogo from '../../images/hat.svg';
import jeansLogo from '../../images/jeans.svg';
import pantsLogo from '../../images/pants.svg';
import shirtLogo from '../../images/shirt.svg';
import shoesLogo from '../../images/shoes.svg';
import shortsLogo from '../../images/shorts.svg';
import boxerLogo from '../../images/boxers.svg';
import SwimsuitsLogo from '../../images/swimming-suit.svg';
import lingerieLogo from '../../images/valentines.svg';
import HomeIcon from '@material-ui/icons/Home';
import { ListItemIcon } from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
import StorefrontIcon from '@material-ui/icons/Storefront';
import CategoryIcon from '@material-ui/icons/Category';

const useStyles = makeStyles({
  list: {
    minWidth: '200px',
    backgroundColor: 'transparent',
  },
  fullList: {
    width: 'auto',
  },
  nested: {
    paddingLeft: '40px',
  },
  paper: {
    background: 'linear-gradient(to bottom right, #b3b1b1 10%, #ffffff 74%)',
  },
});

function MainHeader() {
  const logoutUser = async () => {
    await axios.get('/user/logout');

    localStorage.removeItem('firstLogin');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('userAddress');
    localStorage.removeItem('Cart');
    localStorage.removeItem('c');
    localStorage.removeItem('at');
    localStorage.removeItem('orders');
    localStorage.removeItem('id');
    localStorage.removeItem('provider');
    localStorage.removeItem('user');
    localStorage.removeItem('shopId');
    localStorage.removeItem('cId');
    localStorage.removeItem('current');

    window.location.href = '/';
  };

  const state = useContext(GlobalState);
  const isLogged = JSON.parse(localStorage.getItem('firstLogin'));
  const isProvider = JSON.parse(localStorage.getItem('provider'));
  const categories = JSON.parse(localStorage.getItem('categories'));
  const shops = JSON.parse(localStorage.getItem('shops'));

  const [cart, setCart] = state.userAPI.cart;
  const [banner, setBanner] = useState(0);

  const [open1, setOpen1] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);

  const handleClick1 = () => {
    setOpen1(!open1);
  };
  const handleClick2 = () => {
    setOpen2(!open2);
  };

  const classes = useStyles();
  const [state1, setState1] = React.useState({
    left: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    setState1({ ...state1, [anchor]: open });
  };

  const isLoggedIn = () => {
    if (isLogged) {
      if (isProvider) return providerRouter();
      else {
        return loggedRouter();
      }
    } else {
      return guestRouter();
    }
  };

  const loggedRouter = () => {
    return (
      <>
        <Link to="/profile" style={{ textDecoration: 'none' }}>
          <IconButton className="mainHeader__icons">Profile</IconButton>
        </Link>

        <Link to="/" onClick={logoutUser} style={{ textDecoration: 'none' }}>
          <IconButton className="mainHeader__icons">Logout</IconButton>
        </Link>
      </>
    );
  };
  const guestRouter = () => {
    return (
      <>
        <Link to="/login" style={{ textDecoration: 'none' }}>
          <IconButton className="mainHeader__icons">Login</IconButton>
        </Link>
        <Link to="/register" style={{ textDecoration: 'none' }}>
          <IconButton className="mainHeader__icons">Register</IconButton>
        </Link>
      </>
    );
  };

  const providerRouter = () => {
    return (
      <>
        <Link to="/provider/edit-shop-info" style={{ textDecoration: 'none' }}>
          <IconButton className="mainHeader__icons">Edit-Shop-Info</IconButton>
        </Link>
        <Link to="/provider" style={{ textDecoration: 'none' }}>
          <IconButton className="mainHeader__icons">Create</IconButton>
        </Link>
        <Link to="/provider/edit-product" style={{ textDecoration: 'none' }}>
          <IconButton className="mainHeader__icons">Edit</IconButton>
        </Link>
        <Link to="/provider/delete-product" style={{ textDecoration: 'none' }}>
          <IconButton className="mainHeader__icons">Delete</IconButton>
        </Link>

        <Link to="/shopOrder" style={{ textDecoration: 'none' }}>
          <IconButton className="mainHeader__icons">Orders</IconButton>
        </Link>

        <Link to="/" onClick={logoutUser} style={{ textDecoration: 'none' }}>
          <IconButton className="mainHeader__icons">Logout</IconButton>
        </Link>
      </>
    );
  };

  const list = (anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === 'top' || anchor === 'bottom',
      })}
      role="presentation"
      // onClick={toggleDrawer(anchor, false)}
      style={{
        borderRadius: '30px',
      }}
    >
      <List>
        <ListItem>
          <img
            src={nitchdLogo}
            alt="Nitchd"
            style={{
              height: '20vh',
              width: 'auto',
              objectFit: 'contain',
            }}
          />
        </ListItem>
      </List>

      <List>
        <ListItem>
          <div
            className=""
            style={{
              fontWeight: 'bolder',
              display: 'flex',
            }}
          >
            <HomeIcon />
            <Link
              to="/"
              style={{
                paddingLeft: '20px',
                color: 'black',
                textDecoration: 'none',
              }}
            >
              Home
            </Link>
          </div>
        </ListItem>
      </List>
      <Divider style={{ backgroundColor: 'black' }} />

      <List>
        <ListItem button onClick={handleClick1}>
          <div
            className=""
            style={{
              fontWeight: 'bolder',
              display: 'flex',
            }}
          >
            <StorefrontIcon />
            <p style={{ paddingLeft: '20px' }}>Shops</p>
            <div className="" style={{ position: 'absolute', right: 10 }}>
              {open1 ? <ExpandLess /> : <ExpandMore />}
            </div>
          </div>
        </ListItem>
        <Collapse in={open1} timeout="auto" unmountOnExit>
          <List>
            {shops.map((shop) => {
              return (
                <Link
                  style={{ textDecoration: 'none', color: 'black' }}
                  to={`/shop/${shop.shop_id}`}
                >
                  <ListItem button key={shop.shop_id}>
                    <ListItemIcon>
                      <img
                        src={shop.shop_logo}
                        alt={`${shop.shop_name[0]}`}
                        style={{ height: '40px', width: '40px' }}
                      />
                    </ListItemIcon>
                    <ListItemText primary={shop.shop_name} />
                  </ListItem>
                </Link>
              );
            })}
          </List>
        </Collapse>
      </List>
      <Divider style={{ backgroundColor: 'black' }} />

      <List>
        <ListItem button onClick={handleClick2}>
          <div
            className=""
            style={{
              fontWeight: 'bolder',
              display: 'flex',
            }}
          >
            <CategoryIcon />
            <p style={{ paddingLeft: '20px' }}>Categories</p>
            <div className="" style={{ position: 'absolute', right: 10 }}>
              {open2 ? <ExpandLess /> : <ExpandMore />}
            </div>
          </div>
        </ListItem>
        <Collapse in={open2} timeout="auto" unmountOnExit>
          <List>
            <Link
              style={{ textDecoration: 'none', color: 'black' }}
              to={`/category/1`}
            >
              <ListItem button>
                <ListItemIcon>
                  <img
                    src={hoodieLogo}
                    alt="Jacket logo"
                    style={{ height: '40px', width: '40px' }}
                  />
                </ListItemIcon>
                <ListItemText primary="Jackets" />
              </ListItem>
            </Link>
          </List>
          <List>
            <Link
              style={{ textDecoration: 'none', color: 'black' }}
              to={`/category/2`}
            >
              <ListItem button>
                <ListItemIcon>
                  <img
                    src={shirtLogo}
                    alt="Shirt logo"
                    style={{ height: '40px', width: '40px' }}
                  />
                </ListItemIcon>
                <ListItemText primary="Shirt" />
              </ListItem>
            </Link>
          </List>
          <List>
            <Link
              style={{ textDecoration: 'none', color: 'black' }}
              to={`/category/3`}
            >
              <ListItem button>
                <ListItemIcon>
                  <img
                    src={pantsLogo}
                    alt="Pant logo"
                    style={{ height: '40px', width: '40px' }}
                  />
                </ListItemIcon>
                <ListItemText primary="Pants" />
              </ListItem>
            </Link>
          </List>
          <List>
            <Link
              style={{ textDecoration: 'none', color: 'black' }}
              to={`/category/4`}
            >
              <ListItem button>
                <ListItemIcon>
                  <img
                    src={jeansLogo}
                    alt="Jeans logo"
                    style={{ height: '40px', width: '40px' }}
                  />
                </ListItemIcon>
                <ListItemText primary="Jeans" />
              </ListItem>
            </Link>
          </List>
          <List>
            <Link
              style={{ textDecoration: 'none', color: 'black' }}
              to={`/category/5`}
            >
              <ListItem button>
                <ListItemIcon>
                  <img
                    src={shoesLogo}
                    alt="Shoes logo"
                    style={{ height: '40px', width: '40px' }}
                  />
                </ListItemIcon>
                <ListItemText primary="Shoes" />
              </ListItem>
            </Link>
          </List>
          <List>
            <Link
              style={{ textDecoration: 'none', color: 'black' }}
              to={`/category/6`}
            >
              <ListItem button>
                <ListItemIcon>
                  <img
                    src={hoodieLogo}
                    alt="Hoodies logo"
                    style={{ height: '40px', width: '40px' }}
                  />
                </ListItemIcon>
                <ListItemText primary="Hoodies" />
              </ListItem>
            </Link>
          </List>
          <List>
            <Link
              style={{ textDecoration: 'none', color: 'black' }}
              to={`/category/7`}
            >
              <ListItem button>
                <ListItemIcon>
                  <img
                    src={braceletLogo}
                    alt="Bracelet logo"
                    style={{ height: '40px', width: '40px' }}
                  />
                </ListItemIcon>
                <ListItemText primary="Bracelets" />
              </ListItem>
            </Link>
          </List>
          <List>
            <Link
              style={{ textDecoration: 'none', color: 'black' }}
              to={`/category/8`}
            >
              <ListItem button>
                <ListItemIcon>
                  <img
                    src={silver_accessoriesLogo}
                    alt="silver accessories logo"
                    style={{ height: '40px', width: '40px' }}
                  />
                </ListItemIcon>
                <ListItemText primary="Silver Accessories" />
              </ListItem>
            </Link>
          </List>
          <List>
            <Link
              style={{ textDecoration: 'none', color: 'black' }}
              to={`/category/9`}
            >
              <ListItem button>
                <ListItemIcon>
                  <img
                    src={dressLogo}
                    alt="Dress logo"
                    style={{ height: '40px', width: '40px' }}
                  />
                </ListItemIcon>
                <ListItemText primary="Dresses" />
              </ListItem>
            </Link>
          </List>
          <List>
            <Link
              style={{ textDecoration: 'none', color: 'black' }}
              to={`/category/10`}
            >
              <ListItem button>
                <ListItemIcon>
                  <img
                    src={skirtLogo}
                    alt="Skirt logo"
                    style={{ height: '40px', width: '40px' }}
                  />
                </ListItemIcon>
                <ListItemText primary="Skirts" />
              </ListItem>
            </Link>
          </List>
          <List>
            <Link
              style={{ textDecoration: 'none', color: 'black' }}
              to={`/category/11`}
            >
              <ListItem button>
                <ListItemIcon>
                  <img
                    src={hatLogo}
                    alt="Hat logo"
                    style={{ height: '40px', width: '40px' }}
                  />
                </ListItemIcon>
                <ListItemText primary="Hats" />
              </ListItem>
            </Link>
          </List>
          <List>
            <Link
              style={{ textDecoration: 'none', color: 'black' }}
              to={`/category/12`}
            >
              <ListItem button>
                <ListItemIcon>
                  <img
                    src={shortsLogo}
                    alt="Short logo"
                    style={{ height: '40px', width: '40px' }}
                  />
                </ListItemIcon>
                <ListItemText primary="Shorts" />
              </ListItem>
            </Link>
          </List>
          <List>
            <Link
              style={{ textDecoration: 'none', color: 'black' }}
              to={`/category/13`}
            >
              <ListItem button>
                <ListItemIcon>
                  <img
                    src={handbagLogo}
                    alt="Bag logo"
                    style={{ height: '40px', width: '40px' }}
                  />
                </ListItemIcon>
                <ListItemText primary="Bags" />
              </ListItem>
            </Link>
          </List>
          <List>
            <Link
              style={{ textDecoration: 'none', color: 'black' }}
              to={`/category/14`}
            >
              <ListItem button>
                <ListItemIcon>
                  <img
                    src={boxerLogo}
                    alt="Boxer logo"
                    style={{ height: '40px', width: '40px' }}
                  />
                </ListItemIcon>
                <ListItemText primary="Underwear" />
              </ListItem>
            </Link>
          </List>
          <List>
            <Link
              style={{ textDecoration: 'none', color: 'black' }}
              to={`/category/15`}
            >
              <ListItem button>
                <ListItemIcon>
                  <img
                    src={SwimsuitsLogo}
                    alt="Swimsuit logo"
                    style={{ height: '40px', width: '40px' }}
                  />
                </ListItemIcon>
                <ListItemText primary="Swimsuits" />
              </ListItem>
            </Link>
          </List>
          <List>
            <Link
              style={{ textDecoration: 'none', color: 'black' }}
              to={`/category/16`}
            >
              <ListItem button>
                <ListItemIcon>
                  <img
                    src={lingerieLogo}
                    alt="Lingerie logo"
                    style={{ height: '40px', width: '40px' }}
                  />
                </ListItemIcon>
                <ListItemText primary="Lingerie" />
              </ListItem>
            </Link>
          </List>
        </Collapse>
        <List>
          <ListItem>
            <div
              className=""
              style={{
                fontWeight: 'bolder',
                display: 'flex',
              }}
            >
              <InfoIcon />
              <Link
                to="/about"
                style={{
                  paddingLeft: '20px',
                  color: 'black',
                  textDecoration: 'none',
                }}
              >
                About Us
              </Link>
            </div>
          </ListItem>
        </List>
      </List>
    </div>
  );
  const getBanner = () => {
    setBanner(cart.length);
  };

  useEffect(() => {
    getBanner();
  });

  useEffect(() => {
    console.log('render');
  }, [localStorage.getItem('shops', localStorage.getItem('categories'))]);
  return (
    <div className="mainHeader">
      <div className="mainHeader__left">
        {['left'].map((anchor) => (
          <React.Fragment key={anchor}>
            <div style={{ marginLeft: '10px' }}>
              <DehazeIcon
                onClick={toggleDrawer(anchor, true)}
                size="Large"
              ></DehazeIcon>
            </div>
            <SwipeableDrawer
              anchor={anchor}
              open={state1[anchor]}
              onClose={toggleDrawer(anchor, false)}
              onOpen={toggleDrawer(anchor, true)}
              swipeAreaWidth={15}
              classes={{ paper: classes.paper }}
            >
              {list(anchor)}
            </SwipeableDrawer>
          </React.Fragment>
        ))}
        <Link to="/">
          <img className="logo" src={logo} alt="" />
        </Link>
      </div>

      <div className="mainHeader__right">
        <div className="mainHeader__login">
          {isLoggedIn()}
          {isProvider ? (
            ''
          ) : (
            <IconButton className="mainHeader__icons">
              <span className="badge">{banner}</span>
              <Link
                style={{
                  textDecoration: 'none',
                  color: 'gray',
                }}
                to="/cart"
              >
                <ShoppingBasketIcon fontSize="large" />
              </Link>
            </IconButton>
          )}
        </div>
      </div>
    </div>
  );
}

export default MainHeader;
