import React from 'react'
import ProductSectionSkeleton from "../../../../../skeleton/productSkeleton/ProductSectionSkeleton";
import RecentItems from "./includes/RecentItems";
import {useRecentViewProducts} from "../../../../../api/ProductApi";
import {Link} from "react-router-dom";

const RecentProduct = (props) => {

	const {data, isLoading} = useRecentViewProducts();

	if (isLoading) {
		return (
			<div className="container deal-section">
				<div className="card my-4 my-lg-5">
					<div className="card-body">
						<ProductSectionSkeleton/>
					</div>
				</div>
			</div>
		)
	}

	const products = data?.products ? JSON.parse(data?.products) : [];

	if (!products?.length) {
		return '';
	}

	return (
		<div className="container deal-section">
			<div className="card my-4 my-lg-5">
				<div className="card-body">
					<div className="row mb-3">
						<div className="col-7">
							<h3 className="title">Recently Viewed </h3>
						</div>
						<div className="col-5 text-right">
							<Link to={`/recent-view`} className="btn btn-custom-product px-4">View All</Link>
						</div>
					</div>

					{isLoading && <ProductSectionSkeleton/>}
					{!isLoading && products.length > 0 && <RecentItems products={products}/>}

				</div>
			</div>
		</div>
	)
};


export default RecentProduct;



