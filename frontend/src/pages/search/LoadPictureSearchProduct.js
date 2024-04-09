import React, {useEffect} from "react";
import {useParams, useHistory} from "react-router-dom";
import {goPageTop} from "../../utils/Helpers";
import ProductListSkeleton from "../../skeleton/productSkeleton/ProductListSkeleton";
import My404Component from "../404/My404Component";
import PictureSearchProductList from "./includes/PictureSearchProductList";
import {useQuery} from "../../utils/customHooks";
import {usePictureSearch} from "../../api/ProductApi";
import {useSettings} from "../../api/GeneralApi";
import {analyticsPageView} from "../../utils/AnalyticsHelpers";


const LoadPictureSearchProduct = props => {
	const {search_id} = useParams();
	const history = useHistory();
	const {page} = useQuery();
	const currentPage = page ? page : 1;

	const limit = 35;
	const {data: products, isLoading} = usePictureSearch(search_id, currentPage);

	const {data: settings} = useSettings();
	const currencyIcon = settings?.currency_icon || '৳';

	const Content = products?.Content ? products.Content : [];
	const TotalCount = products?.TotalCount ? products.TotalCount : 1;
	const totalPage = Math.ceil(TotalCount / limit);

	useEffect(() => {
		goPageTop();
		analyticsPageView();
		if (Content?.length === 1) {
			let product = Content?.[0];
			const product_code = product?.product_code ? product?.product_code : product?.ItemId;
			if (product_code) {
				history.push(`/product/${product_code}`);
			}
		}
	}, [search_id, page, Content, history]);


	if (!isLoading && !Content?.length) {
		return <My404Component/>;
	}

	return (
		<main className="main">
			<div className="page-content">
				<div className="container">
					<div className="card my-5">
						<div className="card-body">
							{
								isLoading ?
									<ProductListSkeleton/>
									:
									<PictureSearchProductList
										search_id={search_id}
										Content={Content}
										TotalCount={TotalCount}
										currencyIcon={currencyIcon}
										currentPage={currentPage}
										totalPage={totalPage}
									/>
							}
						</div>
					</div>
				</div>
			</div>
		</main>
	);
};


export default LoadPictureSearchProduct;
