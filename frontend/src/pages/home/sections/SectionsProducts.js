import React from "react";
import { Link } from "react-router-dom";
import { loadAsset } from "../../../utils/Helpers";
import ProductSectionSkeleton from "../../../skeleton/productSkeleton/ProductSectionSkeleton";
import RecentItems from "../includes/Products/recentProduct/includes/RecentItems";
import { useSectionProducts } from "../../../api/ProductApi";

const SectionsProducts = (props) => {
	const { settings, section } = props;

	const { data: products, isLoading } = useSectionProducts(section);

	const title = settings?.[`${section}_title`] || '';
	const image = settings?.[`${section}_title_image`] || '';
	const visible_title = settings?.[`${section}_visible_title`] || '';
	const query_url = settings?.[`${section}_query_url`] || '';
	const query_type = settings?.[`${section}_query_type`] || '';


	if (isLoading) {
		return (
			<div className="container deal-section">
				<div className="card my-5">
					<div className="card-body">
						<ProductSectionSkeleton />
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className="container deal-section">
			<div className="card my-5">
				<div className="card-body">
					<div className="row mb-3">
						<div className="col-6">
							<h3 className="title ">
								{visible_title === "image" ? (
									<img src={loadAsset(image)} />
								) : (
									title
								)}
							</h3>
						</div>
						<div className="col-6 text-right">
							{query_type === "search_query" ?
								<Link to={`/search?keyword=${query_url}`} className="btn btn-custom-product px-4">View All</Link>
								:
								<Link to={`/shop${query_url}`} className="btn btn-custom-product px-4"> View All </Link>
							}
						</div>
					</div>
					{products?.length > 0 && <RecentItems products={products} settings={settings} />}
				</div>
			</div>
		</div>
	);
};


export default SectionsProducts;
