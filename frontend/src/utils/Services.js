import {instance} from "./AxiosInstance";
import _ from "lodash";

export const getProductDescription = async (product_id) => {
	return await instance
		.get(`product-description/${product_id}`)
		.then((res) => {
			const resData = res.data;
			if (!_.isEmpty(resData)) {
				return resData.data;
			}
			return {};
		});
};

export const getProductSellerInfo = async (VendorId) => {
	return await instance
		.get(`product-seller-information/${VendorId}`)
		.then((res) => {
			const resData = res.data;
			if (!_.isEmpty(resData)) {
				return resData.data;
			}
			return {};
		});
};

export const loadRecentProducts = async () => {
	return await instance
		.get("recent-products")
		.then((res) => {
			const resData = res.data;
			if (!_.isEmpty(resData)) {
				return resData.data;
			}
			return {};
		})
		.catch((error) => {
			console.log(error.response);
		});
};



export const storeNewAddress = async (storeData) => {
	return await instance
		.post("store-new-address", storeData)
		.then((res) => {
			const resData = res.data;
			if (!_.isEmpty(resData)) {
				return resData.data;
			}
			return {};
		})
		.catch((error) => {
			console.log(error.response);
		});
};

export const deleteCustomerAddress = async (deleteData) => {
	return await instance
		.post("delete-address", deleteData)
		.then((res) => {
			const resData = res.data;
			if (!_.isEmpty(resData)) {
				return resData.data;
			}
			return {};
		})
		.catch((error) => {
			console.log(error.response);
		});
};



export const loadTextSearchProducts = async (searchKey, offset, limit) => {
	return await instance
		.post(`get-search-result/${searchKey}`, {
			offset: offset,
			limit: limit,
		})
		.then((response) => {
			const responseData = response.data;
			if (!_.isEmpty(responseData)) {
				return responseData.data;
			}
			return [];
		})
		.catch((error) => {
			console.log(error.response);
		});
};






