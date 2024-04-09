import React, {useEffect} from "react";
import parser from "html-react-parser";
import {goPageTop} from "../../utils/Helpers";
import PageSkeleton from "../../skeleton/PageSkeleton";
import My404Component from "../404/My404Component";
import {useCustomPageData} from "../../api/GeneralApi";
import {analyticsPageView} from "../../utils/AnalyticsHelpers";

const Faq = () => {

	const {data: faqs, isLoading} = useCustomPageData('faqs', 'faqs');

	useEffect(() => {
		goPageTop();
		analyticsPageView();
	},[]);

	if (isLoading) {
		return <PageSkeleton/>;
	}

	if (!faqs?.length) {
		return <My404Component/>;
	}

	return (
		<main className="main">
			<div className="container">
				<div className="card my-3 my-md-4">
					<div className="card-body">
						<div className="accordion" id="accordionFAQ">
							{
								faqs?.map((faq, key) =>
									<div className="card faq_card"  key={key}>
										<div className="card-header justify-content-between align-items-center" id={`heading_${faq.id}`}>
											<h2 className="mb-0 faq_title">
												<button className={`btn btn-link btn-block text-left ${key > 0 ? 'collapsed' : ''}`} type="button" data-toggle="collapse"
														  data-target={`#collapse_${faq.id}`} aria-expanded="true" aria-controls={`collapse_${faq.id}`}>
													{parser(faq.post_title)}
												</button>
											</h2>
										</div>
										<div id={`collapse_${faq.id}`} className={key === 0 ? 'collapse show' : 'collapse'} aria-labelledby={`heading_${faq.id}`} data-parent="#accordionFAQ">
											<div className="card-body">
												{parser(faq.post_content)}
											</div>
										</div>
									</div>
								)
							}
						</div>
					</div>
				</div>
			</div>


		</main>
	);
};

export default Faq;
