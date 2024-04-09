import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import {calculate_advanced_rate, CartProductSummary} from "../../../utils/CartHelpers";
import ShippingAddress from "./shipping/ShippingAddress";
import Swal from "sweetalert2";
import { itemValidateWillPayment } from "../../../utils/AliHelpers";
import { analyticsEventTracker } from "../../../utils/AnalyticsHelpers";
import { fbTrackCustom } from "../../../utils/FacebookPixel";
import { useMediaQuery } from "react-responsive";

const CheckoutSidebar = (props) => {
  const { settings, cart, cartItems } = props;
  const [manageShipping, setManageShipping] = useState(false);
  const history = useHistory();

  const gaEventTracker = (eventName) => {
    analyticsEventTracker("Checkout Page", eventName);
  };

  const currency = settings?.currency_icon;
  const current_rate = settings?.payment_advanched_rate || 0;
  const advanced_rates = settings?.advanced_rates || null;

  const { totalPrice, advanced, dueAmount, totalQty } = CartProductSummary(
    cart,
    advanced_rates,
    current_rate
  );
  const shipping = cart?.shipping ? JSON.parse(cart?.shipping) : {};
  const calculateAdv = totalPrice ?  calculate_advanced_rate(totalPrice,  advanced_rates, current_rate) : 100;


  const manageShippingAddress = (e) => {
    e.preventDefault();
    setManageShipping(true);
  };

  const processToPaymentPage = (e) => {
    e.preventDefault();
    const process = itemValidateWillPayment(cartItems, settings);
    if (process) {
      let willProcess = true;
      if (!totalPrice) {
        Swal.fire({
          text: "Please select your item first",
          icon: "info",
          confirmButtonText: "Ok, Understood",
        });
        willProcess = false;
      }
      if (!shipping?.phone) {
        Swal.fire({
          text: "Set your shipping address",
          icon: "info",
          confirmButtonText: "Ok, Understood",
        });
        willProcess = false;
      }
      if (willProcess) {
        history.push("/payment");
        gaEventTracker("process-to-payment");
        fbTrackCustom("checkout-process-button", {
          click: "click-process-to-checkout-for-payment",
        });
      }
    }
  };

  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  return (
    <>
      <div className="card my-3 my-lg-5">
        <div className="card-body mb-3">
          {manageShipping && (
            <ShippingAddress
              cart={cart}
              setManageShipping={setManageShipping}
              shipping={shipping}
            />
          )}
          <h3>Shipping and Summary</h3>
          <div className="summary summary-cart">
            <div className="border my-3 p-3 rounded shipping_info">
              <div className="align-items-center row">
                <div className="col-7">
                  <h4 className="m-0">Shipping Address</h4>
                </div>
                <div className="col text-right">
                  <a
                    href={"/shipping"}
                    onClick={(e) => manageShippingAddress(e)}
                  >
                    <i className="icon-edit" /> Manage
                  </a>
                </div>
              </div>
              <hr className="my-1" />
              {shipping?.phone ? (
                <p className="mb-2">
                  <strong>Name:</strong> {shipping?.name} <br />
                  <strong>Phone:</strong> {shipping?.phone} <br />
                  <strong>District: </strong>
                  {shipping?.city} <br />
                  <strong>Full Address:</strong> {shipping?.address}
                </p>
              ) : (
                <div className="text-center py-5">
                  <a
                    href={"/shipping"}
                    onClick={(e) => manageShippingAddress(e)}
                  >
                    <i className="fas fa-pen" /> Shipping
                  </a>
                </div>
              )}
            </div>

            <div className="border my-3 p-3 rounded shipping_info">
              <h4>Checkout Summary</h4>
              <table className="table mb-0 table-summary">
                <tbody>
                  <tr className="summary-total">
                    <td className="text-left">Subtotal:</td>
                    <td className="text-right">{`${
                      currency + " " + totalPrice
                    }`}</td>
                  </tr>
                  <tr className="summary-total">
                    <td className="text-left">Need To Pay: {calculateAdv}%</td>
                    <td className="text-right">{`${
                      currency + " " + advanced
                    }`}</td>
                  </tr>
                  <tr className="summary-total">
                    <td className="text-left">Due Amount:</td>
                    <td className="text-right">{`${
                      currency + " " + dueAmount
                    }`}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          {!isMobile && (
            <div className="summary summary-cart">
              <a
                href={`/payment`}
                onClick={(e) => processToPaymentPage(e)}
                className="btn btn-block btn-default"
              >
                PROCEED TO CHECKOUT
              </a>
            </div>
          )}
        </div>
      </div>
      {isMobile && (
        <nav className="stick_footer_nav stick_add_to_cart_nav ">
          <div className="row">
            <div className="col">
              <a
                href={`/payment`}
                onClick={(e) => processToPaymentPage(e)}
                className="btn btn-block btn-default"
              >
                PROCEED TO CHECKOUT
              </a>
            </div>
          </div>
        </nav>
      )}
    </>
  );
};

export default CheckoutSidebar;
