import React from "react";
import {Link} from "react-router-dom";
import {useQueryClient} from "react-query";
import SmallSpinnerButtonLoader from "../../../loader/SmallSpinnerButtonLoader";
import {useAddToWishList} from "../../../api/WishListApi";

const ProductCart = (props) => {
	const {product, currencyIcon, productClass} = props;

	const product_code = product.product_code ? product.product_code : product.ItemId;

	const cache = useQueryClient();
	const {isLoading, mutateAsync} = useAddToWishList();

	const addToWishlist = (e) => {
		e.preventDefault();
		mutateAsync({product: product}, {
			onSuccess: (responseData) => {
				if (responseData?.status) {
					cache.setQueryData('wishlist', (responseData?.wishlists || {}));
				}
			}
		});
	};


	return (
		<div className={productClass ? productClass : 'col-6 col-sm-4 col-lg-4 col-xl-3'}>
			<div className="product">
				<figure className="product-media">
					<Link
						to={`/product/${product_code}`}
					>
						<img
							src={product?.img || product?.MainPictureUrl}
							className="product-image"
							alt={product.name}
						/>
					</Link>
					<div className="product-action-vertical">
						{
							isLoading ?
								<SmallSpinnerButtonLoader buttonClass="btn-product-icon btn-wishlist btn-expandable" textClass="text-white"/>
								:
								<a
									href={`/add-to-wishlist`}
									onClick={(e) => addToWishlist(e)}
									title="Add Wishlist"
									className="btn-product-icon btn-wishlist btn-expandable"
								>
									<i className="icon-heart-empty"/> <span>add to wishlist</span>
								</a>
						}
						<Link
							to={`/product/${product_code}`}
							className="btn-product-icon btn-quickview"
							title="Quick view"
						>
							<span>Quick view</span>
						</Link>
					</div>
				</figure>
				{/* End .product-media */}
				<div className="product-body">
					{/* End .product-cat */}
					<h3
						className="product-title"
						style={{
							whiteSpace: "nowrap",
							textOverflow: "ellipsis",
							overflow: "hidden"
						}}
						title={product.name}>
						<Link
							to={`/product/${product_code}`}
						>
							{product.name}
						</Link>
					</h3>
					{/* End .product-title */}
					<div className="clearfix d-block product-price">
						<span className="float-left">{`${currencyIcon}`} <span className="price_span">{product.sale_price}</span></span>
						<span className="sold_item_text">SOLD: {product.total_sold}</span>
					</div>

				</div>
				{/* End .product-body */}
			</div>
		</div>
	);
};


export default ProductCart;
