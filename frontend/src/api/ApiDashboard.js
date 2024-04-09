import {useMutation, useQuery} from "react-query";
import {instance} from "../utils/AxiosInstance";


export const usePaymentStatusUpdate = () => useMutation("usePaymentStatusUpdate", async (props) => {
	try {
		const {data} = await instance.post(`/dashboard/payment/status/update`, props);
		return data?.cart ? data.cart : {};
	} catch (error) {
		console.log(error);
	}
});


export const useCustomerOrders = (page, limit) => useQuery(['useOrders', page], async () => {
	try {
		const {data} = await instance.get(`/dashboard/orders`, {page, limit});
		return data?.orders ? data.orders : [];
	} catch (error) {
		console.log(error);
	}
});


export const useCustomerOrderDetails = (tran_id) => useQuery(['useOrderDetails', tran_id], async () => {
	try {
		const {data} = await instance.get(`/dashboard/order/${tran_id}`);
		return data?.order ? data.order : {};
	} catch (error) {
		console.log(error);
	}
});

export const useCustomerWalletDetails = (id) => useQuery(['useCustomerWalletDetails', id], async () => {
	try {
		const {data} = await instance.get(`/dashboard/wallet/${id}`);
		return data?.wallet ? data.wallet : {};
	} catch (error) {
		console.log(error);
	}
});

export const useRepaymentOrderByBkash = () => useMutation('useRepaymentOrderByBkash', async (props) => {
	try {
		const {data} = await instance.post(`/dashboard/order/payment/generate`, props);
		return data;
	} catch (error) {
		console.log(error);
	}
});



export const useCustomerInvoices = (page) => useQuery(['useOrders', page], async () => {
	let limit = 10;
	try {
		const {data} = await instance.get(`/dashboard/invoices`,  {params: {page, limit}});
		return data;
	} catch (error) {
		console.log(error);
	}
});


export const useCustomerInvoiceDetails = (invoice_id) => useQuery(['useOrderDetails', invoice_id], async () => {
	try {
		const {data} = await instance.get(`/dashboard/invoices/${invoice_id}`);
		return data?.invoice ? JSON.parse(data.invoice) : {};
	} catch (error) {
		console.log(error);
	}
});