import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { toggleMobileMenu } from "../../utils/jQueryImplement";
import { analyticsEventTracker } from "../../utils/AnalyticsHelpers";

const StickyFooter = (props) => {
  const { settings } = props;
  const office_phone = settings?.office_phone || "01515234363";

  const gaEventTracker = (eventName) => {
    analyticsEventTracker("ChinaExpress-Footer", eventName);
  };

  useEffect(() => {
    toggleMobileMenu();
  }, []);

  return (
    <nav className="stick_footer_nav">
      <div className="container">
        <div className="row">
          <div className="col text-center">
            <a href={`/category`} className="nav-link toggleMobileMenu">
              <span className="sticky_nav_icon">
                <i className="icon-menu" />
              </span>
            </a>
          </div>
          <div className="col text-center">
            <a
              className="nav-link"
              href={`tel:${office_phone}`}
              onClick={() => gaEventTracker("click-call")}
            >
              <span className="sticky_nav_icon">
                <i className="icon-headset" />
              </span>
            </a>
          </div>
          <div className="col text-center">
            <Link className="nav-link" to="/">
              <span className="sticky_nav_icon">
                <i className="icon-home-1" />
              </span>
            </Link>
          </div>
          <div className="col text-center">
            <a
              className="nav-link"
              href="https://m.me/ChinaExpress.01933778855"
              rel="noreferrer"
              target="_blank"
            >
              <span className="sticky_nav_icon">
                <i className="icon-messenger" />
              </span>
            </a>
          </div>
          <div className="col text-center">
            <Link className="nav-link" to="/dashboard">
              <span className="sticky_nav_icon">
                <i className="icon-th-thumb-empty" />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default StickyFooter;
