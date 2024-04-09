import React, {useEffect} from 'react';
import {useAliProductDescription} from "../../../../../../api/AliExpressProductApi";
import $ from "jquery";

const AliProductDescription = (props) => {
	const {product} = props;

	const descriptionModule = product?.item?.desc?.url;

	const {data: description, isLoading} = useAliProductDescription(descriptionModule);

	useEffect(() => {
		const descriptionModule = $(".descriptionModule");
		descriptionModule.find('link').remove();
		descriptionModule.find('script').remove();

	}, [description]);

	if (!descriptionModule) {
		return '';
	}

	return (
		<div className="product-desc-content descriptionModule">
			{/*<div className="embed-responsive embed-responsive-4by3">*/}
			{/*	<iframe className="embed-responsive-item" src={descriptionModule}/>*/}
			{/*</div>*/}
			{description &&
			<div dangerouslySetInnerHTML={{__html: description}}/>
			}
		</div>
	);
};

export default AliProductDescription;