import React, {useEffect} from "react";
import {goPageTop} from "../../../utils/Helpers";
import {useParams} from "react-router-dom";
import PageSkeleton from "../../../skeleton/PageSkeleton";
import {useCustomerWalletDetails} from "../../../api/ApiDashboard";
import Default404 from "../../../pages/404/Default404";
import {useSettings} from "../../../api/GeneralApi";
import Breadcrumb from "../../../pages/breadcrumb/Breadcrumb";
import Helmet from "react-helmet";
import {analyticsPageView} from "../../../utils/AnalyticsHelpers";
import WalletBody from "./includes/WalletBody";

const WalletDetails = () => {
	const {id} = useParams();
	const {data: settings} = useSettings();
	const {data: wallet, isLoading} = useCustomerWalletDetails(id);

	useEffect(() => {
		goPageTop();
		analyticsPageView();
	}, [id]);

	if (isLoading) {
		return <PageSkeleton/>;
	}


	if (!wallet?.id) {
		return <Default404/>;
	}

	const currency = settings?.currency_icon || '৳';
	const ShippingCharges = settings?.air_shipping_charges || '';
	const item_variations = wallet?.item_variations || [];

	return (
		<main className="main bg-gray">
			<Helmet>
				<title>Order Details</title>
			</Helmet>

			<div className="page-content">
				<Breadcrumb
					current={'Order details'}
					collections={[
						{name: 'Dashboard', url: 'dashboard'},
						{name: 'Orders', url: 'dashboard/orders'},
					]}
				/>
				<div className="container">
					<div className="row justify-content-center">
						<aside className="col-md-12 col-lg-8">
							<div className="card my-3">
								<div className="card-body">
									<h2>Order details #{wallet.item_number}</h2>
									<hr className="my-2"/>

									<div className="row">
										<div className="col">
											<strong>Details</strong>
										</div>
										<div className="col text-right"><strong>Total</strong></div>
									</div>

									<hr className="my-2"/>
									{
										item_variations?.length > 0 &&
										item_variations.map((variation, index) =>
											<WalletBody wallet={wallet} variation={variation} currency={currency} key={index}/>
										)
									}

									<div className="summary_row">
										<div className="row">
											<div className="col-12 text-right">
												<p className="my-2">
													<span
														className="mr-2">Product Value: </span><strong> {`${currency} ${wallet.product_value}`} </strong>
												</p>
											</div>
										</div>
										{
											wallet.DeliveryCost > 0 &&
											<div className="row">
												<div className="col-12 text-right">
													<p className="my-2">
														<span
															className="mr-2">China Delivery Cost: </span><strong> {`${currency} ${wallet.DeliveryCost}`} </strong>
													</p>
												</div>
											</div>
										}
										<div className="row">
											<div className="col-12 text-right">
												<p className="my-2">
													<span
														className="mr-2">Sub Total: </span><strong> {`${currency} ${(Number(wallet.product_value) + Number(wallet.DeliveryCost))}`} </strong>
												</p>
											</div>
										</div>
										<div className="row">
											<div className="col-12 text-right">
												<p className="my-2">
													<span
														className="mr-2">Initial Payment: </span><strong> {`${currency} ${wallet.first_payment}`} </strong>
												</p>
											</div>
										</div>
										{
											wallet?.coupon_contribution > 0 &&
											<div className="row">
												<div className="col-12 text-right">
													<p className="my-2">
														<span
															className="mr-2">Coupon: </span><strong> {`${currency} ${wallet.coupon_contribution}`} </strong>
													</p>
												</div>
											</div>
										}
										{
											wallet?.bd_shipping_charge > 0 &&
											<div className="row">
												<div className="col-12 text-right">
													<p className="my-2">
														<span
															className="mr-2">BD Shipping Charge: </span><strong> {`${currency} ${wallet.bd_shipping_charge}`} </strong>
													</p>
												</div>
											</div>
										}
										{
											wallet?.courier_bill > 0 &&
											<div className="row">
												<div className="col-12 text-right">
													<p className="my-2">
														<span
															className="mr-2">Courier Bill: </span><strong> {`${currency} ${wallet.courier_bill}`} </strong>
													</p>
												</div>
											</div>
										}
										{
											wallet?.out_of_stock > 0 &&
											<div className="row">
												<div className="col-12 text-right">
													<p className="my-2">
														<span
															className="mr-2">Out of Stock: </span><strong> {`${currency} ${wallet.out_of_stock}`} </strong>
													</p>
												</div>
											</div>
										}
										{
											wallet?.lost_in_transit > 0 &&
											<div className="row">
												<div className="col-12 text-right">
													<p className="my-2">
														<span
															className="mr-2">Lost In Transit: </span><strong> {`${currency} ${wallet.lost_in_transit}`} </strong>
													</p>
												</div>
											</div>
										}
										{
											wallet?.customer_tax > 0 &&
											<div className="row">
												<div className="col-12 text-right">
													<p className="my-2">
														<span
															className="mr-2">Customer Tax: </span><strong> {`${currency} ${wallet.customer_tax}`} </strong>
													</p>
												</div>
											</div>
										}
										{
											wallet?.missing > 0 &&
											<div className="row">
												<div className="col-12 text-right">
													<p className="my-2">
														<span
															className="mr-2">Missing: </span><strong> {`${currency} ${wallet.missing}`} </strong>
													</p>
												</div>
											</div>
										}
										{
											wallet?.adjustment > 0 &&
											<div className="row">
												<div className="col-12 text-right">
													<p className="my-2">
														<span
															className="mr-2">Adjustment: </span><strong> {`${currency} ${wallet.adjustment}`} </strong>
													</p>
												</div>
											</div>
										}
										{
											wallet?.refunded > 0 &&
											<div className="row">
												<div className="col-12 text-right">
													<p className="my-2">
														<span
															className="mr-2">Refunded: </span><strong> {`${currency} ${wallet.refunded}`} </strong>
													</p>
												</div>
											</div>
										}
										{
											wallet?.last_payment > 0 &&
											<div className="row">
												<div className="col-12 text-right">
													<p className="my-2">
														<span
															className="mr-2">Last Payment: </span><strong> {`${currency} ${wallet.last_payment}`} </strong>
													</p>
												</div>
											</div>
										}
											<div className="row">
												<div className="col-12 text-right">
													<p className="my-2">
														<span
															className="mr-2">Due After Calculate: </span><strong> {`${currency} ${wallet.due_payment || 0}`} </strong>
													</p>
												</div>
											</div>
									</div>


								</div>
							</div>
						</aside>
					</div>
				</div>
			</div>
		</main>
	);
};


export default WalletDetails;
