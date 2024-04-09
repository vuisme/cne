import React from "react";
import Header from "./Header";
import MobileHeader from "./MobileHeader";
import { useCart } from "../api/CartApi";
import { useCustomer } from "../api/Auth";
import { useWishList } from "../api/WishListApi";
import useResponsive from "../utils/responsive";

const HeaderManage = (props) => {
  const { settings } = props;

  const customer = useCustomer();

  const { data: wishList } = useWishList();
  const { data: cart } = useCart();

  const { isMobile } = useResponsive();

  const cart_count =
    cart?.cart_items?.filter((item) => item?.IsCart > 0)?.length || 0;

  if (isMobile) {
    return (
      <MobileHeader
        customer={customer}
        wishList={wishList}
        cart_count={cart_count}
        settings={settings}
      />
    );
  }

  return (
    <Header
      customer={customer}
      wishList={wishList}
      cart_count={cart_count}
      settings={settings}
    />
  );
};

export default HeaderManage;
