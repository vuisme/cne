import React, {useRef, useState} from "react";
import SectionProductCard from "../card/SectionProductCard";
import {useRelatedProducts} from "../../../api/ProductApi";

const RelatedProduct = (props) => {
	const {item_id, cardRef} = props;

	const {data: relatedProducts, isLoading} = useRelatedProducts(item_id);
	const height = cardRef?.current?.clientHeight || 0;

	return (
		<div className="product-sidebar card mb-3" style={height ? {height: `${height - 24}px`} : {display: `block`,maxHeight: `875px`}}>
			<div className="row">
				{relatedProducts?.map((product, index) => (
					<SectionProductCard key={index} product={product}/>
				))}
			</div>
		</div>
	);
};

export default RelatedProduct;
