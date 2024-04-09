import React from "react";
import {Link} from "react-router-dom";
import SmallSpinnerButtonLoader from "../../../loader/SmallSpinnerButtonLoader";
import {useQueryClient} from "react-query";
import {useAddToWishList} from "../../../api/WishListApi";

const AliProductCard = ({product, currency, aliRate, productClass}) => {

  const productId = product?.num_iid || '';
  const title = product?.title || '';
  const image = product?.image || '';

  let price = product?.price || 0;
  price = Number(price) * Number(aliRate);
  let promotion_price = product?.promotion_price || '';
  promotion_price = Number(promotion_price) * Number(aliRate);

  const sales = product?.sales || '';

  const cache = useQueryClient();
  const {isLoading, mutateAsync} = useAddToWishList();

  const addToWishlist = (event) => {
    event.preventDefault();
    alert('process will be done');
    // mutateAsync({product: product}, {
    // 	onSuccess: (responseData) => {
    // 		if (responseData?.status) {
    // 			cache.setQueryData('wishlist', (responseData?.wishlists || {}));
    // 		}
    // 	}
    // });
  };

  return (
    <div className={productClass ? productClass : 'col-6 col-sm-4 col-lg-4 col-xl-3'}>
      <div className="product">
        <figure className="product-media">
          <Link to={`/aliexpress/product/${productId}`}>
            <img
              src={image}
              className="product-image"
            />
          </Link>

          <div className="product-action-vertical">
            {
              isLoading ?
                <SmallSpinnerButtonLoader buttonClass="btn-product-icon btn-wishlist btn-expandable"
                                          textClass="text-white"/>
                :
                <a
                  href={`/add-to-wishlist`}
                  onClick={event => addToWishlist(event)}
                  title="Add Wishlist"
                  className="btn-product-icon btn-wishlist btn-expandable"
                >
                  <i className="icon-heart-empty"/> <span>add to wishlist</span>
                </a>
            }
            <Link
              to={`/aliexpress/product/${productId}`}
              className="btn-product-icon btn-quickview"
              title="Quick view"
            >
              <span>Quick view</span>
            </Link>
          </div>
        </figure>
        <div className="product-body">
          <h3
            className="product-title"
            style={{
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              overflow: "hidden",
            }}
            title={title}
          >
            <Link to={`/aliexpress/product/${productId}`}>
              {title}
            </Link>
          </h3>
          <div className="clearfix d-block product-price">
                        <span className="float-left">
                            {currency}<span className="price_span">{Math.round(promotion_price)}</span>
                        </span>
            <del className="sold_item_text">
              {currency + " " + Math.round(price)}
            </del>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AliProductCard;
