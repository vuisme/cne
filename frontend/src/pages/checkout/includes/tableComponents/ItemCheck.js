import React from 'react';
import {useCheckedUnchecked} from "../../../../api/CartApi";
import SmallSpinner from "../../../../loader/SmallSpinner";
import {useQueryClient} from "react-query";
import {itemIsCheckWillProcess, sumCartItemTotal} from "../../../../utils/AliHelpers";
import Swal from "sweetalert2";

const ItemCheck = (props) => {
	const {product, variation, settings} = props;

	const cache = useQueryClient();
	const {mutateAsync, isLoading} = useCheckedUnchecked();

	const currency = settings?.currency_icon;

	const isChecked = variation?.is_checked > 0;

	const checkedItem = (event) => {
		let thisIsChecked = event.target.checked;
		const checked = thisIsChecked ? '1' : '0';
		const variation_id = variation?.id || null;
		mutateAsync(
			{variation_id, checked},
			{
				onSuccess: (cart) => {
					cache.setQueryData("customer_cart", cart);
					cache.setQueryData("useCheckoutCart", cart);
				}
			}
		);
	};

	// console.log('isChecked', variation)

	return (
		<div>
			{
				isLoading ?
					<SmallSpinner/>
					: (
						<div className="pretty p-default p-round">
							<input type="checkbox"
										 id={`variation_${variation.configId}`}
										 checked={isChecked}
										 onChange={event => checkedItem(event)}/>
							<div className="state">
								<label htmlFor={`variation_${variation.configId}`}/>
							</div>
						</div>
					)
			}
		</div>
	);
};

export default ItemCheck;