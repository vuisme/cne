import React from 'react';
import Swal from "sweetalert2";
import {useCheckoutUpdate} from "../../../../api/CartApi";
import {useQueryClient} from "react-query";

const CheckoutQuantity = (props) => {
	const {product, variation} = props;

	const cache = useQueryClient();
	const {mutateAsync, isLoading} = useCheckoutUpdate();

	let maxQuantity = variation?.maxQuantity;

	const updateCustomerCartQuantity = (newQty) => {
		let Max = maxQuantity ? parseInt(maxQuantity) : 0;
		let proceed = true;
		if (parseInt(newQty) > Max) {
			proceed = false;
			Swal.fire({
				text: 'Maximum quantity already selected',
				icon: "warning",
				buttons: "Ok, Understood",
			});
		}
		if (proceed) {
			mutateAsync({
				cart_id: product?.cart_id,
				item_id: product?.id,
				variation_id: variation?.id,
				qty: parseInt(newQty),
			}, {
				onSuccess: (cart) => {
					cache.setQueryData("useCheckoutCart", cart);
				}
			});
		}
	};

	const incrementDecrement = (proQty, qtyType = null) => {
		let calculateQty = proQty;
		if (qtyType === 'minus') {
			calculateQty = parseInt(proQty) - 1;
		} else {
			calculateQty = parseInt(proQty) + 1;
		}
		updateCustomerCartQuantity(calculateQty);
	};

	if (parseInt(variation?.is_checked) === 1) {
		return (
			<div className="input-group input-group-sm">
				<div className="input-group-prepend">
					<button
						type="button"
						className="btn btn-default disabled"
					>
						<i className="icon-minus"/>
					</button>
				</div>
				<input
					type="text"
					className="form-control text-center disabled"
					value={variation.qty}
					readOnly={true}
					onChange={e => e.preventDefault()}
					min={1}
					max={variation.maxQuantity}
					step={1}
					required={true}
				/>
				<div className="input-group-append">
					<button
						type="button"
						className="btn btn-default disabled"
					>
						<i className="icon-plus"/>
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="input-group input-group-sm">
			<div className="input-group-prepend">
				<button
					type="button"
					onClick={() => incrementDecrement(variation.qty, 'minus')}
					className="btn btn-default"
				>
					<i className="icon-minus"/>
				</button>
			</div>
			<input
				type="text"
				className="form-control text-center"
				value={variation.qty}
				onChange={e => updateCustomerCartQuantity(e.target.value)}
				min={1}
				max={variation.maxQuantity}
				step={1}
				required={true}
			/>
			<div className="input-group-append">
				<button
					type="button"
					onClick={() => incrementDecrement(variation.qty)}
					className="btn btn-default"
				>
					<i className="icon-plus"/>
				</button>
			</div>
		</div>
	);
};

export default CheckoutQuantity;