import React, {useEffect} from "react";
import WishlistPage from "./wishlistPage/WishlistPage";
import {goPageTop} from "../../utils/Helpers";
import PageSkeleton from "../../skeleton/PageSkeleton";
import Breadcrumb from "../breadcrumb/Breadcrumb";
import {useWishList} from "../../api/WishListApi";
import {analyticsPageView} from "../../utils/AnalyticsHelpers";

const Wishlist = () => {
	const {data: wishLists, isLoading} = useWishList();

	useEffect(() => {
		goPageTop();
		analyticsPageView();
	}, []);

	if (isLoading) {
		return <PageSkeleton/>;
	}


	return (
		<main className="main">
			<div className="page-content">
				<Breadcrumb
					current={'Wishlist'}
					collections={[
						{name: 'Dashboard', url: 'dashboard'}
					]}/>
				<div className="container">
					<div className="row">
						<div className="col-md-12">
							<div className="card my-3">
								<div className="card-body">
									<h2 className="card-title">My Wishlist</h2>

									<div className="row align-items-center">
										<div className="col-md-2 text-center  d-none d-md-block">SL</div>
										<div className="col-9 col-md-8">Product</div>
										<div className="col-3 col-md-2 text-right">Option</div>
									</div>
									<hr className="my-2"/>
									{
										wishLists?.length > 0 ? (
												wishLists.map((wishList, index) => <WishlistPage key={index} indexItem={index} wishList={wishList}/>)
											) :
											<div className="row">
												<div className="col-12 text-center">There is no Items</div>
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


export default Wishlist;
