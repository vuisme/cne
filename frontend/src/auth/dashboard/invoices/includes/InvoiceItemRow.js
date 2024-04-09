import React from "react";
import {Link} from "react-router-dom";
import moment from 'moment';


function InvoiceItemRow({invoice, currency}) {

	const {invoice_no,total_payable, total_courier, payment_method, total_due, status,  created_at} = invoice;

	return (
		<tr>
			<td className="text-left">
				{created_at ? moment(created_at).format('DD/MM/YYYY') : 'Unknown'}
			</td>
			<td>{invoice_no}</td>
			<td>{`${currency} `+ total_due}</td>
			<td>{`${currency} `+total_courier}</td>
			<td>{`${currency} `+total_payable}</td>
			<td className="text-left text-nowrap">{payment_method}</td>
			<td className="text-left text-nowrap">{status}</td>
			<td>
				{
					invoice.status === 'Pending' ?
						// <Link to={`/dashboard/invoice/${invoice.invoice_no}`} className="btn btn-block btn-default">Pay Now</Link>
						<Link to={`/dashboard/invoice/${invoice.invoice_no}`} className="btn btn-block btn-default">View</Link>
						:
						<Link to={`/dashboard/invoice/${invoice.invoice_no}`} className="btn btn-block btn-success">View</Link>
				}
			</td>
		</tr>
	);
}

export default InvoiceItemRow;
