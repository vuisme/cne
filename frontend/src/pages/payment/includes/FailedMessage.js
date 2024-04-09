import React from 'react';
import {Link} from "react-router-dom";

const FailedMessage = ({tran_id, n_msg}) => {
	return (
		<div className="text-center order_complete">
			<img
				src="/assets/img/sad.png"
				className="mb-3 mx-auto"
				style={{width: "6rem"}}
				alt="success"/>
			<div className="heading_s1">
				<h3 className="text-danger">Payment Failed!</h3>
				<h4 className="text-danger">{n_msg}</h4>
			</div>
			<p>
				Your order is not completed yet ! If you want to complete this order you can try repayment within 5 hours, Other wise your order will not processed.
			</p>
			<div className="row">
				<div className="col">
					<Link to="/" className="btn btn-default btn-block">
						Shop More
					</Link>
				</div>
				<div className="col">
					<Link to={`/dashboard/orders/${tran_id}`} className="btn btn-default btn-block">
						Try Again
					</Link>
				</div>
			</div>
		</div>
	);
};

export default FailedMessage;