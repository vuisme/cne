import React from 'react';
import ProductDetailsSkeleton from "../../../../skeleton/productSkeleton/ProductDetailsSkeleton";
import {isEmpty} from "lodash";
import SectionProductCard from "../../../product/card/SectionProductCard";
import {useAliRelatedProduct} from "../../../../api/AliExpressProductApi";

const AliRelatedProduct = props => {
	const {productId, cardRef} = props;

	const {data: products, isLoading} = useAliRelatedProduct(productId);

	if (!products?.length) {
		return 'Product will be loaded soon';
	}

	const height = cardRef?.current?.clientHeight || 0;

	return (
		<div className="product-sidebar card mb-3" style={height ? {height: `${height - 24}px`} : {display: `block`,maxHeight: `875px`}}>

			<div className="row">
				{products.map((product, index) => (
					<SectionProductCard key={index} product={product}/>
				))}
			</div>

		</div>
	);
};


export default AliRelatedProduct;
