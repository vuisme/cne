import React, {useEffect, useState} from 'react';
import {loadAsset} from "../../../../../utils/Helpers";
import {usePopupMessage} from "../../../../../api/CartApi";
import SpinnerButtonLoader from "../../../../../loader/SpinnerButtonLoader";

const PopupShown = (props) => {
	const {cartItem, item_id, processAddToCart, settings, setShowPopup} = props;

	const {mutateAsync, isLoading} = usePopupMessage();

	let messages = settings?.cart_popup_message || null;
	messages = messages ? JSON.parse(messages) : {};

	const closeModal = () => {
		mutateAsync({item_id},
			{
				onSuccess: () => {
					processAddToCart();
				}
			}
		);
	};


	return (
		<div className="modal-open">
			<div className="modal fade show"
			     id="staticBackdrop"
			     data-backdrop="static"
			     data-keyboard="false"
			     style={{display: 'block'}}>
				<div className="modal-dialog modal-dialog-centered">
					<div className="modal-content popupModalBody">
						<div className="modalCloseButton">
							<button type="button" className="close" onClick={() => setShowPopup(false)}>
								<i className="icon-cancel-1"/>
							</button>
						</div>
						<div className="modal-body p-0">
							{messages?.popup_option === 'only_text' && <p>{messages?.popup_message}</p>}
							{
								messages?.popup_option === 'only_image' &&
								<img src={loadAsset(messages?.popup_image)} className="img-fluid" alt="popup"/>
							}
							{
								messages?.popup_option === 'both' &&
								<>
									<img src={loadAsset(messages?.popup_image)} className="img-fluid mb-3" alt="popup"/>
									<p>{messages?.popup_message}</p>
								</>
							}
						</div>
						<div className="modalAgreeButton">
							{
								isLoading ?
									<SpinnerButtonLoader buttonClass={'btn btn-default px-3'}/>
									:
									<button type="button" className="btn btn-default" onClick={() => closeModal()}>Read & Agree</button>
							}
						</div>
					</div>
				</div>
			</div>
			<div className="modal-backdrop fade show"/>
		</div>
	);
};

export default PopupShown;