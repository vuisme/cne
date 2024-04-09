import React from "react";
import ReactPaginate from "react-paginate";
import ProductCart from "../../product/productList/ProductCart";
import {withRouter, useHistory} from "react-router-dom";
import {useSettings} from "../../../api/GeneralApi";
import PagePaginator from "../../../pagination/PagePaginator";

const SearchProductList = (props) => {
	const history = useHistory();

	const {keyword, currentPage, totalPage, Content, TotalCount} = props;

	const {data: settings} = useSettings();
	const currencyIcon = settings?.currency_icon || '৳';

	const handlePaginationClick = (data) => {
		let selectPage = data?.selected || 0;
		if (parseInt(selectPage) > 0) {
			history.push(`/search?keyword=${keyword}&page=${parseInt(selectPage) + 1}`);
		}
	};

	return (
		<div className="product_list_container">
			<div className="mb-3">
				<h2>Total found <span>{TotalCount}</span> Products</h2>
			</div>

			<div className="products mb-3">
				<div
					className={`row justify-content-center row-cols-2 row-cols-sm-3 row-cols-md-3 row-cols-lg-4 row-cols-xl-5`}>
					{Content?.length > 0 &&
					Content.map((product, key) => (
						<ProductCart key={key} product={product} currencyIcon={currencyIcon} productClass="col"/>
					))}
				</div>
			</div>

			<PagePaginator
				handlePaginationClick={handlePaginationClick}
				currentPage={currentPage}
				totalPage={totalPage}/>

		</div>
	);
};


export default withRouter(SearchProductList);
