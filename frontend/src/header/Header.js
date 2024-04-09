import React from "react";
import { Link } from "react-router-dom";
import Logout from "./includes/Logout";
import SpinnerButtonLoader from "../loader/SpinnerButtonLoader";
import MobileSearchForm from "./includes/MobileSearchForm";
import { has_permission } from "../api/Auth";

const Header = (props) => {
  const { customer, wishList, cart_count, settings } = props;

  const { data: user, isLoading } = customer;
  const view_backend = has_permission('view backend');

  return (
    <header className="header sticky-top header-intro-clearance header-26">
      <div className="header-middle">
        <div className="container">
          <div className="header-left">
            <Link to="/" className="logo">
              <img
                src={"/assets/img/logo/chinaexpress.png"}
                alt={settings?.site_name}
              />
            </Link>
          </div>

          <div className="header-center">
            <MobileSearchForm />
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
              <div className="wishlist">
                <Link to="/checkout">
                  <div className="icon">
                    <i className="icon-shopping-bag" />
                    <span className="wishlist-count badge">{cart_count}</span>
                  </div>
                </Link>
              </div>
              {user?.id ? (
                <div className="dropdown cart-dropdown">
                  <Link
                    to="/dashboard"
                    className="dropdown-toggle"
                    role="button"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                    data-display="static"
                  >
                    <div className="icon">
                      <i className="icon-user-male" />
                      <span className="d-md-inline d-none nav-item-text">
                        {user?.name || "Customer"}
                      </span>
                    </div>
                  </Link>
                  <div className="dropdown-menu dropdown-menu-right nav_customer_menus">
                    {view_backend && (
                      <Link to="/manage/dashboard" className="dropdown-item">
                        Admin Dashboard
                      </Link>
                    )}
                    <Link to="/dashboard" className="dropdown-item">
                      Dashboard
                    </Link>
                    <Link to="/dashboard/orders" className="dropdown-item">
                      My Orders
                    </Link>
                    <Link to="/dashboard/address" className="dropdown-item">
                      Address
                    </Link>
                    <Link to="/dashboard/profile" className="dropdown-item">
                      Profile
                    </Link>
                    <Logout />
                  </div>
                  {/* End .dropdown-menu */}
                </div>
              ) : isLoading ? (
                <SpinnerButtonLoader
                  buttonClass={"btn-light px-3"}
                  textClass={"text-dark"}
                />
              ) : (
                <div className="cart-dropdown">
                  <Link to="/login">
                    <div className="icon">
                      <i className="icon-user" />
                      <span className="d-md-inline d-none nav-item-text">
                        Sign In
                      </span>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
