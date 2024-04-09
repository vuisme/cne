import React from 'react';
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import "../skeleton.css"

const SidebarCategorySkeleton = () => {
	return (
		<div className="sidebar sidebar-shop">
			<div className="widget widget-categories">
				<Skeleton height={20} wrapper={`h2`} width="80%" className="widget-title"/>
				<hr className="mb-1 mt-0"/>
				<div className="widget-body">
					<ul className="custom_widget_list">
						<Skeleton height={20} count={15} wrapper={`li`} width="80%" className="mb-1"/>
					</ul>
				</div>
			</div>
		</div>
	);
};


export default SidebarCategorySkeleton;
