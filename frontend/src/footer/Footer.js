import React from "react";
import { Link } from "react-router-dom";
import StickyFooterManage from "./includes/StickyFooterManage";
import { useSettings } from "../api/GeneralApi";
import { analyticsEventTracker } from "../utils/AnalyticsHelpers";

const Footer = () => {

  const gaEventTracker = (eventName) => {
    analyticsEventTracker('ChinaExpress-Footer', eventName);
  };

  const { data: settings } = useSettings();

  return (
    <footer className="footer footer-2 font-weight-normal second-primary-color">
      <div className="footer-middle border-0">
        <div className="container">
          <div className="row">
            <div className="col-12 col-sm-6 col-md-4 col-lg-3">
              <div className="widget widget-about mb-4">
                <Link to="/">
                  <img
                    src={"/assets/img/logo/chinaexpress.png"}
                    className="footer-logo mb-0"
                    alt={settings?.site_name}
                  />
                </Link>
                <div className="font-weight-normal second-primary-color">
                  <p>{settings?.footer_description}</p>
                  <ul className="contact-list">
                    <li>
                      {settings?.office_address}
                    </li>
                    <li>
                      <i className="icon-phone" />
                      <a
                        href={`tel:${settings?.office_phone}`}
                        style={{ fontSize: '1.1rem' }}
                        className="font-weight-bold"
                        onClick={() => gaEventTracker('click-call')}
                      >
                        {settings?.office_phone}
                      </a>
                    </li>
                    <li>
                      <i className="icon-mail" />
                      <a
                        href={`mailto:${settings?.office_email}`}
                        onClick={() => gaEventTracker('click-mail')}
                      >
                        {settings?.office_email}
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-md-4 col-lg-3">
              <div className="widget mb-4">
                <h4 className="widget-title"> About </h4>
                <ul className="widget-list">
                  <li>
                    <Link to="/pages/about-us">About Us</Link>
                  </li>
                  <li>
                    <Link to="/contact">Contact us</Link>
                  </li>
                  <li>
                    <Link to="/pages/privacy-policy">Privacy Policy</Link>
                  </li>
                  <li>
                    <Link to="/pages/terms-and-conditions">Terms and conditions</Link>
                  </li>
                  <li>
                    <Link to="/pages/return-and-refund-policy">Return and Refund Policy</Link>
                  </li>
                  <li>
                    <Link to="/pages/secured-payment">Secured Payment</Link>
                  </li>
                  <li>
                    <a href="https://www.chinabazarb2b.com" rel="noreferrer" target="_blank">Buy at Wholesale Price</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-md-4 col-lg-3">
              <div className="widget mb-4">
                <h4 className="widget-title">
                  Service Link
                </h4>
                <ul className="widget-list">
                  <li>
                    <Link to="/pages/how-to-buy">How To Buy</Link>
                  </li>
                  <li>
                    <Link to="/pages/shipping-and-delivery">Shipping & Delivery Time</Link>
                  </li>
                  <li>
                    <Link to="/pages/custom-and-shipping-charge">Shipping Charge</Link>
                  </li>
                  <li>
                    <Link to="/pages/minimum-order-quantity">Minimum Order</Link>
                  </li>
                  <li>
                    <Link to="/pages/prohibited-items">Prohibited Items</Link>
                  </li>
                  <li>
                    <Link to="/pages/BD-delivery-charge">BD Delivery Charge</Link>
                  </li>
                  <li>
                    <a href="https://www.youtube.com/watch?v=fB0bktxGZ4c&t=20s" rel="noreferrer" target="_blank">Tutorial</a>
                  </li>
                </ul>
                {/* End .widget-list */}
              </div>
            </div>
            <div className="col-12 col-sm-6 col-md-4 col-lg-3">
              <div className="widget mb-4">
                <h4 className="widget-title">
                  Customer
                </h4>
                {/* End .widget-title */}
                <ul className="widget-list">
                  <li>
                    <Link to="/login">Sign In</Link>
                  </li>
                  <li>
                    <Link to="/pages/special-offer">
                      Special Offer
                    </Link>
                  </li>
                  <li>
                    <Link to="/checkout">View Cart</Link>
                  </li>
                  <li>
                    <Link to="/dashboard/orders">
                      Track My Order
                    </Link>
                  </li>
                  <li>
                    <Link to="/faq">FAQ</Link>
                  </li>
                  <li>
                    <Link to="/pages/media">Media</Link>
                  </li>
                </ul>
                {/* End .widget-list */}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="desktop_messenger d-none d-md-block">
        <a className="nav-link" href="https://m.me/ChinaExpress.01933778855" rel="noreferrer" target="_blank">
          <span className="sticky_nav_icon"><i className="icon-messenger" /></span>
        </a>
      </div>

      <StickyFooterManage settings={settings} />
    </footer>
  );
};


export default Footer;
