import React from 'react';
import AttributeImage from "../../../../pages/checkout/includes/attributes/AttributeImage";
import {Link} from "react-router-dom";
import {characterLimiter} from "../../../../utils/Helpers";
import AttrConfigs from "../../../../pages/checkout/includes/attributes/AttrConfigs";
import {singleProductTotal} from "../../../../utils/CartHelpers";
import {cartItemCheckedVariousTotal} from "../../../../utils/AliHelpers";

const InvoiceItems = (props) => {
	const {product, currency} = props;

	const order_item = product?.order_item || [];
	const variations = order_item?.item_variations || [];

	const productPageLink = (order_item) => {
		const ItemId = order_item?.ItemId;
		const ProviderType = order_item?.ProviderType;
		return ProviderType === 'aliexpress' ? `/aliexpress/product/${ItemId}` : `/product/${ItemId}`;
	};

	return (
		<div className="cartItem">
			{
				variations?.map((variation, index) =>
					<div className="variation" key={index}>
						<div className="row align-items-center">
							<div className="col-2">
								<Link to={productPageLink(order_item)}>
									<img className="img-fluid mx-auto" src={order_item?.MainPictureUrl} alt="attributes"/>
								</Link>
							</div>
							<div className="col-10">

								<Link to={productPageLink(order_item)} title={order_item.Title}>
									{characterLimiter(order_item.Title, 130)}
								</Link>
								<div>
									<p className="my-1 small">Provider: <strong>{order_item.ProviderType}</strong></p>
								</div>
								<div className="row align-items-center">
									<div className="col-12 text-right">
										<p className="m-0 pt-3 pt-lg-0">
											<strong>{`${currency + ' ' + product.total_due}`}</strong>
										</p>
									</div>
								</div>

							</div>
						</div>

						<hr className="my-2"/>

					</div>
				)
			}
		</div>
	);
};

export default InvoiceItems;