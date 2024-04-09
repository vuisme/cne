import React from "react";
import AllCheck from "./tableComponents/AllCheck";
import ItemCheck from "./tableComponents/ItemCheck";
import AttributeImage from "./attributes/AttributeImage";
import TaobaoItemDescription from "./itemDescription/TaobaoItemDescription";
import AliExpressItemDescription from "./itemDescription/AliExpressItemDescription";
import CheckoutItemSimpleSummary from "./CheckoutItemSimpleSummary";
import { useQueryClient } from "react-query";
import { useAddToWishList, useWishList } from "../../../api/WishListApi";

const CheckoutItem = (props) => {
  const {
    cart,
    cartItems,
    settings,
    currency,
    removeCart,
    removeItemFromCart,
  } = props;

  const cache = useQueryClient();
  const { isLoading, mutateAsync } = useAddToWishList();

  const { data: wishList } = useWishList();

  const rate = settings?.increase_rate || 0;

  const productPageLink = (product) => {
    const ItemId = product?.ItemId;
    const ProviderType = product?.ProviderType;
    return ProviderType === "aliexpress"
      ? `/aliexpress/product/${ItemId}`
      : `/product/${ItemId}`;
  };

  const addToWishlist = (product) => {
    const loveProduct = {
      name: product?.Title,
      ItemId: product?.ItemId,
      provider_type: product?.ProviderType,
      img: product?.MainPictureUrl,
      rating: null,
      sale_price: product?.ProductPrice,
      regular_price: product?.ProductPrice,
      stock: product?.MasterQuantity,
      total_sold: null,
    };
    mutateAsync(loveProduct, {
      onSuccess: (responseData) => {
        if (responseData?.status) {
          cache.setQueryData("wishlist", responseData?.wishlists || {});
        }
      },
    });
  };

  const existsInLove = (ItemId) => {
    return wishList?.find((Item) => Item.ItemId === ItemId);
  };

  return (
    <div className="checkout_grid">
      <div className="row">
        <div className="col-8">
          <AllCheck cart={cart} cartItems={cartItems} settings={settings} />
          <div className="removeBtn mx-3 text-center d-inline-block">
            {removeCart.isLoading ? (
              <div className="spinner-border spinner-border-sm " role="status">
                <span className="sr-only">Loading...</span>
              </div>
            ) : (
              <a
                href={"/remove"}
                onClick={(event) => removeItemFromCart(event)}
                className="cart-remove m-0"
                title="Remove"
              >
                Remove
              </a>
            )}
          </div>
        </div>
        <div className="col text-right font-weight-bold">Total</div>
      </div>
      <hr className="my-2" />
      {cartItems.map((product) => (
        <div className="cartItem" key={product.id}>
          {product?.variations?.map((variation) => (
            <div className="variation" key={variation.id}>
              <div className="row align-items-center">
                <div className="col-1">
                  <ItemCheck
                    product={product}
                    variation={variation}
                    settings={settings}
                  />
                </div>
                <div className="col-3 pr-0 pr-lg-0">
                  <AttributeImage
                    product={product}
                    productPageLink={productPageLink(product)}
                    attributes={variation?.attributes}
                  />
                </div>
                <div className="col-8">
                  {product?.ProviderType === "aliexpress" ? (
                    <AliExpressItemDescription
                      currency={currency}
                      productPageLink={productPageLink(product)}
                      product={product}
                      variation={variation}
                      isQuantity={true}
                    />
                  ) : (
                    <TaobaoItemDescription
                      currency={currency}
                      productPageLink={productPageLink(product)}
                      product={product}
                      variation={variation}
                      isQuantity={true}
                    />
                  )}
                </div>
              </div>
              <div className="cart-wishlist">
                {isLoading ? (
                  <button
                    type="button"
                    className="btn btn-loveProduct"
                    title="Add to wishlist"
                  >
                    <i className="icon-spin6"></i>
                  </button>
                ) : (
                  <div>
                    {existsInLove(product?.ItemId) ? (
                      <button
                        type="button"
                        className="btn btn-loveProduct active"
                        title="Already Added to wishlist"
                      >
                        <i className="icon-heart-5"></i>
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-loveProduct"
                        title="Add to wishlist"
                        onClick={() => addToWishlist(product)}
                      >
                        <i className="icon-heart-empty"></i>
                      </button>
                    )}
                  </div>
                )}
              </div>
              <hr className="my-2" />
            </div>
          ))}
          <CheckoutItemSimpleSummary product={product} currency={currency} />
        </div>
      ))}
    </div>
  );
};

export default CheckoutItem;
