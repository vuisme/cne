import React, {useEffect} from 'react';
import Breadcrumb from "../../../pages/breadcrumb/Breadcrumb";
import {useCustomerOrders} from "../../../api/ApiDashboard";
import {goPageTop} from "../../../utils/Helpers";
import {useQuery} from "../../../utils/customHooks";
import PageSkeleton from "../../../skeleton/PageSkeleton";
import OrderItemRow from "./includes/OrderItemRow";
import {useSettings} from "../../../api/GeneralApi";
import {analyticsPageView} from "../../../utils/AnalyticsHelpers";

const AllOrders = () => {
	const {page} = useQuery();
	let limit = 10;

	const {data: orders, isLoading} = useCustomerOrders(page, limit);
	const {data: settings} = useSettings();
	const currency = settings?.currency_icon || '৳';

	useEffect(() => {
		goPageTop();
		analyticsPageView();
	}, []);


	if (isLoading) {
		return <PageSkeleton/>;
	}


	return (
		<main className="main bg-gray">
			<div className="page-content">
				<Breadcrumb
					current={'Orders'}
					collections={[
						{name: 'Dashboard', url: 'dashboard'}
					]}/>
				<div className="container">
					<div className="row">
						<aside className="col-md-12">
							<div className="card my-3">
								<div className="card-body">
									<h2>My Orders</h2>
									<div className="table-responsive-md">
										<table className="table text-center table-striped">
											<thead>
											<tr>
												<th className="text-left">Date</th>
												<th>OrderNo.</th>
												<th className="text-center">Tracking number</th>
												<th className="text-center">Products Value</th>
												<th className="text-center">Initial Payment</th>
												<th>Due</th>
												<th className="text-left">Status</th>
												<th>Actions</th>
											</tr>
											</thead>
											<tbody>
											{
												orders?.length > 0 ?
													orders?.map((order, index) =>
														<OrderItemRow key={index} order={order} currency={currency}/>)
													:
													<tr>
														<td colSpan={9}>You have no orders</td>
													</tr>
											}
											</tbody>
										</table>
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

export default AllOrders;