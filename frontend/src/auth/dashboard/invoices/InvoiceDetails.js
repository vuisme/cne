import React, {useEffect} from "react";
import {goPageTop} from "../../../utils/Helpers";
import {useParams} from "react-router-dom";
import PageSkeleton from "../../../skeleton/PageSkeleton";
import Default404 from "../../../pages/404/Default404";
import InvoiceItems from "./includes/InvoiceItems";
import {useSettings} from "../../../api/GeneralApi";
import Breadcrumb from "../../../pages/breadcrumb/Breadcrumb";
import Helmet from "react-helmet";
import {analyticsPageView} from "../../../utils/AnalyticsHelpers";
import {useCustomerInvoiceDetails} from "../../../api/ApiDashboard";

const InvoiceDetails = (props) => {
	const {invoice_id} = useParams();
	const {data: settings} = useSettings();
	const {data: invoice, isLoading} = useCustomerInvoiceDetails(invoice_id);

	useEffect(() => {
		goPageTop();
		analyticsPageView();
	}, [invoice_id]);

	if (isLoading) {
		return <PageSkeleton/>;
	}


	if (!invoice?.invoice_no) {
		return <Default404/>;
	}

	const currency = settings?.currency_icon || '৳';
	const invoice_items = invoice?.invoice_items || [];

	return (
		<main className="main bg-gray">
			<Helmet>
				<title>Invoice Details</title>
			</Helmet>

			<div className="page-content">
				<Breadcrumb
					current={'Invoice details'}
					collections={[
						{name: 'Dashboard', url: 'dashboard'},
						{name: 'Invoice', url: 'dashboard/my-invoice'},
					]}
				/>
				<div className="container">
					<div className="row justify-content-center">
						<aside className="col-md-12 col-lg-8">
							<div className="card my-3">
								<div className="card-body">
									<h2>Invoice details #{invoice.invoice_no}</h2>
									<hr className="my-2"/>

									<div className="row">
										<div className="col">
											<strong>Details</strong>
										</div>
										<div className="col text-right"><strong>Total</strong></div>
									</div>

									<hr className="my-2"/>
									{
										invoice_items?.length > 0 &&
										invoice_items.map((product, index) =>
											<InvoiceItems product={product} currency={currency} key={index}/>
										)
									}

									<div className="row">
										<div className="col-12">
											<p className="text-right">Courier Charge: <strong>{currency + ' ' + invoice?.total_courier}</strong>
											</p>
										</div>
										<div className="col-12">
											<p className="text-right">Invoice
												Total: <strong>{currency + ' ' + (Number(invoice?.total_payable))}</strong>
											</p>
										</div>
										<div className="col-12">
											<p className="text-right">Payment Method: <strong>{currency + ' ' + invoice?.payment_method}</strong>
											</p>
										</div>
									</div>
									<hr className="my-2"/>

									{/*<OrderSummary order={order} invoice_items={invoice_items} currency={currency}/>*/}

									{/*{invoice?.status === 'waiting-for-payment' && <hr className="my-2"/>}*/}

									{/*{invoice?.status === 'waiting-for-payment' && <RePayment order={invoice}/>}*/}

								</div>
							</div>
						</aside>
					</div>
				</div>
			</div>
		</main>
	);
};


export default InvoiceDetails;
