import React, {useState} from 'react';
import {Link, NavLink} from "react-router-dom";
import {loadAsset} from "../../../../utils/Helpers";


export const MobileSubChildrenItem = ({child, categories}) => {
	const children = categories?.filter(filter => filter.ParentId === child?.otc_id) || [];
	if (children?.length > 0) {
		return <ul>
			{children.map(subChild =>
				<li key={subChild.id}>
					<NavLink to={`/shop/${subChild.slug}`}>
						<span className="btn_menu_close">{subChild.name}</span>
					</NavLink>
				</li>
			)}
		</ul>
	}
	return '';
};


const MobileChildren = (props) => {
	const {category, categories} = props;

	const allChildren1 = categories?.filter(filter => filter.ParentId === category.otc_id) || [];

	return (
		<li>
			<div className="menuBlock">
				<NavLink className="btn_menu_close" to={category.children_count ? `/${category.slug}` : `/shop/${category.slug}`}>
					{
						category.icon ?
							<img src={loadAsset(category.icon)}
							     style={{width: "22px", display: "inline", marginRight: "12px"}}
							     alt={category.name}/>
							:
							<i className="icon-laptop" style={{marginRight: "1rem"}}/>
					}
					<span>{category.name}</span>
				</NavLink>
				<span className="mmenu-btn" />
			</div>
			<ul>
				{
					allChildren1?.map((child1, index) =>
						<li key={index}>
							{child1.children_count ?
								<>
									<div className="menuBlock">
										<NavLink to={`/shop/${child1.slug}`}>
											<span className="btn_menu_close"> {child1.name} </span>
										</NavLink>
										<span className="mmenu-btn"/>
									</div>
									<MobileSubChildrenItem child={child1} categories={categories}/>
								</>
								:
								<NavLink to={`/${category.slug}/${child1.slug}`}>
									<span className="btn_menu_close">{child1.name}</span>
								</NavLink>}
						</li>
					)
				}
			</ul>
		</li>
	);
};

export default MobileChildren;