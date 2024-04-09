import React from 'react';
import {Link} from "react-router-dom";
import {characterLimiter} from "../../../../utils/Helpers";
import AttrConfigs from "../attributes/AttrConfigs";
import CheckoutQuantity from "../tableComponents/CheckoutQuantity";
import {useMediaQuery} from "react-responsive";

const AliExpressItemDescription = (props) => {
	const {productPageLink, product, variation, currency, isQuantity} = props;

	const isMobile = useMediaQuery({query: '(max-width: 991px)'});

	return (
		<div>
			<Link to={productPageLink} title={product.Title}>
				{
					isMobile ?
						characterLimiter(product.Title, 45)
						:
						characterLimiter(product.Title, 115)
				}
			</Link>
			<p className="mb-0 text-capitalize small">Source: <strong>{product?.ProviderType}</strong></p>
			{
				JSON.parse(variation?.attributes).length > 0 &&
				<div className="small">
					Variations: <strong><AttrConfigs attributes={variation?.attributes}/></strong>
				</div>
			}
			<p className="mb-0 text-capitalize small">
				Shipping
				method: <strong>{product?.shipping_type === 'regular' ? `Regular Shipping (25-90 Days)` : `Express Shipping (15-25 Days)`}</strong>
			</p>
			{
				product?.shipping_type === 'express' &&
				<p className="mb-0 text-capitalize small">
					Shipping rate: <strong>{` ${currency + ' ' + product?.shipping_rate} `}</strong>
				</p>
			}
			{
				isQuantity &&
				<p className="mb-0 text-capitalize small">
					Per unit price: <strong>{` ${currency + ' ' + variation.price} `}</strong>
				</p>
			}

			<div className="row align-items-center">
				{
					isQuantity ?
						<>
							<div className="col-7 pr-0 col-lg-4">
								<p className="m-0 small d-block d-lg-none">Max: {variation.maxQuantity}</p>
								<CheckoutQuantity product={product} variation={variation}/>
							</div>
							<div className="col-3 d-none d-lg-block">
								<p className="m-0">Max: {variation.maxQuantity}</p>
							</div>
							<div className="col-3 px-0 col-lg-2 text-center d-none d-lg-block ">
								<p className="m-0 pt-2 pt-lg-0"><strong>{` ${currency + ' ' + variation.price} `}</strong></p>
							</div>
							<div className="col-5 col-lg-3 pl-0 text-right">
								<p className="m-0 pt-3 pt-lg-0">
									<strong>{`${currency + ' ' + Math.round(Number(variation.qty) * Number(variation.price))}`}</strong></p>
							</div>
						</>
						:
						<>
							<div className="col-6 text-left ">
								<p className="m-0 pt-2 pt-lg-0">
									<strong>{`${currency + ' ' + variation.price} x ${variation.qty}`}</strong>
								</p>
							</div>
							<div className="col-6 text-right">
								<p className="m-0 pt-2 pt-lg-0">
									<strong>{`${currency + ' ' + Math.round(Number(variation.qty) * Number(variation.price))}`}</strong>
								</p>
							</div>
						</>
				}
			</div>

		</div>
	);
};

export default AliExpressItemDescription;