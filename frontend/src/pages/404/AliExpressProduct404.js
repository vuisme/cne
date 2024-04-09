import React from 'react';
import { Link } from "react-router-dom";
import AliSearchForm from "../home/includes/searchBar/includes/AliSearchForm";
import useResponsive from '../../utils/responsive';

import ErrorImage from './../../assets/img/404.jpg';

const AliExpressProduct404 = () => {

	const isMobile = useResponsive();

	return (
		<main className="main">
			<div className="container">
				<div className="card mt-2 my-lg-5">
					<div className="card-body">
						<div className="error-content text-center">
							<img src={ErrorImage} className="img-fluid mx-auto" alt="404" style={{ maxWidth: isMobile ? '10rem' : '12rem' }} />
							<h3 className="error-title">Product not found. </h3>
							<p>We are sorry! The product you are search is not available.</p>

							{/* <div className="controlAliSearchForm">
								<AliSearchForm />
							</div> */}

							<div className="pb-5 my-5">
								<Link
									to={'/'}
									className="btn btn-default px-3"
								>
									<span>Shop More</span>
									<i className="icon-right" />
								</Link>
							</div>

						</div>
					</div>
				</div>
			</div>

		</main>
	);
};

export default AliExpressProduct404;
