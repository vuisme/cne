import React from "react";
import {useAddToCart, useCartMutation} from "../../../../../api/CartApi";
import AddToCartButton from "./includes/AddToCartButton";
import ManageQuantity from "./includes/ManageQuantity";
import Swal from "sweetalert2";
import {
	getObjectPropertyValue,
	getProductCurrentPrice,
	getProductDeliveryCosts,
	getProductModifiedConfiguredItem, getProductModifiedWithOutConfiguredItem,
	getProductWeight
} from "../../../../../utils/CartHelpers";
import {useQueryClient} from "react-query";

const QuantityInput = props => {
	const {cart, product, activeConfiguredItems, settings} = props;

	const cache = useQueryClient();
	const {mutateAsync, isLoading} = useAddToCart();

	let activeConfiguredItem = activeConfiguredItems?.length === 1 ? activeConfiguredItems[0] : {};

	const rate = settings?.increase_rate || 15;
	const ConfiguredItems = product?.ConfiguredItems ? product.ConfiguredItems : [];

	const MasterQuantity = product?.MasterQuantity ? product.MasterQuantity : 0;
	const Quantity = activeConfiguredItem?.Quantity ? activeConfiguredItem.Quantity : 0;
	let activeConfigItemPrice = activeConfiguredItem?.Price?.OriginalPrice || 0;

	const addToCartProcess = (e) => {
		e.preventDefault();
		let activeProduct = {
			Id: getObjectPropertyValue(product, 'Id'),
			ProviderType: getObjectPropertyValue(product, 'ProviderType'),
			Title: getObjectPropertyValue(product, 'Title'),
			TaobaoItemUrl: getObjectPropertyValue(product, 'TaobaoItemUrl'),
			MainPictureUrl: getObjectPropertyValue(product, 'MainPictureUrl'),
			MasterQuantity: getObjectPropertyValue(product, 'MasterQuantity'),
			FirstLotQuantity: getObjectPropertyValue(product, 'FirstLotQuantity'),
			NextLotQuantity: getObjectPropertyValue(product, 'NextLotQuantity'),
			Price: getProductCurrentPrice(product,activeConfigItemPrice, rate),
			weight: getProductWeight(product),
			DeliveryCost: getProductDeliveryCosts(product, rate),
			Quantity: 1,
			hasConfigurators: true,
			IsCart: false
		};

		let process = false;

		if (activeConfiguredItem?.Id) {
			if (activeConfiguredItem?.Quantity > 0) {
				process = true;
				activeProduct.ConfiguredItems = getProductModifiedConfiguredItem(product, 1, activeConfiguredItem, rate);
			} else {
				Swal.fire({
					text: 'This variations stock is not available',
					icon: 'info'
				});
			}
		} else {
			if (ConfiguredItems?.length) {
				Swal.fire({
					text: 'Select your Item variations',
					icon: 'info'
				});
			} else {
				process = true;
				activeProduct.ConfiguredItems = getProductModifiedWithOutConfiguredItem(product, rate);
			}
		}

		if (process) {
			mutateAsync({product: activeProduct},{
				onSuccess: (cart)=>{
					cache.setQueryData("customer_cart", cart);
				}
			});
		}
	};

	const activeConfigId = ConfiguredItems?.length > 0 ? activeConfiguredItem?.Id : product?.Id;

	const configItem = cart?.cart_items?.find(findItem => findItem?.variations?.find(find => parseInt(find.configId) === parseInt(activeConfigId)));
	const cartConfiguredItem = configItem?.variations?.find(find => parseInt(find.configId) === parseInt(activeConfigId));

	let cartItemQty = configItem?.quantity;
	let cartConfigQty = cartConfiguredItem?.qty;


	if (!configItem || !cartConfigQty) {
		return (
			<AddToCartButton addToCartProcess={addToCartProcess} isLoading={isLoading} Quantity={Quantity} MasterQuantity={MasterQuantity}/>);
	}

	return (
		<ManageQuantity cart={cart} configItem={configItem} cartConfiguredItem={cartConfiguredItem} Quantity={Quantity} product={product}/>
	);
};


export default QuantityInput;
