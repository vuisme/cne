import React from 'react';

const PriceCard = (props) => {
	const {product, settings, activeConfiguredItems} = props;


	const currency = settings?.currency_icon || '৳';
	const rate = settings?.increase_rate || 15;
	const activeConfiguredItem = activeConfiguredItems?.length === 1 ? activeConfiguredItems[0] : {};

	const Price = product?.Price ? product.Price : {};
	const configPrice = activeConfiguredItem?.Price ? activeConfiguredItem.Price : Price;
	const activeConfigId = activeConfiguredItem?.Id;

	let OriginalPrice = configPrice?.OriginalPrice ? configPrice.OriginalPrice : 0;
	let MarginPrice = configPrice?.MarginPrice ? configPrice.MarginPrice : 0;

	const Promotions = product?.Promotions ? product.Promotions : [];
	if (Promotions?.length > 0) {
		let promoPrice = Promotions[0]?.Price?.OriginalPrice;
		let PromoConfiguredItemPrice = Promotions[0]?.ConfiguredItems?.find(find => find.Id === activeConfigId)?.Price?.OriginalPrice;
		OriginalPrice = PromoConfiguredItemPrice ? PromoConfiguredItemPrice : promoPrice;
	}

	MarginPrice = Number(MarginPrice) * Number(rate);
	OriginalPrice = Number(OriginalPrice) * Number(rate);

	const discount = 100 - (OriginalPrice / MarginPrice * 100);


	return (
		<div className="card mb-3 pricing_card">
			<div className="card-body">
				<div>
					<span className="show_price">{currency + ' ' + Math.round(OriginalPrice)}</span>
					{
						Number(discount) > 0 &&
						<del className="ml-3 delete_price">{currency + ' ' + Math.round(MarginPrice)}</del>
					}
				</div>
				{
					Number(discount) > 0 &&
					<div className="discount_box">
						{Math.round(discount)}% Discount
					</div>
				}
			</div>
		</div>
	);
};

export default PriceCard;