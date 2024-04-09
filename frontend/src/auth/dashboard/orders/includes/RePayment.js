import React, {useState} from 'react';
import {Link} from "react-router-dom";
import Swal from "sweetalert2";
import {useRepaymentOrderByBkash} from "../../../../api/ApiDashboard";
import SpinnerButtonLoader from "../../../../loader/SpinnerButtonLoader";
import {analyticsEventTracker} from "../../../../utils/AnalyticsHelpers";

const RePayment = ({order}) => {

	const [payMethod, setPayMethod] = useState('bkash');
	const [accept, setAccept] = useState(false);

	const gaEventTracker = (eventName) => {
		analyticsEventTracker('Order-Details', eventName);
	};

	const {mutateAsync, isLoading} = useRepaymentOrderByBkash();

	const confirmPaymentProcess = () => {
		if (!accept) {
			Swal.fire({
				text: "Please accept terms and conditions!",
				icon: "warning",
				buttons: "Ok, Understood",
			});
		} else {
			gaEventTracker('Repayment-process');
			mutateAsync({tran_id: order?.transaction_id}, {
				onSuccess: (data) => {
					if (data.status === true) {
						window.location.href = data.redirect;
					} else {
						Swal.fire({
							text: data.msg,
							icon: "error",
							buttons: "Ok, Understood",
						});
					}
				}
			});
		}
	};


	return (
		<div>
			<div className="my-3 my-lg-5 justify-content-center row ">
				<div className="col-md-6">
					<div className="card payment_card text-center">
						<div className="form-check form-check-inline mx-auto">
							<input
								className="form-check-input mr-2"
								type="radio"
								name="payment_method"
								onChange={() => setPayMethod('bkash')}
								id="bkash"
								value="bkash"
								checked={payMethod === 'bkash'}
							/>
							<label
								className="form-check-label"
								htmlFor="bkash"
							>
								<img
									src={`/assets/img/payment/bkash.png`}
									alt="bkash"
								/>
							</label>
						</div>
					</div>
				</div>
			</div>
			<div>
				<p>
					Please Note <br/>
					1. You have an activated bKash account <br/>
					2. Ensure you have sufficient balance in your bKash
					account to cover the total cost of the order <br/>
					3. Ensure you are able to receive your OTP
					(one-time-password) on your mobile and have bKash PIN
				</p>

				<div className="form-check">
					<input
						className="form-check-input"
						type="checkbox"
						id="accept"
						checked={accept}
						onChange={() => setAccept(!accept)}
					/>
					<label className="form-check-label" htmlFor="accept">
						<p className="m-0">
							I have read and agree, the website
							<Link
								className="ml-2"
								to="/pages/terms-and-conditions"
							>
								Terms & Conditions
							</Link>
							,
							<Link
								className="mx-2"
								to="/pages/prohibited-items"
							>
								Prohibited Items
							</Link>
							and
							<Link
								className="ml-2"
								to="/pages/return-and-refund-policy"
							>
								Refund & Refund Policy
							</Link>
						</p>
					</label>
				</div>
			</div>
			{
				isLoading ?
					<SpinnerButtonLoader buttonClass="btn btn-block btn-default py-2 mt-3"/>
					:
					<button
						type="button"
						onClick={() => confirmPaymentProcess()}
						className="btn btn-block btn-default py-2 mt-3"
					>
						Pay Now
					</button>
			}
		</div>
	);
};

export default RePayment;