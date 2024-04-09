import React from "react";
import {Link} from "react-router-dom";
import moment from 'moment';


function OrderItemRow({order, currency}) {

	const {item_number, tracking_number, DeliveryCost, product_value, first_payment, due_payment,status, created_at} = order;

	return (
		<tr>
			<td className="text-left">
				{created_at ? moment(created_at).format('DD/MM/YYYY') : 'Unknown'}
			</td>
			<td>{item_number}</td>
			<td>{tracking_number ? tracking_number : 'N/A'}</td>
			<td>{`${currency} `+(Number(product_value) + Number(DeliveryCost))}</td>
			<td>{`${currency} `+first_payment}</td>
			<td>{`${currency} `+due_payment}</td>
			<td className="text-left text-nowrap">{status}</td>
			<td>
				{
					order.status === 'waiting-for-payment' ?
						<Link to={`/dashboard/orders/${order.order.transaction_id}`} className="btn btn-block btn-default">PayNow</Link>
						:
						<Link to={`/dashboard/wallet/${order.id}`} className="btn btn-block btn-success">View</Link>
				}
			</td>
		</tr>
	);
}

export default OrderItemRow;
