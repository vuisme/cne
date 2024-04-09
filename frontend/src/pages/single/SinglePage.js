import React, {useEffect} from "react";
import {useParams} from "react-router-dom";
import {goPageTop} from "../../utils/Helpers";
import parser from "html-react-parser";
import My404Component from "../404/My404Component";
import PageSkeleton from "../../skeleton/PageSkeleton";
import {usePageData} from "../../api/GeneralApi";
import Helmet from "react-helmet";
import {analyticsPageView} from "../../utils/AnalyticsHelpers";

const SinglePage = (props) => {
	const {slug} = useParams();

	const {data: page, isLoading} = usePageData(slug);

	useEffect(() => {
		goPageTop();
		analyticsPageView();
	}, [slug]);

	if (isLoading) {
		return <PageSkeleton/>;
	}

	if (!page?.post_title) {
		return <My404Component/>;
	}

	return (
		<main className="main">
			<Helmet>
				<title>{page?.post_title}</title>
			</Helmet>

			<div className="container">
				<div className="card my-5">
					<div className="card-body">
						<h2 className="title">
							{page?.post_title && parser(page.post_title)}
						</h2>
						<div className="mb-3">
							{page?.post_content && parser(page.post_content)}
						</div>
					</div>
				</div>
			</div>
		</main>
	);
};

export default SinglePage;
