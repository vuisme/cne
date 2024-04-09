import React, {useEffect} from 'react';
import MobileCategoryList from "./mobileMenuIncludes/MobileCategoryList";
import {closeMobileMenu} from "../../utils/jQueryImplement";

const MobileMenu = props => {

	useEffect(() => {
		closeMobileMenu();
	}, []);

	return (
		<div className="mobileMenuSidebar">
			<div className="mobile-menu-overlay"/>
			<div className="mobile-menu-container">
				<div className="mobile-menu-wrapper">
					<div className="mobile-menu-close">
						<i className="icon-cancel-1"/>
					</div>
					<div className="tab-content">
						<MobileCategoryList/>
					</div>
				</div>
			</div>
		</div>
	);
};


export default MobileMenu;
