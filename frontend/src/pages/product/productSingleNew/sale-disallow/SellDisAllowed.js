import React from 'react';
import {Link} from "react-router-dom";

const SellDisAllowed = () => {
	return (
		<div className="row align-items-center" style={{minHeight:'80%'}}>
			<div className="col">
				<h2>“This page is not available now”</h2>

				<Link to={"/"} className={`btn btn-custom-product btn-addToCart`}>
					<span>SHOP MORE</span>
				</Link>
			</div>
		</div>
	);
};

export default SellDisAllowed;