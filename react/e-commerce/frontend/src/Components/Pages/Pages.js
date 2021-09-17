import React, { Suspense, useContext, useEffect, useState } from 'react';
import { GlobalState } from '../../GlobalState';
import { Switch, Route } from 'react-router-dom';
import Loading from '../Utils/Loading';
import { set } from 'react-ga';
const Login = React.lazy(() => import('../Auth/Login'));
const Register = React.lazy(() => import('../Auth/Register'));
const NotFound = React.lazy(() => import('../Not Found/NotFound'));
const ProductsRow = React.lazy(() => import('../ProductsRow/ProductsRow'));
const ProductDetails = React.lazy(() => import('../Details/ProductDetails2'));
const Cart = React.lazy(() => import('../Cart/Cart2'));
const MainCover = React.lazy(() => import('../HomePage/MainCover'));
const ProductCategory = React.lazy(() =>
  import('../Product Category/ProductCategory')
);
const ProductShop = React.lazy(() => import('../ProductsShop/ProductShop'));
const Shops = React.lazy(() => import('../Shops/Shops'));
const Provider = React.lazy(() => import('../Provider/Provider'));
const ManageProducts = React.lazy(() =>
  import('../ManageProducts/ManageProducts')
);
const DeleteProduct = React.lazy(() =>
  import('../DeleteProducts/DeleteProduct')
);
const Checkout = React.lazy(() => import('../Checkout/Checkout'));
const EditProducts = React.lazy(() => import('../EditProducts/EditProducts'));
const EditProductFields = React.lazy(() =>
  import('../EditProductFields/EditProductFields')
);
const ShopOrders = React.lazy(() => import('../ShopOrders/ShopOrders'));
const Profile = React.lazy(() => import('../Profile/Profile2'));
const Editprofile = React.lazy(() => import('../EditProfile/EditProfile'));
const EditPassword = React.lazy(() => import('../EditPassword/EditPassword'));
const OrdersSummary = React.lazy(() =>
  import('../OrdersSummary/OrderSummary2')
);
const ProviderUserInfo = React.lazy(() =>
  import('../ProviderUserInfo/ProviderUserInfo')
);
const EditShopProfile = React.lazy(() =>
  import('../EditShopProfile/EditShopProfile')
);
const OrderDetails = React.lazy(() => import('../OrdersDetails/OrderDetails'));
const About = React.lazy(() => import('../About/About'));
const MainHeader = React.lazy(() => import('../Header/MainHeader'));

function Pages() {
  const isLogged = localStorage.getItem('user');
  const isProvider = localStorage.getItem('provider');
  const isLoaded =
    localStorage.getItem('shops') && localStorage.getItem('categories');
  const showHeader = () => {
    return <MainHeader />;
  };

  return (
    <Suspense fallback={<Loading />}>
      {isLoaded ? (
        <MainHeader />
      ) : (
        setTimeout(() => {
          showHeader();
        }, 2000)
      )}
      <Switch>
        <Route path="/" exact component={isProvider ? ShopOrders : MainCover} />

        <Route
          path="/profile"
          exact
          component={isLogged ? Profile : NotFound}
        />
        <Route path="/editprofile" exact component={Editprofile} />
        <Route path="/editprofile/editpassword" component={EditPassword} />
        <Route path="/products" exact component={ProductsRow} />
        <Route path="/details/:id" exact component={ProductDetails} />
        <Route path="/category/:id" exact component={ProductCategory} />
        <Route path="/shop/:id" exact component={ProductShop} />
        <Route path="/shops" exact component={Shops} />
        <Route path="/login" exact component={Login} />
        <Route path="/register" exact component={Register} />
        <Route path="/cart" exact component={Cart} />
        <Route path="/checkout" exact component={Checkout} />
        <Route path="/allorders" component={OrdersSummary} />
        <Route path="/order/details" component={OrderDetails} />

        <Route path="/provider" exact component={Provider} />
        <Route path="/provider/manage" exact component={ManageProducts} />
        <Route path="/shopOrder" exact component={ShopOrders} />
        <Route
          path="/provider/delete-product"
          exact
          component={DeleteProduct}
        />
        <Route path="/provider/edit-product" exact component={EditProducts} />
        <Route
          path="/provider/edit-product/:id"
          exact
          component={EditProductFields}
        />
        <Route
          path="/provider/edit-shop-info"
          exact
          component={EditShopProfile}
        />
        <Route path="/provider/order" exact component={OrderDetails} />
        <Route path="/user/info" exact component={ProviderUserInfo} />
        <Route path="/about" exact component={About} />

        <Route path="*" exact component={NotFound} />
      </Switch>
    </Suspense>
  );
}

export default Pages;
