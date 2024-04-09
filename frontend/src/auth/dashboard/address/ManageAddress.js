import React, {useEffect, useState} from 'react';
import Breadcrumb from "../../../pages/breadcrumb/Breadcrumb";
import {useAddress, useDeleteAddress} from "../../../api/AddressApi";
import AddEditAddress from "./includes/AddEditAddress";
import Swal from "sweetalert2";
import {useQueryClient} from "react-query";
import {goPageTop} from "../../../utils/Helpers";
import {analyticsPageView} from "../../../utils/AnalyticsHelpers";

const ManageAddress = (props) => {

	const [edit, setEdit] = useState(false);
	const [addressItem, setAddressItem] = useState({});

	const cache = useQueryClient();
	const {data: address, isLoading} = useAddress();

	const {mutateAsync} = useDeleteAddress();

	useEffect(() => {
		goPageTop();
		analyticsPageView();
	}, []);

	const toggleAddEdit = (shipping = {}) => {
		setAddressItem(shipping);
		setEdit(true);
	};

	const deleteShippingAddress = (shipping = {}) => {
		Swal.fire({
			title: 'Do you want to delete this?',
			icon: "warning",
			showCancelButton: true,
			confirmButtonText: 'Delete',
			denyButtonText: `Cancel`,
		}).then((result) => {
			if (result.isConfirmed) {
				mutateAsync({id: shipping.id}, {
					onSuccess: (res) => {
						if (res.status === true) {
							Swal.fire({
								text: "Address deleted successfully",
								icon: "success",
							});
							cache.invalidateQueries("useAddress")
						} else {
							Swal.fire({
								text: res.msg,
								icon: "error",
							});
						}
					}
				})
			}
		});
		setAddressItem(shipping);
	};


	return (
		<main className="main bg-gray">
			<div className="page-content">
				<Breadcrumb
					current={'Address'}
					collections={[
						{name: 'Dashboard', url: 'dashboard'}
					]}/>

				{edit && <AddEditAddress addressItem={addressItem} setEdit={setEdit}/>}

				<div className="container">
					<div className="row">
						<aside className="col-md-12">
							<div className="card my-3">
								<div className="card-body">
									<div className="cleafix">
										<h3 className="d-inline-block">My Address</h3>
										<button type="button"
										        onClick={() => toggleAddEdit()}
										        className="btn btn-light btn-sm ml-2">
											<i className="icon-plus"/> New Address
										</button>
									</div>
									<hr className="my-2"/>
									<div className="row">
										{
											address?.length > 0 &&
											address.map((shipping, index) =>
												<div key={index} className="col-sm-6 col-md-4">
													<div className="card mb-3">
														<div className="card-body">
															<p>
																<b>Name:</b> {shipping.name} <br/>
																<b>Phone:</b> {shipping.phone} <br/>
																<b>City:</b> {shipping.city} <br/>
																<b>Address:</b> {shipping.address} <br/>
															</p>
															<div className="btn-toolbar">
																<button type="button"
																        onClick={() => toggleAddEdit(shipping)}
																        className="btn btn-secondary btn-sm mr-1">
																	<i className="icon-edit"/>
																</button>
																<button type="button"
																        onClick={() => deleteShippingAddress(shipping)}
																        className="btn btn-sm btn-danger">
																	<i className=" icon-trash-empty"/>
																</button>
															</div>
														</div>
													</div>
												</div>
											)
										}
									</div>

								</div>
							</div>
						</aside>
					</div>
				</div>
			</div>
		</main>
	);
};

export default ManageAddress;