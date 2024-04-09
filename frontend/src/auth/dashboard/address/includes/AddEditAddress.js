import React, {useEffect, useState} from 'react';
import SpinnerButtonLoader from "../../../../loader/SpinnerButtonLoader";
import {useSaveAddress} from "../../../../api/AddressApi";
import {useQueryClient} from "react-query";
import Swal from "sweetalert2";

const AddEditAddress = (props) => {

	const {addressItem, setEdit} = props;

	const [name, setName] = useState("");
	const [phone, setPhone] = useState("");
	const [city, setCity] = useState("");
	const [address, setAddress] = useState("");
	const [errors, setErrors] = useState([]);

	const cache = useQueryClient();
	const {mutateAsync, isLoading} = useSaveAddress();

	useEffect(() => {
		if (addressItem?.id) {
			setName(addressItem?.name);
			setPhone(addressItem?.phone);
			setCity(addressItem?.city);
			setAddress(addressItem?.address);
		}
	}, [addressItem]);


	const addUpdateShippingAddress = (e) => {
		e.preventDefault();
		const id = addressItem?.id || null;
		mutateAsync({id, name, phone, city, address}, {
			onSuccess: (res) => {
				if (res?.status === true) {
					Swal.fire({
						text: res?.message,
						icon: 'success',
						confirmButtonText: 'Ok, Understood'
					});
					setEdit(false);
				} else {
					setErrors(res.errors);
				}
				cache.invalidateQueries("useAddress")
			}
		});
	};


	const hasAddress = addressItem?.id || false;

	const nameError = errors?.name ? errors.name[0] : null;
	const phoneError = errors?.phone ? errors.phone[0] : null;
	const cityError = errors?.city ? errors.city[0] : null;
	const addressError = errors?.address ? errors.address[0] : null;

	return (
		<div
			className="modal fade show"
			style={{display: 'block'}}
		>
			<div className="modal-dialog modal-dialog-centered">
				<div className="modal-content">
					<div className="modal-header">
						<h4 className="modal-title" id="staticBackdropLabel">
							{hasAddress ? 'Update Shipping Address' : 'Add New Shipping Address'}
						</h4>
						<button
							type="button"
							className="close"
							onClick={() => setEdit(false)}
						>
							<span aria-hidden="true">×</span>
						</button>
					</div>
					<div className="modal-body px-4">
						<form onSubmit={(event) => addUpdateShippingAddress(event)}>
							<div className="form-group">
								<label htmlFor="name">Name <span className="text-danger"> * </span> </label>
								<input
									type="text"
									className="form-control"
									id="name"
									value={name}
									onChange={(e) => setName(e.target.value)}
									autoComplete="name"
									placeholder="Name"
									required={true}
								/>
								{nameError && <p className="small m-0 text-danger">{nameError}</p>}
							</div>
							<div className="form-group">
								<label htmlFor="phone"> Phone <span className="text-danger"> * </span> </label>
								<input
									type="text"
									className="form-control"
									value={phone}
									onChange={(e) => setPhone(e.target.value)}
									placeholder="Phone"
									id="phone"
									required={true}
								/>
								{phoneError && <p className="small m-0 text-danger">{phoneError}</p>}
							</div>
							<div className="form-group">
								<label htmlFor="city">City </label>
								<input
									type="text"
									className="form-control"
									value={city}
									onChange={(e) => setCity(e.target.value)}
									id="city"
									placeholder="City"
									required={true}
								/>
								{cityError && <p className="small m-0 text-danger">{cityError}</p>}
							</div>

							<div className="form-group">
								<label htmlFor="address"> Full Address <span className="text-danger"> * </span></label>
								<input
									type="text"
									className="form-control"
									value={address}
									onChange={(e) => setAddress(e.target.value)}
									id="address"
									placeholder="Full Address"
									required={true}
								/>
								{addressError && <p className="small m-0 text-danger">{addressError}</p>}
							</div>

							<div className="form-group">
								{
									isLoading ?
										<SpinnerButtonLoader/>
										:
										<button type="submit" className={`btn btn-block btn-default`}>
											{hasAddress ? 'Update Address' : 'Save Address'}
										</button>
								}
							</div>


						</form>
					</div>
				</div>
			</div>
		</div>

	);
};


export default AddEditAddress;