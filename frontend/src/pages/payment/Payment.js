import React, {useEffect} from "react";
import {calculate_advanced_rate, CartProductSummary} from "../../utils/CartHelpers";
import Swal from "sweetalert2";
import BkashPayment from "./includes/BkashPayment";
import {useSettings} from "../../api/GeneralApi";
import {useCartMutation, useCart} from "../../api/CartApi";
import SmallSpinner from "../../loader/SmallSpinner";
import PaymentItem from "./includes/PaymentItem";
import {goPageTop} from "../../utils/Helpers";
import Helmet from "react-helmet";
import {itemValidateWillPayment} from "../../utils/AliHelpers";
import {
  analyticsEventTracker,
  analyticsPageView,
} from "../../utils/AnalyticsHelpers";
import {
  fbPixelSimplePurchase,
  fbTrackCustom,
} from "../../utils/FacebookPixel";
import {useQueryClient} from "react-query";

const Payment = (props) => {
  const {data: settings} = useSettings();
  const {data: cart} = useCart();
  const cartItems = cart?.cart_items || [];
  const shipping = cart?.shipping ? JSON.parse(cart?.shipping) : {};

  const cache = useQueryClient();
  const {PaymentMethod, confirmOrder} = useCartMutation();

  const currency = settings?.currency_icon || "৳";
  const current_rate = settings?.payment_advanched_rate || 0;
  const advanced_rates = settings?.advanced_rates || null;

  const shippingRate = 650;
  const payment_method = cart?.payment_method || false;

  const {totalPrice, advanced} = CartProductSummary(cart, advanced_rates, current_rate);

  useEffect(() => {
    goPageTop();
    analyticsPageView();
  }, []);

  const selectPaymentMethod = (event) => {
    const method = event.target.value;
    if (method) {
      PaymentMethod.mutateAsync({method});
    }
  };

  const paymentConfirm = (e) => {
    e.preventDefault();
    if (!payment_method) {
      Swal.fire({
        text: "Select your payment method",
        icon: "warning",
        confirmButtonText: "Ok, Understood",
      });
      return "";
    }
    if (!shipping?.phone) {
      Swal.fire({
        text: "Select your shipping information",
        icon: "warning",
        confirmButtonText: "Ok, Understood",
      });
      return "";
    }

    if (!totalPrice) {
      Swal.fire({
        text: "You have no Item. Please select your item from checkout",
        icon: "warning",
        confirmButtonText: "Ok, Understood",
      });
      return "";
    }

    const process = itemValidateWillPayment(cartItems, settings);
    if (process) {
      analyticsEventTracker("Payment Page", "payment-process");
      fbTrackCustom("payment-process-click", {
        click: "click-for-partial-payment",
      });
      fbPixelSimplePurchase(totalPrice);
      confirmOrder.mutateAsync().then((response) => {
        if (response?.status) {
          cache.invalidateQueries("customer_cart");
          cache.invalidateQueries("useCheckoutCart");
          // console.log('response.redirect', response.redirect)
          window.location.replace(response.redirect);
        }
      });
    }
  };

  return (
    <main className="main">
      <Helmet>
        <title>Complete your payment</title>
      </Helmet>

      <div className="page-content">
        <div className="cart">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8 order-1 order-lg-0">
                <div className="card my-3 my-lg-5">
                  <div className="card-body">
                    <h3>Payment</h3>

                    <PaymentItem
                      cart={cart}
                      cartItems={cartItems}
                      currency={currency}
                      shippingRate={shippingRate}
                      settings={settings}
                    />

                    <div className="row my-3 my-lg-5">
                      <div className="col-md-6">
                        <div className="card payment_card text-center">
                          <div className="form-check form-check-inline mx-auto">
                            {PaymentMethod?.isLoading ? (
                              <SmallSpinner/>
                            ) : (
                              <input
                                className="form-check-input mr-2"
                                type="radio"
                                name="payment_method"
                                onChange={(event) => selectPaymentMethod(event)}
                                id="bkash"
                                value="bkash"
                                checked={payment_method === "bkash"}
                              />
                            )}
                            <label className="form-check-label" htmlFor="bkash">
                              <img
                                src={`/assets/img/payment/bkash.png`}
                                alt="bkash"
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <BkashPayment
                      advanced={advanced}
                      paymentConfirm={paymentConfirm}
                      confirmOrder={confirmOrder}
                    />
                  </div>
                </div>
                {/*	 card */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Payment;
