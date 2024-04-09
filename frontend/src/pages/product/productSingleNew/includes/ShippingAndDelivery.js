import React from 'react';
import parser from "html-react-parser";
import {usePageData} from "../../../../api/GeneralApi";

const ShippingAndDelivery = () => {

	const {data: page, isLoading} = usePageData('shipping-and-delivery');

	if (isLoading) {
		return 'Loading...';
	}

	return (
		<div className="product-desc-content">
			{
				page?.id &&
				<div className="post-content">
					{parser(page?.post_content)}
				</div>
			}
		</div>
	);
};

export default ShippingAndDelivery;