import React, {useEffect, useState} from 'react';
import {loadAsset} from "../../../../../utils/Helpers";
import {useCartMutation} from "../../../../../api/CartApi";

const PopupShown = (props) => {
	const {settings, cart, product_id} = props;

	const [showModal, setShowModal] = useState(false);

	const {popupMessage: {mutateAsync, isLoading}} = useCartMutation();

	let messages = settings?.cart_popup_message || null;
	messages = messages ? JSON.parse(messages) : {};

	useEffect(() => {
		const cartItem = cart?.cart_items?.find(item => item.ItemId === product_id) || {};
		if (cartItem?.is_popup_shown === null && cartItem?.id !== undefined) {
			setShowModal(true);
		} else {
			setShowModal(false);
		}
	}, [cart]);

	if (!showModal) {
		return '';
	}

	const closeModal = () => {
		mutateAsync({item_id: product_id});
		setShowModal(false);
	};


	return (
		<div className="modal-open">
			<div className="modal fade show"
			     id="staticBackdrop"
			     data-backdrop="static"
			     data-keyboard="false"
			     style={{display: 'block'}}>
				<div className="modal-dialog modal-dialog-centered">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title" id="staticBackdropLabel">Must be Read</h5>
							<button type="button" className="close" onClick={() => closeModal()}>
								<span aria-hidden="true">&times;</span>
							</button>
						</div>
						<div className="modal-body">
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
						<div className="justify-content-center modal-footer">
							<button type="button" className="btn btn-default" onClick={() => closeModal()}>Understood</button>
						</div>
					</div>
				</div>
			</div>
			<div className="modal-backdrop fade show" onClick={() => closeModal()}/>
		</div>
	);
};

export default PopupShown;