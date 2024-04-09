import React from 'react';
import {getProductGroupedAttributes} from "../../../../utils/CartHelpers";

const AdditionalInformation = (props) => {
	const {product} = props;
	const Attributes = product?.Attributes ? product.Attributes : [];
	const groupItems = getProductGroupedAttributes(Attributes);


	return (
		<div className="border p-3 product-desc-content rounded">
			{
				groupItems.map((group, index) =>
					<div className="row" key={index}>
						<div className="col-md-3 col-6"><b>{group.key}</b></div>
						<div className="col-md-9 col-6">
							{
								group.values.map((Attribute, index2) =>
									<span className="mr-2" key={index2}>{Attribute?.Value || 'Unknown'},</span>
								)
							}
						</div>
						<div className="col-md-12">
							<hr className="my-2"/>
						</div>
					</div>
				)
			}
		</div>
	);
};

export default AdditionalInformation;