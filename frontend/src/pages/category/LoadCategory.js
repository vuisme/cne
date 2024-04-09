import React, {useEffect} from "react";
import {useParams} from "react-router-dom";
import CategorySidebar from "./includes/CategorySidebar";
import {goPageTop} from "../../utils/Helpers";
import SubCategory from "./includes/SubCategory";
import {useAllCategories} from "../../api/GeneralApi";
import My404Component from "../404/My404Component";
import {analyticsPageView} from "../../utils/AnalyticsHelpers";

const LoadCategory = (props) => {

	let {category_slug} = useParams();
	const {data: categories, isLoading} = useAllCategories();

	useEffect(() => {
		goPageTop();
		analyticsPageView();
	}, [category_slug]);

	if (isLoading) {
		return '';
	}
	const category = categories?.find(find => find.slug === category_slug) || {};
	const allChildren = categories?.filter(filter => filter.ParentId === category.otc_id) || [];
	const siblings = categories?.filter(filter => filter.ParentId === category.ParentId) || [];

	if (!category?.id) {
		return <My404Component/>;
	}

	return (
		<main className="main">

			<div className="page-content">
				<div className="container">
					<div className="row">
						<div className="col-lg-9 col-xl-4-5 col">
							<div className="card my-5">
								<div className="card-body">
									<div className="mb-3">
										<h2>{category?.name || ""}</h2>
									</div>

									<div className="cat-blocks-container">
										<div className="row">
											{allChildren?.length > 0 && allChildren?.map(subChild => (
												<SubCategory
													key={subChild.id}
													parent={category}
													child={subChild}
												/>
											))}
										</div>
										{/* End .row */}
									</div>

								</div>
							</div>
						</div>
						{/* End .col-lg-9 */}
						<aside className="col-lg-3 d-none d-lg-block order-lg-first">
							<div className="card my-5">
								<div className="card-body">
									<CategorySidebar siblings={siblings}/>
								</div>
							</div>
						</aside>
						{/* End .col-lg-3 */}
					</div>

					{/* End .row */}
				</div>
				{/* End .container */}
			</div>
			{/* End .page-content */}
		</main>
	);
};


export default LoadCategory;
