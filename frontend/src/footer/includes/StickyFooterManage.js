import React from "react";
import CopyRight from "./CopyRight";
import StickyFooter from "./StickyFooter";
import MobileMenu from "./MobileMenu";
import useResponsive from "../../utils/responsive";


const StickyFooterManage = (props) => {
  const { settings } = props;

  const { isMobile } = useResponsive();

  if (isMobile) {
    return (
      <>
        <CopyRight isMobile={isMobile} settings={settings} />
        <MobileMenu />
        <div className="container">
          <StickyFooter settings={settings} />
        </div>
      </>
    );
  }

  return <CopyRight settings={settings} />;
};

export default StickyFooterManage;
