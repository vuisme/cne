import React from 'react'
import SpinnerButtonLoader from "../../../../../../loader/SpinnerButtonLoader";

const AliAddToCartButton = props => {
	const {addToCartProcess, isLoading, Quantity} = props;

	return (
		<div className="row">
			<div className="col-6 col-md-4">
				{
					isLoading ?
						<SpinnerButtonLoader buttonClass={`btn btn-custom-product btn-wishlist btn-block`}/>
						:
						<div className="input-group express_qty_input">
							<div className="input-group-prepend">
								<button
									type="button"
									className={`btn btn-secondary btn-minus disabled`}
								>
									<i className="icon-minus"/>
								</button>
							</div>
							<input type="text" className="form-control qty_input_field"
							       value={0}
							       readOnly={true}
							       onChange={e => addToCartProcess(e)}/>
							<div className="input-group-append">
								<button type="button"
								        onClick={e => addToCartProcess(e)}
								        className="btn btn-secondary btn-plus">
									<i className="icon-plus"/>
								</button>
							</div>
						</div>
				}
			</div>
			<div className="col">
				<p className="m-0 py-2">{Quantity} pieces available</p>
			</div>
		</div>
	)
};


export default AliAddToCartButton