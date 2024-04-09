import React, { useEffect } from 'react'
import PropertyValues from "./includes/PropertyValues";

const AliAttributes = (props) => {
	const { cartItem, skuProperties, setActiveImg, operationalAttributes, setOperationalAttributes } = props;

	const Properties = skuProperties?.filter(findItem => findItem.name !== 'Ships From');
	const ShipsFrom = skuProperties?.find(findItem => findItem.name === 'Ships From');
	const ShipsFromCountries = ShipsFrom?.values?.find(value => value.propTips === "CN");

	useEffect(() => {
		if (skuProperties?.length > 0) {
			let selectedProperties = {};
			skuProperties?.map((property, index) => {
				const PropertyName = property?.name;
				selectedProperties[PropertyName] = property?.values[0];
			});
			if (ShipsFromCountries) {
				setOperationalAttributes({ ...selectedProperties, ['Ships From']: ShipsFromCountries });
			} else {
				setOperationalAttributes(selectedProperties);
			}
		}
	}, [skuProperties]);

	const selectAttribute = (skuPropertyName, Attribute) => {
		setOperationalAttributes({
			...operationalAttributes,
			[skuPropertyName]: Attribute
		});
	};

	const selectProperty = (property) => {
		const skuPropertyName = property?.name;
		return operationalAttributes?.[skuPropertyName];
	};

	return (
		<div className="mb-3">
			{
				Properties?.map((property, index) =>
					<div key={index} className="mb-3">
						<p>
							<b>{property?.name} : </b>
							<span className="seller_info">{selectProperty(property)?.name || 'Unknown'}</span>
						</p>
						<PropertyValues
							cartItem={cartItem}
							skuPropertyName={property?.name}
							PropertyValues={property?.values}
							selectProperty={selectProperty(property)}
							selectAttribute={selectAttribute}
							setActiveImg={setActiveImg}
						/>
					</div>
				)
			}
			{
				ShipsFromCountries?.name &&
				<div>
					<p>
						<b>Ship From : </b>
						<span className="seller_info">{selectProperty(ShipsFrom)?.name || 'Unknown'}</span>
					</p>
				</div>
			}
		</div>
	)
}

export default AliAttributes
