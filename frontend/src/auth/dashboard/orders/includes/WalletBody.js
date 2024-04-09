import React from 'react';
import AttributeImage from "../../../../pages/checkout/includes/attributes/AttributeImage";
import {Link} from "react-router-dom";
import {characterLimiter} from "../../../../utils/Helpers";
import AttrConfigs from "../../../../pages/checkout/includes/attributes/AttrConfigs";

const WalletBody = (props) => {

	const {wallet, variation, currency} = props;

	const productPageLink = (wallet) => {
		const ItemId = wallet?.ItemId;
		const ProviderType = wallet?.ProviderType;
		return ProviderType === 'aliexpress' ? `/aliexpress/product/${ItemId}` : `/product/${ItemId}`;
	};

	return (
		<div className="cartItem">
			<div className="variation">
				<div className="row align-items-center">
					<div className="col-2">
						<AttributeImage product={wallet} productPageLink={productPageLink(wallet)} attributes={variation?.attributes}/>
					</div>
					<div className="col-10">
						<Link to={productPageLink(wallet)} title={wallet.Title}>
							{characterLimiter(wallet.Title, 130)}
						</Link>
						<div>
							<p className="my-1 small">Provider: <strong>{wallet.ProviderType}</strong></p>
							<p className="my-1 small">Weight: <strong>{wallet.weight} Kg.</strong>
								<span className="ml-2">Shipping Rate: <strong>{currency + ' ' + wallet.shipping_rate}</strong> per Kg.</span>
							</p>
							{
								wallet.ProviderType === 'aliexpress' &&
								<p className="my-1 small">Shipping Type: <strong>{wallet.shipping_type}</strong></p>
							}
						</div>
						{
							JSON.parse(variation?.attributes).length > 0 &&
							<div className="row">
								<div className="col-12">
									<div className="mb-2 small">Variations: <strong><AttrConfigs attributes={variation?.attributes}/></strong></div>
								</div>
							</div>
						}
						<div className="row align-items-center">
							<div className="col-6 text-left ">
								<p className="m-0 pt-3 pt-lg-0"><strong>{`${currency + ' ' + variation.price} x ${variation.qty}`}</strong>
								</p>
							</div>
							<div className="col-6 text-right">
								<p className="m-0 pt-3 pt-lg-0">
									<strong>{`${currency + ' ' + Math.round(Number(variation.qty) * Number(variation.price))}`}</strong></p>
							</div>
						</div>

					</div>
				</div>
				<hr className="my-2"/>
			</div>
		</div>
	);
};

export default WalletBody;