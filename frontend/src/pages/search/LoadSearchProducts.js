import React, {useEffect} from "react";
import {useHistory} from "react-router-dom";
import ProductListSkeleton from "../../skeleton/productSkeleton/ProductListSkeleton";
import {goPageTop} from "../../utils/Helpers";
import SearchProductList from "./includes/SearchProductList";
import My404Component from "../404/My404Component";
import {useQuery} from "../../utils/customHooks";
import {useSearchKeyword} from "../../api/ProductApi";
import SearchBlock from "./includes/SearchBlock";
import {analyticsPageView} from "../../utils/AnalyticsHelpers";


const LoadSearchProducts = (props) => {
	const history = useHistory();
	const {keyword, page} = useQuery();
	const currentPage = page ? page : 0;

	const limit = 35;
	const {data: products, isLoading} = useSearchKeyword(keyword, currentPage);

	const Content = products?.Content || [];
	const TotalCount = products?.TotalCount || 0;
	const searchBlock = products?.block || false;
	const totalPage = Math.ceil(TotalCount / limit);

	useEffect(() => {
		goPageTop();
		analyticsPageView();
		if (TotalCount === 1) {
			let product = Content?.[0];
			const product_code = product?.product_code ? product?.product_code : product?.ItemId;
			if(product_code){
				history.push(`/product/${product_code}`);
			}
		}
	}, [keyword, currentPage, Content]);


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

	if (searchBlock === true) {
		return <SearchBlock/>;
	}

	if (!TotalCount) {
		return <My404Component/>;
	}

	return (
		<main className="main">
			<div className="page-content">
				<div className="container">
					<div className="card my-5">
						<div className="card-body">
							<SearchProductList
								keyword={keyword}
								Content={Content}
								TotalCount={TotalCount}
								currentPage={currentPage}
								totalPage={totalPage}
							/>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
};


export default LoadSearchProducts;
