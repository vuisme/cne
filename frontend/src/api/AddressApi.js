import {instance} from "../utils/AxiosInstance";
import {useMutation, useQuery} from "react-query";
import {setGetToken} from "./CartApi";


export const useAddress = () => useQuery("useAddress", async () => {
	try {
		const {data} = await instance.get(`address`);
		return data?.address ? data?.address : [];
	} catch (error) {
		throw Error(error.response.statusText);
	}
});

export const useSaveAddress = () => useMutation("useSaveAddress", async (props) => {
	const token = setGetToken();
	try {
		const {data} = await instance.post(`store-new-address`, {token: token, ...props});
		return data;
	} catch (error) {
		throw Error(error.response.statusText);
	}
});

export const useDeleteAddress = () => useMutation("useSaveAddress", async (props) => {
	try {
		const {data} = await instance.post(`delete-address`, props);
		return data;
	} catch (error) {
		console.log(error);
	}
});


export const useCartShippingAddress = () => useMutation("useSaveAddress", async (props) => {
	const token = setGetToken();
	try {
		const {data} = await instance.post(`/cart/shipping`, {token: token, ...props});
		return data;
	} catch (error) {
		throw Error(error.response.statusText);
	}
});