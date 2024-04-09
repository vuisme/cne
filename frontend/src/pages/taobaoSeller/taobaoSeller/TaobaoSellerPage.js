import React, { useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { goPageTop, taobaoSellerPositiveScore } from "../../../utils/Helpers";
import ProductListSkeleton from "../../../skeleton/productSkeleton/ProductListSkeleton";
import PagePaginator from "../../../pagination/PagePaginator";
import { useSettings } from "../../../api/GeneralApi";
import { useQuery } from "../../../utils/customHooks";
import ProductCart from "../../product/productList/ProductCart";
import { useTaobaoSellerProducts } from "../../../api/ProductApi";
import { analyticsPageView } from "../../../utils/AnalyticsHelpers";

const TaobaoSellerPage = (props) => {
  const history = useHistory();
  let { seller, rating, ItemScore, DeliveryScore, ServiceScore, page } =
    useQuery();
  const { seller_id } = useParams();
  const { data: settings } = useSettings();
  const { data, isLoading } = useTaobaoSellerProducts(seller_id, page);

  page = parseInt(page) ? parseInt(page) : 0;

  useEffect(() => {
    goPageTop();
    analyticsPageView();
  }, [page]);

  const handlePaginationClick = (data) => {
    let selectPage = data?.selected || 0;
    history.push(
      `/taobao/vendor/${seller_id}?seller=${seller}&rating=${rating}&page=${
        parseInt(selectPage) + 1
      }`
    );
  };

  if (isLoading) {
    return (
      <div className="container">
        <div className="card my-5">
          <div className="card-body">
            <ProductListSkeleton />
          </div>
        </div>
      </div>
    );
  }

  const currency = settings?.currency_icon || "৳";
  const Content = data?.Content || [];
  const TotalCount = data?.TotalCount || 0;
  const totalPage = Math.ceil(TotalCount / 35);

  return (
    <main className="main">
      <div className="container">
        <div className="card my-3 my-md-5">
          <div className="card-body">
            <div className="product_list_container">
              <div className="text-center seller_page_title">
                <h1 className="text-capitalize">
                  <i className="icon-shop-window" /> {seller}
                </h1>
                <p className="m-0">
                  Total Products : <strong>{TotalCount || 0}</strong>
                </p>
                {rating && (
                  <p className="m-0">
                    <strong>{taobaoSellerPositiveScore(rating)}%</strong>{" "}
                    Positive Feedback
                  </p>
                )}

                <div className="mx-auto" style={{ maxWidth: "300px" }}>
                  <div class="mb-2 d-flex justify-content-between align-items-center">
                    <span>
                      <i className="icon-shopping-bag"></i> Product
                    </span>
                    <span class="badge badge-primary badge-pill">
                      {ItemScore || 0}
                    </span>
                  </div>
                  <div class="mb-2 d-flex justify-content-between align-items-center">
                    <span>
                      <i className="icon-ok-circled"></i> Shipping
                    </span>
                    <span class="badge badge-primary badge-pill">
                      {DeliveryScore || 0}
                    </span>
                  </div>
                  <div class="mb-2 d-flex justify-content-between align-items-center">
                    <span>
                      <i className="icon-arrows-ccw"></i> Support
                    </span>
                    <span class="badge badge-primary badge-pill">
                      {ServiceScore || 0}
                    </span>
                  </div>
                </div>
              </div>

              <hr className="my-3" />

              <div className="products mb-3">
                <div
                  className={`row justify-content-center row-cols-2 row-cols-sm-3 row-cols-md-3 row-cols-lg-4 row-cols-xl-5`}
                >
                  {Content?.length > 0 &&
                    Content.map((product, key) => (
                      <ProductCart
                        key={key}
                        product={product}
                        currencyIcon={currency}
                        productClass="col"
                      />
                    ))}
                </div>
              </div>

              <PagePaginator
                handlePaginationClick={handlePaginationClick}
                currentPage={page}
                totalPage={totalPage || 0}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default TaobaoSellerPage;
