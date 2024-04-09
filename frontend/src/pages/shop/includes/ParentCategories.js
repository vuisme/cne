import React from "react";
import {Link} from "react-router-dom";

const ParentCategories = (props) => {
	const {slug, category, categories} = props;

	const siblings = categories?.filter(filter => filter.ParentId === category.ParentId) || [];

	return (
		<div className="card my-5">
			<div className="card-body">
				<div className="widget widget-categories">
					<h3 className="widget-title">Related Categories</h3>
					<hr className="mb-1 mt-0"/>
					<div className="widget-body">
						<ul className="custom_widget_list">
							{siblings.length > 0 &&
							siblings.map((sibling, key) => (
								<li key={key}>
									<Link to={`/shop/${sibling.slug}`} className={slug === sibling.slug && 'active'}>{sibling.name}</Link>
								</li>
							))}
						</ul>
					</div>
					{/* End .widget-body */}
				</div>
			</div>
		</div>
	);
};


export default ParentCategories;
