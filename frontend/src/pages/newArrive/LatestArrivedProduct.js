import React, {useEffect} from "react";
import {goPageTop} from "../../utils/Helpers";
import {useNewArrivedProducts} from "../../api/ProductApi";
import RecentItems from "../home/includes/Products/NewArriveProduct/includes/RecentItems";
import {analyticsPageView} from "../../utils/AnalyticsHelpers";
import {useHistory} from "react-router-dom";
import {useQuery} from "../../utils/customHooks";
import ProductListSkeleton from "../../skeleton/productSkeleton/ProductListSkeleton";
import Default404 from "../404/Default404";
import PagePaginator from "../../pagination/PagePaginator";

const LatestArrivedProduct = (props) => {
	const history = useHistory();
	const {page} = useQuery();
	const currentPage = page ? page : 1;

	const {data, isLoading} = useNewArrivedProducts(currentPage);

	useEffect(() => {
		goPageTop();
		analyticsPageView();
	}, [page]);

	if (isLoading) {
		return (
			<main className="main bg-gray">
				<div className="page-content">
					<ProductListSkeleton/>
				</div>
			</main>
		);
	}

	const handlePaginationClick = (paginate) => {
		history.push(`/new-arrived?page=${paginate.selected + 1}`);
	};

	const products = data?.products ? JSON.parse(data?.products) : [];
	const totalPage = data?.totalPage ? data?.totalPage : 0;

	if (!products?.length) {
		return <Default404/>;
	}

	return (
		<main className="main">

			<div className="page-content">
				<div className="container">
					<div className="row">
						<div className="col-lg-12">
							<div className="card my-5">
								<div className="card-body">
									<div className="mb-3">
										<h2>New Arrived Products</h2>
									</div>
									<div className="cat-blocks-container">
										<RecentItems products={products}/>
									</div>

									{
										totalPage > 1 &&
										<div className="mt-3">
											<PagePaginator
												handlePaginationClick={handlePaginationClick}
												currentPage={currentPage}
												totalPage={(totalPage)}/>
										</div>
									}

								</div>
							</div>
						</div>
					</div>

				</div>
			</div>
		</main>
	);
};


export default LatestArrivedProduct;
