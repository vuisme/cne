import React from "react";
import SectionProductCard from "../../../../../product/card/SectionProductCard";

const RecentItems = props => {
	const {products, settings} = props;
	const currencyIcon = settings?.currency_icon || '৳';

	return (
		<div className="row row-cols-lg-5 row-cols-md-4 row-cols-sm-3 row-cols-2 ">
			{products?.map((product, index) =>
				<SectionProductCard key={index} className={'col'} product={product}/>
			)}
		</div>
	);
};

RecentItems.propTypes = {};

export default RecentItems;
