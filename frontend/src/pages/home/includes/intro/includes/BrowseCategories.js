import React from 'react';
import BrowseCategorySkeleton from "../../../../../skeleton/sectionSkeleton/BrowseCategorySkeleton";
import CategoryType from "./CategoryType";
import {useAllCategories} from "../../../../../api/GeneralApi";

const BrowseCategories = () => {

	const {data: categories, isLoading} = useAllCategories();

	if (isLoading) {
		return <BrowseCategorySkeleton/>
	}

	const mainCats = categories.filter(filter => filter?.ParentId === null);

	return (
		<nav className="side-nav">
			<div
				className="sidenav-title letter-spacing-normal font-size-normal d-flex justify-content-xl-between align-items-center justify-content-center text-truncate">
				Categories <i className=" icon-menu float-right h5 text-white m-0 d-none d-xl-block"/>
			</div>
			<ul
				className="menu-vertical sf-arrows sf-js-enabled"
				style={{touchAction: "pan-y"}}
			>
				{
					mainCats?.length > 0 &&
					mainCats.map((parent, index) =>
						<CategoryType
							key={index}
							indexCount={index}
							categories={categories}
							parent={parent}
						/>
					)
				}
			</ul>
		</nav>
	);
};


export default BrowseCategories;
