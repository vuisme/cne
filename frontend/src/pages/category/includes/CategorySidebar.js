import React from 'react';
import {NavLink} from "react-router-dom";
import _ from "lodash";

const CategorySidebar = props => {
	const {siblings} = props;

	return (
		<div className="sidebar sidebar-shop">
			<div className="widget widget-categories">
				<h3 className="widget-title">Categories</h3>
				<hr className="mb-1 mt-0"/>
				<div className="widget-body">
					<ul className="custom_widget_list">
						{siblings?.length > 0 &&
						siblings.map((sibling, key) =>
							<li key={key}>
								<NavLink to={sibling.children_count ? `/${sibling.slug}` : `/shop/${sibling.slug}`}>{sibling.name}</NavLink>
							</li>
						)
						}
					</ul>
				</div>
				{/* End .widget-body */}
			</div>
		</div>
	);
};


export default CategorySidebar;
