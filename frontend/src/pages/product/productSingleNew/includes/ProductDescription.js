import React from 'react';
import parser from "html-react-parser";
import {useProductDetails} from "../../../../api/ProductApi";

const ProductDescription = (props) => {
	const {product} = props;
	const product_id = product.Id;

	const {data: description, isLoading} = useProductDetails(product_id);


	if (isLoading) {
		return (
			<div className="text-center py-5">
				<div className="d-block mb-2">
					<div className="spinner-border text-secondary" role="status">
						<span className="sr-only">Loading...</span>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className="product-desc-content">
			<div className="table-responsive-sm">
				{description && parser(description)}
			</div>
		</div>
	);
};

export default ProductDescription;