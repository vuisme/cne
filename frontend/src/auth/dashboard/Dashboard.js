import React, { useEffect } from "react";
import Breadcrumb from "../../pages/breadcrumb/Breadcrumb";
import { NavLink } from "react-router-dom";
import { goPageTop } from "../../utils/Helpers";
import { useAuthMutation } from "../../api/Auth";
import { analyticsPageView } from "../../utils/AnalyticsHelpers";

const Dashboard = (props) => {
  const { authLogout } = useAuthMutation();

  useEffect(() => {
    goPageTop();
    analyticsPageView();
  }, []);

  const authLogoutProcess = async (e) => {
    e.preventDefault();
    authLogout();
  };

  return (
    <main className="main bg-gray">
      <div className="page-content">
        <Breadcrumb current={"Dashboard"} />
        <div className="container">
          <div className="card  dashboard-card my-5">
            <div className="card-body">
              <div className="row">
                <div className="col-lg-3 col-md-4 col-6">
                  <NavLink to={`/dashboard/orders`} className="d-block">
                    <div className="card">
                      <div className="card-body">
                        <div className="card_icon">
                          <i className="icon-th-thumb-empty" />
                        </div>
                        <div className="card_text">Orders</div>
                      </div>
                    </div>
                  </NavLink>
                </div>
                <div className="col-lg-3 col-md-4 col-6">
                  <NavLink to={`/checkout`} className="d-block">
                    <div className="card">
                      <div className="card-body">
                        <div className="card_icon">
                          <i className="icon-cart" />
                        </div>
                        <div className="card_text">My Cart</div>
                      </div>
                    </div>
                  </NavLink>
                </div>
                <div className="col-lg-3 col-md-4 col-6">
                  <NavLink to={`/dashboard/my-invoice`} className="d-block">
                    <div className="card">
                      <div className="card-body">
                        <div className="card_icon">
                          <i className="icon-doc-text" />
                        </div>
                        <div className="card_text">My Invoice</div>
                      </div>
                    </div>
                  </NavLink>
                </div>
                <div className="col-lg-3 col-md-4 col-6">
                  <NavLink to={`/dashboard/wishlist`} className="d-block">
                    <div className="card">
                      <div className="card-body">
                        <div className="card_icon">
                          <i className="icon-heart" />
                        </div>
                        <div className="card_text">Wishlist</div>
                      </div>
                    </div>
                  </NavLink>
                </div>
                <div className="col-lg-3 col-md-4 col-6">
                  <NavLink to={`/dashboard/address`} className="d-block">
                    <div className="card">
                      <div className="card-body">
                        <div className="card_icon">
                          <i className="icon-location" />
                        </div>
                        <div className="card_text">Address</div>
                      </div>
                    </div>
                  </NavLink>
                </div>
                <div className="col-lg-3 col-md-4 col-6">
                  <NavLink to={`/dashboard/profile`} className="d-block">
                    <div className="card">
                      <div className="card-body">
                        <div className="card_icon">
                          <i className="icon-user-male" />
                        </div>
                        <div className="card_text">Profile</div>
                      </div>
                    </div>
                  </NavLink>
                </div>
                <div className="col-lg-3 col-md-4 col-6">
                  <div className="card">
                    <div className="card-body">
                      <a
                        href="#"
                        onClick={(e) => authLogoutProcess(e)}
                        className="d-block"
                      >
                        <div className="card_icon">
                          <i className=" icon-right" />
                        </div>
                        <div className="card_text">Logout</div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
