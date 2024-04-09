import React, {useEffect} from 'react';
import {sumCartItemTotal, sumCartItemTotalQuantity} from "../../../../../utils/AliHelpers";

const AliProductSummary = (props) => {
	const {cartItem, settings} = props;

	const currency = settings?.currency_icon || '৳';
	const DeliveryCost = cartItem?.DeliveryCost || 0;

	const itemTotal = sumCartItemTotal(cartItem?.variations || []);
	const quantity = sumCartItemTotalQuantity(cartItem?.variations || []);
	const totalActivePrice = parseInt(itemTotal) + parseInt(DeliveryCost);

	if (cartItem?.shipping_type === 'express') {
		return (
			<div>
				<table className="table table-bordered">
					<tbody>
					<tr>
						<td className="w-50">Total Quantity</td>
						<td>{`${quantity}`}</td>
					</tr>
					<tr>
						<td className="text-nowrap">Products Price</td>
						<td>{`${currency} ${itemTotal}`}</td>
					</tr>
					<tr>
						<td>Weight</td>
						<td>{(Number(cartItem.weight) * Number(quantity)).toFixed(3)}kg</td>
					</tr>
					<tr>
						<td className="text-nowrap">China Delivery charge</td>
						<td>{`${currency} ${DeliveryCost}`}</td>
					</tr>
					<tr>
						<td className="text-nowrap">Express Shipping rate</td>
						<td>{`${currency} ${cartItem?.shipping_rate ? cartItem.shipping_rate : 0} per kg`}</td>
					</tr>
					<tr>
						<td className="text-nowrap">Total Product Price:</td>
						<td>{`${currency} ${totalActivePrice}`}</td>
					</tr>
					</tbody>
				</table>
			</div>
		);
	}


	return (
		<div>
			<table className="table table-bordered">
				<tbody>
				<tr>
					<td className="w-50">Total Quantity</td>
					<td>{`${quantity}`}</td>
				</tr>
				<tr>
					<td className="text-nowrap">Products Price</td>
					<td>{`${currency} ${itemTotal}`}</td>
				</tr>
				<tr>
					<td className="text-nowrap">Shipping charge</td>
					<td>{`${currency} ${DeliveryCost}`}</td>
				</tr>
				<tr>
					<td className="text-nowrap">Total Product Price:</td>
					<td>{`${currency} ${totalActivePrice}`}</td>
				</tr>
				</tbody>
			</table>
		</div>
	);
};

export default AliProductSummary;