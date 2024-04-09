import React from 'react';
import {cartItemCheckedVariousTotal} from "../../../utils/AliHelpers";
import {singleProductTotal} from "../../../utils/CartHelpers";

const CheckoutItemSimpleSummary = (props) => {
	const {product, currency} = props;
	return (
		<div>
			<div className="row">
				<div className="col-12">
					<div className="text-right">
						Product Total: <strong>{currency + ' ' + (cartItemCheckedVariousTotal(product?.variations) || 0)}</strong>
					</div>
				</div>
			</div>
			<hr className="my-2"/>
			{
				product?.ProviderType === "aliexpress" && parseInt(product?.DeliveryCost) > 0 &&
				<div className="row">
					<div className="col-12">
						<div className="text-right">
							{
								product?.shipping_type === 'express' ?
									`China Local Delivery Charge: `
									:
									`China to BD Shipping Charge: `
							}
							<strong>{currency + ' ' + product?.DeliveryCost}</strong>
						</div>
					</div>
				</div>
			}
			{
				product?.ProviderType !== "aliexpress" && parseInt(product?.DeliveryCost) > 0 &&
				<div className="row">
					<div className="col-12">
						<div className="text-right">
							China Local Shipping cost: <strong>{currency + ' ' + product?.DeliveryCost}</strong>
						</div>
					</div>
				</div>
			}
			{parseInt(product?.DeliveryCost) > 0 && <hr className="my-2"/>}

			{singleProductTotal(product) > 0 &&
			<div className="row">
				<div className="col-12">
					<div className="text-right">Subtotal: <strong>{currency + ' ' + singleProductTotal(product)}</strong>
					</div>
				</div>
			</div>
			}
			{singleProductTotal(product) > 0 && <hr className="my-2"/>}
		</div>
	);
};

export default CheckoutItemSimpleSummary;