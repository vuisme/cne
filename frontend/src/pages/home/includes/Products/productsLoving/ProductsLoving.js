import React from 'react'
import ProductSectionSkeleton from "../../../../../skeleton/productSkeleton/ProductSectionSkeleton";
import RecentItems from "../recentProduct/includes/RecentItems";
import {useHome} from "../../../../../api/GeneralApi";
import {Link} from "react-router-dom";

const ProductsLoving = (props) => {

	const {lovingProducts: {data: products, isLoading}} = useHome();

	return (
		<div className="container deal-section">
			<div className="card my-5">
				<div className="card-body">
					<div className="row mb-3">
						<div className="col-7">
							<h3 className="title">More To Love</h3>
						</div>
						<div className="col-5 text-right">
							<Link to={`/customer-favorite`} className="btn btn-custom-product px-4">View All</Link>
						</div>
					</div>
					{isLoading && <ProductSectionSkeleton/>}
					{!isLoading && products?.length > 0 && <RecentItems sectionCart={true} products={products}/>}
				</div>
			</div>
		</div>
	)
}

export default ProductsLoving
