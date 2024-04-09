import React, {useEffect} from 'react';
import {useParams, useHistory} from "react-router-dom";
import {goPageTop} from "../../../utils/Helpers";
import {useAliSellerProducts} from "../../../api/AliExpressProductApi";
import ProductListSkeleton from "../../../skeleton/productSkeleton/ProductListSkeleton";
import PagePaginator from "../../../pagination/PagePaginator";
import AliProductCard from "../card/AliProductCard";
import {useSettings} from "../../../api/GeneralApi";
import {useQuery} from "../../../utils/customHooks";
import {analyticsPageView} from "../../../utils/AnalyticsHelpers";

const AliSellerPage = (props) => {
	const history = useHistory();
	const {seller, rating} = useQuery();
	const {seller_id} = useParams();
	const {data: settings} = useSettings();
	const {data, isLoading} = useAliSellerProducts(seller_id, 1);

	useEffect(() => {
		goPageTop();
		analyticsPageView();
	}, []);

	const handlePaginationClick = (data) => {
		let selectPage = data?.selected || 0;
		if (parseInt(selectPage) > 0) {
			history.push(`/aliexpress/seller/${seller_id}&page=${parseInt(selectPage) + 1}`);
		}
	};

	if (isLoading) {
		return (
			<div className="container">
				<div className="card my-5">
					<div className="card-body">
						<ProductListSkeleton/>
					</div>
				</div>
			</div>
		)
	}

	const currency = settings?.currency_icon || '৳';
	const aliRate = settings?.ali_increase_rate || 90;
	const item = data?.item || [];
	const base = data?.base || {};

	return (
		<main className="main">
			<div className="container">
				<div className="card my-3 my-md-5">
					<div className="card-body">
						<div className="product_list_container">

							<div className="text-center seller_page_title">
								<h1 className="text-capitalize"><i className="icon-shop-window"/> {seller}</h1>
								<p className="m-0">Total Products : <strong>{base?.total_results || 0}</strong></p>
								{
									rating && <p className="m-0"><strong>{rating}%</strong> Customer satisfaction</p>
								}
							</div>

							<hr className="my-3"/>

							<div className="products mb-3">
								<div
									className={`row justify-content-center row-cols-2 row-cols-sm-3 row-cols-md-3 row-cols-lg-4 row-cols-xl-5`}>
									{item?.length > 0 &&
									item.map((product, key) => (
										<AliProductCard
											key={key}
											product={product}
											currency={currency}
											aliRate={aliRate}
											productClass="col"/>
									))}
								</div>
							</div>

							<PagePaginator
								handlePaginationClick={handlePaginationClick}
								currentPage={base?.page}
								totalPage={base?.total_page}/>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
};

export default AliSellerPage;