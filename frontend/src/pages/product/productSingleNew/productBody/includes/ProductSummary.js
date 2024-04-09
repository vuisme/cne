import React from 'react'
import {calculateAirShippingCharge, getProductWeight} from "../../../../../utils/CartHelpers";
import {sumCartItemTotal, sumCartItemTotalQuantity} from "../../../../../utils/AliHelpers";

const ProductSummary = props => {
	const {cart, product, settings} = props;
	const productId = product?.Id;

	const currency = settings?.currency_icon || '$';
	const china_to_bd_bottom_message = settings?.china_to_bd_bottom_message;
	const weightMessage = settings?.approx_weight_message;
	const airShippingCharges = settings?.air_shipping_charges || null;
	const configItem = cart?.cart_items?.find(find => parseInt(find.ItemId) === parseInt(productId));

	const itemVariations = configItem?.variations || [];
	const totalPrice = sumCartItemTotal(itemVariations);
	const totalQty = sumCartItemTotalQuantity(itemVariations);

	let ApproxWeight = getProductWeight(product);
	const weight = () => {
		let calculateWeight = configItem?.weight ? configItem?.weight : ApproxWeight;
		calculateWeight = calculateWeight ? (Number(calculateWeight) * Number(totalQty)) : '0.00';
		return Number(calculateWeight).toFixed(3)
	};

	let DeliveryCost = configItem?.DeliveryCost || 0;
	let totalProductPrice = Number(totalPrice) + Number(DeliveryCost);
	let shippingRate = calculateAirShippingCharge(totalProductPrice, airShippingCharges);

	return (
		<div className="details-filter-row mb-3">
			<table className="table table-bordered table-striped">
				<thead>
				<tr>
					<th colSpan={2} className="text-center">From China To Bangladesh</th>
				</tr>
				</thead>
				<tbody>
				<tr>
					<td colSpan={2}>Total Quantity: <span className="seller_info">{totalQty}</span></td>
				</tr>
				<tr>
					<td colSpan={2}>
						Approx. Weight : <span className="seller_info">{weight()}Kg</span>
						{weightMessage && <span title={weightMessage}><i className="icon-info-circled"/></span>}
					</td>
				</tr>
				<tr>
					<td colSpan={2}>Shipping Charge: <span className="seller_info">{currency + ' ' + shippingRate} Per Kg</span></td>
				</tr>
				<tr>
					<td colSpan={2}>Estimate Delivery: <span className="seller_info">By Air 15-25 Days</span></td>
				</tr>
				<tr>
					<td colSpan={2}>Product Price: <span className="seller_info">{currency + ' ' +totalPrice}</span></td>
				</tr>
				{
					parseInt(DeliveryCost) > 0 &&
					<tr>
						<td colSpan={2}>China Local Shipping cost : <span className="seller_info">{currency + ' ' + DeliveryCost}</span></td>
					</tr>
				}
				<tr>
					<td colSpan={2}>Total Products Price: <span className="seller_info">{currency + ' ' + totalProductPrice}</span></td>
				</tr>
				{
					china_to_bd_bottom_message &&
					<tr>
						<td colSpan={2}>
							<p className="text-danger text-center">{china_to_bd_bottom_message}</p>
						</td>
					</tr>
				}
				</tbody>
			</table>
		</div>
	)
};


export default ProductSummary;