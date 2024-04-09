import React from "react";
import {withRouter} from "react-router-dom";
import {isEmpty} from "lodash";
import ProductCart from "./ProductCart";
import ProductListSkeleton from "../../../skeleton/productSkeleton/ProductListSkeleton";
import My404Component from "../../404/My404Component";
import {useCategoryProducts} from "../../../api/ProductApi";
import PagePaginator from "../../../pagination/PagePaginator";

const CategoryProductList = (props) => {
	const {slugKey, category, pageName, currentPage, history} = props;

	const currencyIcon = '৳';

	const limit = 24;
	const offset = currentPage ? Math.ceil(currentPage * limit) : 0;

	const {data: products, isLoading} = useCategoryProducts(slugKey, currentPage);


	const Content = products?.Content ? products.Content : [];
	const TotalCount = products?.TotalCount ? products.TotalCount : 0;

	if (isLoading) {
		return (
			<main className="main bg-gray">
				<div className="page-content">
					<ProductListSkeleton/>
				</div>
			</main>
		);
	}

	if (!Content?.length) {
		return <My404Component/>;
	}

	const totalPage = Math.ceil(TotalCount / limit);


	const handlePaginationClick = (data) => {
		if (pageName === "search") {
			history.push(`/search/${slugKey}?page=${data.selected + 1}`);
		} else if (pageName === "pictureSearch") {
			history.push(
				`/search/picture/${slugKey}?page=${data.selected + 1}`
			);
		} else {
			history.push(`/shop/${slugKey}?page=${data.selected + 1}`);
		}
	};

	return (
		<div className="product_list_container">
			<h3>{category ? category.name : ''} - <span className="mx-2 font-weight-bold">{TotalCount}</span> Products found</h3>
			<hr className="mb-1 mt-0"/>

			<div className="products mb-3">
				<div
					className={`row justify-content-center row-cols-2 row-cols-md-4 row-cols-lg-4`}>
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


export default withRouter(CategoryProductList);
