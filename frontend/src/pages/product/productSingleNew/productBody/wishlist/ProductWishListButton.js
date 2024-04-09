import React from 'react';
import {useAddToWishList, useWishList} from "../../../../../api/WishListApi";
import {useQueryClient} from "react-query";
import {isAuthenticated} from "../../../../../api/Auth";
import Swal from "sweetalert2";
import SpinnerButtonLoader from "../../../../../loader/SpinnerButtonLoader";
import {taobaoProductPrepareForLove} from "../../../../../utils/CartHelpers";

const ProductWishListButton = (props) => {
	const {product, gaEventTracker, settings} = props;
	const {data: wishList} = useWishList();
	const cache = useQueryClient();
	const {isLoading, mutateAsync} = useAddToWishList();

	const isAuth = isAuthenticated();
	const rate = settings?.increase_rate || 15;

	const addToWishList = (event) => {
		event.preventDefault();
		if (isAuth) {
			const wishListProduct = taobaoProductPrepareForLove(product, rate);
			mutateAsync(wishListProduct, {
				onSuccess: (resData) => {
					if (resData?.status) {
						cache.setQueryData('wishlist', (resData?.wishlists || {}));
					}
				}
			});
			gaEventTracker(`add-to-love-${product?.Id}`);
		} else {
			Swal.fire({
				text: 'Please login your account first',
				icon: 'warning'
			})
		}
	};

	if (isLoading) {
		return <SpinnerButtonLoader buttonClass={`btn btn-custom-product btn-wishlist btn-block`}/>
	}

	const isExists = wishList.find(find => find.ItemId === product.Id)?.id || false;

	return (
		<a href={"/add-to-wishlist"}
		   onClick={(event) => addToWishList(event)}
		   className={`btn btn-custom-product btn-wishlist btn-block ${isExists && 'disabled'}`}
		>
			<span className="cartIcon"><i className="icon-heart-empty"/></span>
			<span>Wishlist</span>
		</a>
	);
};

export default ProductWishListButton;