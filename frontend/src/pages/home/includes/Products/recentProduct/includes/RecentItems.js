import React from "react";
import SectionProductCard from "../../../../../product/card/SectionProductCard";

const RecentItems = ({ products }) => {

	return (
		<div className="row row-cols-lg-5 row-cols-md-4 row-cols-sm-3 row-cols-2 ">
			{products?.map((product, index) =>
				<SectionProductCard key={index} className={'col'} product={product} />
			)}
		</div>
	);
};

RecentItems.propTypes = {};

export default RecentItems;
