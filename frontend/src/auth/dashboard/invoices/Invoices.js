import React, {useEffect} from 'react';
import Breadcrumb from "../../../pages/breadcrumb/Breadcrumb";
import {useCustomerInvoices, useCustomerOrders} from "../../../api/ApiDashboard";
import {goPageTop} from "../../../utils/Helpers";
import {useQuery} from "../../../utils/customHooks";
import PageSkeleton from "../../../skeleton/PageSkeleton";
import {useSettings} from "../../../api/GeneralApi";
import {analyticsPageView} from "../../../utils/AnalyticsHelpers";
import Default404 from "../../../pages/404/Default404";
import {useHistory} from "react-router-dom";
import InvoiceItemRow from "./includes/InvoiceItemRow";

const Invoices = () => {
	const history = useHistory();
	const {page} = useQuery();

	const {data, isLoading} = useCustomerInvoices(page);
	const {data: settings} = useSettings();
	const currency = settings?.currency_icon || '৳';

	useEffect(() => {
		goPageTop();
		analyticsPageView();
	}, [page]);


	if (isLoading) {
		return <PageSkeleton/>;
	}

	const handlePaginationClick = (paginate) => {
		history.push(`/dashboard/my-invoice?page=${paginate.selected + 1}`);
	};

	const invoices = data?.invoices ? JSON.parse(data?.invoices) : [];
	const totalPage = data?.totalPage ? data?.totalPage : 0;

	return (
		<main className="main bg-gray">
			<div className="page-content">
				<Breadcrumb
					current={'Invoice'}
					collections={[
						{name: 'Dashboard', url: 'dashboard'}
					]}/>
				<div className="container">
					<div className="row">
						<aside className="col-md-12">
							<div className="card my-3">
								<div className="card-body">
									<h2>My Invoice</h2>
									<div className="table-responsive-md">
										<table className="table text-center table-striped">
											<thead>
											<tr>
												<th className="text-left">Date</th>
												<th>Invoice ID</th>
												<th className="text-center">Product Due</th>
												<th className="text-center">Courier Bill</th>
												<th className="text-center">Total Payable</th>
												<th className="text-center">Payment Method</th>
												<th className="text-left">Status</th>
												<th>Actions</th>
											</tr>
											</thead>
											<tbody>
											{
												invoices.length > 0 ?
													invoices.map((invoice, index) =>
														<InvoiceItemRow key={index} invoice={invoice} currency={currency}/>)
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

export default Invoices;