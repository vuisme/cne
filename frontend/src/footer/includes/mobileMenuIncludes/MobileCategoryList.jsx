import React, {useEffect, useState} from 'react';
import {NavLink} from "react-router-dom";
import {loadAsset} from "../../../utils/Helpers";
import {useQuery} from "react-query";
import {allCategories, useAllCategories} from "../../../api/GeneralApi";
import MobileChildren from "./includes/MobileChildren";
import BrowseCategorySkeleton from "../../../skeleton/sectionSkeleton/BrowseCategorySkeleton";


export const ParentListItem = (props) => {
	const {category, categories} = props;

	if (category?.children_count) {
		return <MobileChildren categories={categories} category={category}/>
	}

	return (
		<li>
			<NavLink className="mobile-cats-lead" to={`/shop/${category.slug}`}>
				{category.name}
			</NavLink>
		</li>
	)
};


const MobileCategoryList = (props) => {

	const {data: categories, isLoading} = useAllCategories();

	if (isLoading) {
		return <BrowseCategorySkeleton/>
	}

	const mainCats = categories.filter(filter => filter?.ParentId === null);

	return (
		<nav className="mobile-nav">
			<ul className="mobile-menu">
				{
					mainCats?.map((category) => <ParentListItem key={category.id} categories={categories} category={category}/>)
				}
			</ul>
		</nav>
	);
};

export default MobileCategoryList;
