import React from 'react';
import {Link} from "react-router-dom";


export const SubChildrenItem = ({categories, child}) => {
	const children = categories?.filter(filter => filter.ParentId === child?.otc_id) || [];
	if (children?.length > 0) {
		return <ul>
			{children.map(subChild =>
				<li key={subChild.id}>
					<Link to={`/shop/${subChild.slug}`}>
						{subChild.name}
					</Link>
				</li>
			)}
		</ul>
	}
	return '';
};

const MegaBlock = ({parent, allChildren1, categories}) => {
	const otc_id = parent?.otc_id;
	return (
		<div className="megamenu">
			<div className="row ">
				<div className="col-md-12">
					<div className="menu-col">
						<div className="row">
							{allChildren1?.map((child, index) => (
								<div className="col-md-4" key={index}>
									<Link
										to={child.children_count ? `/${parent.slug}/${child.slug}` : `/shop/${child.slug}`}
										className="menu-title"
									>
										{child.name}
									</Link>
									<SubChildrenItem child={child} categories={categories}/>
								</div>
							))}
						</div>
					</div>
				</div>
				{/* End .col-md-12 */}
			</div>
		</div>
	);
};

export default MegaBlock;