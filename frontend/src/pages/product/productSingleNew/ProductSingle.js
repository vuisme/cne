import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import ProductBody from "./productBody/ProductBody";
import ProductDetailsTab from "./includes/ProductDetailsTab";
import RelatedProduct from "../reletedProduct/RelatedProduct";
import { goPageTop } from "../../../utils/Helpers";
import ProductDetailsSkeleton from "../../../skeleton/productSkeleton/ProductDetailsSkeleton";
import { useMediaQuery } from "react-responsive";
import { useTabobaoProduct } from "../../../api/ProductApi";
import RecentViewProduct from "../reletedProduct/RecentViewProduct";
import { useSettings } from "../../../api/GeneralApi";
import TaobaoProduct404 from "../../404/TaobaoProduct404";
import { analyticsPageView } from "../../../utils/AnalyticsHelpers";

const ProductSingle = (props) => {
  const { item_id } = useParams();

  const { data: settings } = useSettings();
  const { data: product, isLoading } = useTabobaoProduct(item_id);

  const cardRef = useRef(null);
  const currencyIcon = settings?.currency_icon || "৳";
  const isMobile = useMediaQuery({ query: "(max-width: 991px)" });

  const cartConfigured = {};

  useEffect(() => {
    goPageTop();
    analyticsPageView();
  }, [item_id]);

  if (isLoading) {
    return <ProductDetailsSkeleton />;
  }

  if (!product?.Id) {
    return <TaobaoProduct404 />;
  }

  return (
    <>
      <div className="main">
        <div className="bg-gray main mt-4">
          <div className="container">
            <div className="row" ref={cardRef}>
              <div className="col-lg-9 col-md-12">
                <ProductBody
                  settings={settings}
                  product={product}
                  cartConfigured={cartConfigured}
                />

                <div className="card mb-3 mb-lg-4">
                  <div className="card-body">
                    <ProductDetailsTab product={product} />
                  </div>
                </div>
              </div>
              {!isMobile && (
                <div className="col-lg-3 d-none d-lg-block">
                  <RelatedProduct item_id={item_id} cardRef={cardRef} />
                </div>
              )}
            </div>

            {isMobile && (
              <div className="card mb-3">
                <div className="card-body">
                  <h4>Related Products</h4>
                  <RelatedProduct item_id={item_id} />
                </div>
              </div>
            )}

            <div className="card mb-3">
              <div className="card-body">
                <h3>Recent View</h3>
                <RecentViewProduct currencyIcon={currencyIcon} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductSingle;
