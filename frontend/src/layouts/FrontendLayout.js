import React from "react";
import ProfileUpdateDialogues from "../auth/ProfileUpdateDialogues";
import HeaderManage from "../header/HeaderManage";
import Footer from "../footer/Footer";
import { useSettings } from "../api/GeneralApi";

import "./../scss/app.scss";

const FrontendLayout = ({ children }) => {
  const { data: settings } = useSettings();

  return (
    <div>
      <ProfileUpdateDialogues />
      <HeaderManage settings={settings} />
      <div className="page-wrapper">{children}</div>
      <Footer />
    </div>
  );
};

export default FrontendLayout;
