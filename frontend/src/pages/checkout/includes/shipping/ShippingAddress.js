import React, {useState} from "react";
import AddEditAddressForm from "../AddEditAddressForm";
import AddressLists from "./AddressLists";


const ShippingAddress = (props) => {
	const {cart, shipping, setManageShipping} = props;

	const [newAddress, setNewAddress] = useState(false);

	const addNewAddress = (e) => {
		e.preventDefault();
		setNewAddress(true);
	};

	return (
		<>
			<div
				className={`modal fade show`}
				style={{display: "block"}}
			>
				<div className="modal-dialog modal-dialog-scrollable modal-dialog-centered">
					<div className="modal-content">
						<div className="modal-header">
							<h5
								className="modal-title"
								id="chooseAddressModalLabel"
							>
								Choose shipping
								<a
									href={`/add-new-address`}
									onClick={(e) => addNewAddress(e)}
									className="btn ml-2 text-violet"
								>
									<i className="icon-edit"/> New Address
								</a>
							</h5>
							<button
								type="button"
								onClick={() => setManageShipping(false)}
								className="close"
								data-dismiss="modal"
								aria-label="Close"
							>
							<span aria-hidden="true">
								<i className="icon-cancel-1"/>
							</span>
							</button>
						</div>
						<div className="modal-body">
							{newAddress ? (
								<AddEditAddressForm
									setNewAddress={setNewAddress}
									currentAddress={shipping}
									setManageShipping={setManageShipping}
								/>
							) : (
								<AddressLists cart={cart} setManageShipping={setManageShipping}/>
							)}
						</div>
					</div>
				</div>
			</div>
			<div className="modal-backdrop fade show"/>
		</>
	);
};

export default ShippingAddress;
