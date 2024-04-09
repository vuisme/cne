import ImageLoader from "../../../../../../loader/ImageLoader";

const PropertyValues = (props) => {
	const { cartItem, PropertyValues, skuPropertyName, selectProperty, selectAttribute, setActiveImg } = props;
	const cart_variations = cartItem?.variations || [];

	const isExistOnSelectAttr = (Attribute, className = 'isSelect') => {
		if (selectProperty?.vid === Attribute.vid) {
			return className;
		}
		return '';
	};


	const isExistsQuantity = (Attribute) => {
		let exists = 0;
		if (cart_variations?.length > 0) {
			for (let i = 0; i < cart_variations?.length; i++) {
				const variation = cart_variations[i];
				let attrData = variation?.attributes ? JSON.parse(variation?.attributes) : [];
				attrData = attrData?.find((find) => Attribute.vid === find.Pid && Attribute.name === find.Value);
				if (attrData?.Pid) {
					exists = variation?.qty || 0;
					break;
				}
			}
		}
		return exists;
	};

	return (
		<div className="clearfix product-nav product-nav-thumbs">
			{
				PropertyValues.map((Attribute, key) =>
					<div
						key={key}
						onClick={() => selectAttribute(skuPropertyName, Attribute)}
						className={`attrItem text-center ${isExistOnSelectAttr(Attribute)}`}
						title={Attribute?.name}
					>
						{Attribute?.image ?
							<>
								{
									isExistsQuantity(Attribute) > 0 &&
									<span className="selected_qty">{isExistsQuantity(Attribute)}</span>
								}
								<ImageLoader
									path={Attribute?.image}
									width={'2.5rem'}
									height={'2.5rem'}
									onClick={() => setActiveImg(Attribute?.image)}
								/>
							</>
							:
							Attribute?.name
						}
					</div>
				)}
		</div>
	);
};

export default PropertyValues;