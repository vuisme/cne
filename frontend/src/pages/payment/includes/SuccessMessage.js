import React, {useEffect} from 'react';
import {Link} from "react-router-dom";
import {usePaymentStatusUpdate} from "../../../api/ApiDashboard";

const SuccessMessage = ({tran_id, n_msg, paymentID, trxID}) => {

	const {mutateAsync, isLoading} = usePaymentStatusUpdate();

	useEffect(() => {
		if (tran_id && paymentID !=='undefined') {
			mutateAsync({tran_id, paymentID, trxID});
		}
	}, [tran_id]);


	return (
		<div className="text-center order_complete">
			<img
				src="/assets/img/happy.png"
				className="mb-3 mx-auto"
				style={{width: "6rem"}}
				alt="success"/>
			<div className="heading_s1">
				<h3>Payment successful</h3>
			</div>
			<p className="mb-4">
				Thank you for your order! Your order is being processed and will be
				completed soon. You will receive an email confirmation when your
				order is on the way.
			</p>
			<div className="row">
				<div className="col">
					<Link to="/" className="btn btn-default btn-block">
						Shop More
					</Link>
				</div>
				<div className="col">
					<Link to="/dashboard/orders" className="btn btn-default btn-block">
						Go Orders
					</Link>
				</div>
			</div>
		</div>
	);
};

export default SuccessMessage;