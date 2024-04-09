import React, {useState} from "react";
import AddEditAddressForm from "../AddEditAddressForm";
import AddressItem from "./AddressItem";
import {useAddress} from "../../../../api/AddressApi";

const AddressLists = (props) => {
	const {cart, setManageShipping} = props;

	const [edit, setEdit] = useState(false);
	const [editAddress, setEditAddress] = useState({});

	const {data, isLoading, isSuccess} = useAddress();
	const addressList = data?.length ? data : [];


	if (edit) {
		return (
			<AddEditAddressForm setEdit={setEdit} editAddress={editAddress}  setManageShipping={setManageShipping}/>
		);
	}

	return (
		<div className="row">
			{isLoading ? (
				<div className="col-md-12  text-center py-5">
					<div className="spinner-border text-secondary">
						<span className="sr-only">Loading...</span>
					</div>
				</div>
			) : (
				addressList?.map((address) => <AddressItem key={address.id} cart={cart}  setEdit={setEdit} setEditAddress={setEditAddress} setManageShipping={setManageShipping} address={address}/>)
			)
			}
		</div>
	);
};

export default AddressLists;
