import React from 'react';
import Swal from "sweetalert2";
import {useQueryClient} from "react-query";
import {useDeleteAddress, useSaveAddress} from "../../../../api/AddressApi";

const AddressItem = (props) => {
	const {cart, address, setEdit, setEditAddress, setManageShipping} = props;
	const cache = useQueryClient();

	const {isLoading, mutateAsync} = useSaveAddress();

	const {mutateAsync: deleteShippingAddress} = useDeleteAddress();

	const selectShippingAddress = async (e) => {
		e.preventDefault();
		await mutateAsync(address, {
			onSuccess: () => {
				cache.invalidateQueries("customer_cart");
				cache.invalidateQueries("useCheckoutCart");
				cache.invalidateQueries("address");
				setManageShipping(false);
			}
		});
	};

	const shipping = cart?.shipping ? JSON.parse(cart?.shipping) : {};

	const alreadyShipping = parseInt(shipping?.id) === parseInt(address.id);


	const selectEditAddress = (e, address) => {
		e.preventDefault();
		setEdit(true);
		setEditAddress(address);
	};

	const deleteAddress = (e, address) => {
		e.preventDefault();
		Swal.fire({
			text: "Are you want to delete?",
			icon: "warning",
			showCancelButton: true,
			confirmButtonText: 'Delete',
			denyButtonText: `Don't Delete`,
		}).then((result) => {
			if (result.isConfirmed) {
				deleteShippingAddress(address, {
					onSuccess: () => {
						cache.invalidateQueries("address");
					}
				});
			}
		});
	};


	return (
		<div className="col-md-12">
			<div className="card-body address_card" onClick={(e) => selectShippingAddress(e)}>
				<div className="clearfix py-2">
					<div className="float-left">
						{
							isLoading ?
								<div className="spinner-border spinner-border-sm" role="status">
									<span className="sr-only">Loading...</span>
								</div>
								: (
									<div className="pretty p-default p-round">
										<input type="checkbox"
										       checked={alreadyShipping}
										       onChange={(e) => selectShippingAddress(e)}/>
										<div className="state">
											<label>{alreadyShipping ? `Default Shipping` : `Ship here`}</label>
										</div>
									</div>
								)
						}
					</div>
					<div className="btn-group btn-group-sm float-right">
						<a
							href={`/edit`}
							onClick={(e) => selectEditAddress(e, address)}
							className="btn btn-secondary"
							title="Edit Address"
						>
							<i className="icon-pencil"/>
						</a>
						<a
							href={`/delete`}
							onClick={(e) => deleteAddress(e, address)}
							className="btn btn-danger"
							title="Delete Address"
						>
							<i className="icon-trash-empty"/>
						</a>
					</div>
				</div>
				<p className="text-left">
					<b>Name:</b> {address.name} <br/>
					<b>Phone:</b> {address.phone} <br/>
					<b>District:</b> {address.city} <br/>
					<b>Address:</b> {address.address}
				</p>
			</div>
		</div>
	);
};

export default AddressItem;