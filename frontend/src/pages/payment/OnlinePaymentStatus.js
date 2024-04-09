import React from 'react';
import {useParams} from "react-router-dom";
import {useQuery} from "../../utils/customHooks";
import SuccessMessage from "./includes/SuccessMessage";
import FailedMessage from "./includes/FailedMessage";
import CancelMessage from "./includes/CancelMessage";
import My404Component from "../404/My404Component";

const OnlinePaymentStatus = () => {
	let {status} = useParams();
	const {tran_id, n_msg, paymentID, trxID} = useQuery();

	const allStatus = ['success', 'failed', 'cancel'];

	if (!allStatus.includes(status)) {
		return <My404Component/>;
	}

	return (
		<div className="container">
			<div className="row justify-content-center">
				<div className="col-lg-5 col-md-7 col-sm-10 col-12">
					<div className="card my-4 my-md-5">
						<div className="card-body px-5">
							{status === 'success' && <SuccessMessage
								tran_id={tran_id}
								trxID={trxID}
								n_msg={n_msg}
								paymentID={paymentID}/>}
							{status === 'failed' && <FailedMessage tran_id={tran_id} n_msg={n_msg}/>}
							{status === 'cancel' && <CancelMessage tran_id={tran_id} n_msg={n_msg}/>}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default OnlinePaymentStatus;