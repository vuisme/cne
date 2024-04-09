import React from 'react';
import {Link} from "react-router-dom";

const AttributeImage = (props) => {
	const {product, productPageLink, attributes} = props;

	const MainPictureUrl = product?.MainPictureUrl;
	const ItemId = product?.ItemId;
	const parseAttributes = attributes ? JSON.parse(attributes) : [];
	const findPicture = parseAttributes?.find(find => find.MiniImageUrl || find.ImageUrl);
	const imagePath = findPicture ? (findPicture?.MiniImageUrl ? findPicture?.MiniImageUrl : findPicture?.ImageUrl) : MainPictureUrl;


	return (
		<figure className="m-0">
			<Link to={productPageLink}>
				<img className="img-fluid mx-auto" src={imagePath} alt="attributes"/>
			</Link>
		</figure>
	);
};

export default AttributeImage;