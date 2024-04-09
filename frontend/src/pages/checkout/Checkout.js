import React, { useEffect } from "react";
import Sticky from "react-sticky-el";
import { goPageTop } from "../../utils/Helpers";
import CheckoutSidebar from "./includes/CheckoutSidebar";
import Swal from "sweetalert2";
import { useSettings } from "../../api/GeneralApi";
import { useCartMutation, useCheckoutCart } from "../../api/CartApi";
import CheckoutItem from "./includes/CheckoutItem";
import Helmet from "react-helmet";
import { analyticsPageView } from "../../utils/AnalyticsHelpers";
import { fbTrackCustom } from "../../utils/FacebookPixel";
import { useMediaQuery } from "react-responsive";

const Checkout = (props) => {
  const { data: settings } = useSettings();

  const { data: cart } = useCheckoutCart();

  const cartItems = cart?.cart_items || [];

  const { removeCart } = useCartMutation();

  const isMobile = useMediaQuery({ query: "(max-width: 991px)" });

  const currency = settings?.currency_icon;

  useEffect(() => {
    goPageTop();
    analyticsPageView();
    fbTrackCustom("checkout-page", { browse: "browse-checkout-page" });
  }, []);

  const removeItemFromCart = (e) => {
    e.preventDefault();
    const checkedItem = cartItems?.filter((item) =>
      item.variations.find((find) => find.is_checked > 0)
    );
    if (checkedItem?.length > 0) {
      Swal.fire({
        title: "Are you want to remove?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Remove",
        denyButtonText: `Don't remove`,
      }).then((result) => {
        if (result.isConfirmed) {
          removeCart.mutateAsync();
        }
      });
    } else {
      Swal.fire({
        title: "Please select your item first!",
        icon: "warning",
      });
    }
  };

  return (
    <main className="main stick_block">
      <Helmet>
        <title>Checkout your cart </title>
      </Helmet>

      <div className="container">
        <div className="row">
          <div className="col-lg-8 col-md-7">
            <div className="bg-transparent shadow-none card card-notice mt-2 mt-lg-5">
              <div className="bg-transparent border-0 p-0">
                <img src={`/img/card-info.png`} alt="cart-info" />
              </div>
            </div>
            <div className="card mt-2 my-lg-3">
              <div className="card-body table-responsive-sm">
                <h3>Checked Your Products</h3>
                <div className="my-3">
                  <CheckoutItem
                    settings={settings}
                    currency={currency}
                    cart={cart}
                    cartItems={cartItems}
                    removeCart={removeCart}
                    removeItemFromCart={removeItemFromCart}
                  />
                </div>
              </div>
            </div>
          </div>

          <aside className="col-lg-4 col-md-5">
            {!isMobile ? (
              <CheckoutSidebar
                cart={cart}
                cartItems={cartItems}
                settings={settings}
              />
            ) : (
              <CheckoutSidebar
                cart={cart}
                cartItems={cartItems}
                settings={settings}
              />
            )}
          </aside>
        </div>
        {/* End .row */}
      </div>
      {/* End .container */}
    </main>
  );
};

export default Checkout;
