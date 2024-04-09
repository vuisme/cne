import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import MobileSearchForm from "./includes/MobileSearchForm";

const MobileHeader = (props) => {
  const { wishList, cart_count, settings } = props;

  return (
    <header className="header mobile_header sticky-top header-intro-clearance header-26">
      <div className="header-middle">
        <div className="container">
          <div className="header-left">
            <Link to="/" className="logo">
              <img
                src={`/assets/img/logo/chinaexpress.png`}
                alt={settings?.site_name}
              />
            </Link>
          </div>

          <div className="header-right">
            <div className="header-dropdown-link">
              <div className="wishlist">
                <Link to="/dashboard/wishlist" title="Wishlist">
                  <div className="icon">
                    <i className="icon-heart-empty" />
                    <span className="wishlist-count badge">
                      {wishList?.length || 0}
                    </span>
                  </div>
                </Link>
              </div>
              {/* End .compare-dropdown */}
              <div className="wishlist">
                <Link to="/checkout">
                  <div className="icon">
                    <i className="icon-cart" />
                    <span className="wishlist-count badge">{cart_count}</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
          {/* End .header-right */}
        </div>
        {/* End .container */}
      </div>
      <MobileSearchForm />
    </header>
  );
};

export default MobileHeader;
