import React, { useEffect } from "react";
import { Switch } from "react-router-dom";
import Home from "./pages/home/Home";
import Login from "./auth/login/Login";
import My404Component from "./pages/404/My404Component";
import Faq from "./pages/faq/Faq";
import Contact from "./pages/contact/Contact";
import SinglePage from "./pages/single/SinglePage";
import ProductSingle from "./pages/product/productSingleNew/ProductSingle";
import Checkout from "./pages/checkout/Checkout";
import Wishlist from "./pages/wishlist/Wishlist";
import LoadCategory from "./pages/category/LoadCategory";
import LoadShopProducts from "./pages/shop/LoadShopProducts";
import LoadSearchProducts from "./pages/search/LoadSearchProducts";
import Dashboard from "./auth/dashboard/Dashboard";
import Payment from "./pages/payment/Payment";
import LoadPictureSearchProduct from "./pages/search/LoadPictureSearchProduct";
import AliProductPage from "./pages/aliexpress/product/AliProductPage";
import ForgotPassword from "./auth/forgot/ForgotPassword";
import OnlinePaymentStatus from "./pages/payment/OnlinePaymentStatus";
import OrderDetails from "./auth/dashboard/orders/OrderDetails";
import AllOrders from "./auth/dashboard/orders/AllOrders";
import Profile from "./auth/dashboard/Profile";
import ManageAddress from "./auth/dashboard/address/ManageAddress";
import LatestArrivedProduct from "./pages/newArrive/LatestArrivedProduct";
import AliSellerPage from "./pages/aliexpress/aliSeller/AliSellerPage";
import TaobaoSellerPage from "./pages/taobaoSeller/taobaoSeller/TaobaoSellerPage";
import { analyticsPageView } from "./utils/AnalyticsHelpers";
import FavoriteProduct from "./pages/favorite/FavoriteProduct";
import RecentViewProduct from "./pages/recent-view/RecentViewProduct";
import Invoices from "./auth/dashboard/invoices/Invoices";
import InvoiceDetails from "./auth/dashboard/invoices/InvoiceDetails";
import WalletDetails from "./auth/dashboard/orders/WalletDetails";
import FrontRoute from "./routers/FrontRoute";
import FrontAuthRoute from "./routers/FrontAuthRoute";
import AdminRouting from "./AdminRouting";
import AliExpressProduct404 from "./pages/404/AliExpressProduct404";

const Routing = () => {
  useEffect(() => {
    analyticsPageView();
  }, []);

  return (
    <>
      <Switch>
        <FrontRoute path="/" exact component={Home} />
        <FrontRoute path="/login" exact component={Login} />
        <FrontRoute path="/forgot-password" exact component={ForgotPassword} />
        <FrontRoute path="/faq" exact component={Faq} />
        <FrontRoute path="/contact" exact component={Contact} />
        <FrontRoute
          path="/new-arrived"
          exact
          component={LatestArrivedProduct}
        />
        <FrontRoute
          path="/customer-favorite"
          exact
          component={FavoriteProduct}
        />
        <FrontRoute path="/recent-view" exact component={RecentViewProduct} />

        <FrontRoute path="/pages/:slug" exact component={SinglePage} />
        <FrontRoute path="/product/:item_id" exact component={ProductSingle} />
        <FrontRoute
          path="/taobao/vendor/:seller_id?"
          exact={true}
          component={TaobaoSellerPage}
        />
        <FrontRoute
          path="/search"
          exact={true}
          component={LoadSearchProducts}
        />
        <FrontRoute
          path="/search/picture/:search_id"
          exact
          component={LoadPictureSearchProduct}
        />
        <FrontRoute
          path="/shop/:category_slug"
          exact
          component={LoadShopProducts}
        />
        {/* start aliexpress route develop */}
        <FrontRoute
          path="/aliexpress/product/:product_id"
          exact={true}
          // component={AliProductPage}
          component={AliExpressProduct404}
        />
        <FrontRoute
          path="/aliexpress/seller/:seller_id?"
          exact={true}
          component={AliExpressProduct404}
          // component={AliSellerPage}
        />
        {/* end aliexpress route develop */}

        <FrontAuthRoute path="/checkout" exact component={Checkout} />
        <FrontAuthRoute path="/payment" exact component={Payment} />
        <FrontAuthRoute
          path="/online/payment/:status"
          exact
          component={OnlinePaymentStatus}
        />
        <FrontAuthRoute path="/dashboard" exact component={Dashboard} />
        <FrontAuthRoute path="/dashboard/orders" exact component={AllOrders} />
        <FrontAuthRoute
          path="/dashboard/orders/:tran_id"
          exact
          component={OrderDetails}
        />
        <FrontAuthRoute
          path="/dashboard/wallet/:id"
          exact
          component={WalletDetails}
        />
        <FrontAuthRoute
          path="/dashboard/my-invoice"
          exact
          component={Invoices}
        />
        <FrontAuthRoute
          path="/dashboard/invoice/:invoice_id"
          exact
          component={InvoiceDetails}
        />
        <FrontAuthRoute path="/dashboard/wishlist" exact component={Wishlist} />
        <FrontAuthRoute
          path="/dashboard/address"
          exact
          component={ManageAddress}
        />
        <FrontAuthRoute path="/dashboard/profile" exact component={Profile} />

        <AdminRouting />

        <FrontRoute
          path="/:category_slug/:sub_slug?"
          exact
          component={LoadCategory}
        />
        <FrontRoute path="*" exact component={My404Component} />
      </Switch>
    </>
  );
};

export default Routing;
