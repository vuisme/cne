import React from 'react';
import {connect} from "react-redux";
import {withRouter, Link} from "react-router-dom";
import MobileCategoryList from "./mobileMenuIncludes/MobileCategoryList";

const MobileMenu = props => {
   const {categories} = props;

   return (
      <div>
         <div className="mobile-menu-overlay"/>
         <div className="mobile-menu-container">
            <div className="mobile-menu-wrapper">
               <div className="mobile-menu-close">
                  <i className="icon-close"/>
               </div>

               <ul className="nav nav-pills-mobile" role="tablist">
                  <li className="nav-item">
                     <a
                        className="nav-link font-size-normal second-primary-color font-weight-normal text-uppercase active"
                        id="categories-link"
                        data-toggle="tab"
                        href="#categories-tab"
                        role="tab"
                        aria-controls="categories-tab"
                        aria-selected="true"
                     >
                        Categories
                     </a>
                  </li>
                  <li className="nav-item">
                     <a
                        className="nav-link font-size-normal second-primary-color font-weight-normal text-uppercase"
                        id="dashboard-link"
                        data-toggle="tab"
                        href="#dashboard-tab"
                        role="tab"
                        aria-controls="dashboard-tab"
                        aria-selected="false"
                     >
                        Dashboard
                     </a>
                  </li>
               </ul>
               <div className="tab-content">
                  <div
                     className="tab-pane fade show active"
                     id="categories-tab"
                     role="tabpanel"
                     aria-labelledby="categories-link"
                  >
                     <MobileCategoryList categories={categories} />

                  </div>
                  {/* .End .tab-pane */}
                  <div
                     className="tab-pane fade"
                     id="dashboard-tab"
                     role="tabpanel"
                     aria-labelledby="dashboard-link"
                  >
                     <nav className="mobile-cats-nav">
                        <ul className="mobile-cats-menu">
                           <li>
                              <Link to="/dashboard">Dashboard</Link>
                           </li>
                        </ul>
                        {/* End .mobile-cats-menu */}
                     </nav>
                     {/* End .mobile-cats-nav */}
                  </div>
                  {/* .End .tab-pane */}
               </div>
               {/* End .tab-content */}
            </div>
            {/* End .mobile-menu-wrapper */}
         </div>

      </div>
   );
};

const mapStateToProps = (state) => ({
   general: JSON.parse(state.INIT.general),
   categories: state.INIT.categories,
});

export default connect(mapStateToProps, {})(
   withRouter(MobileMenu)
);
