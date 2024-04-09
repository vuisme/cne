import React from 'react';
import {Link} from "react-router-dom";

function SearchBlock(props) {


	return (
		<main className="main">
			<div className="container">
				<div className="card my-5 py-3">
					<div className="card-body">
						<div className="error-content text-center">
							<img src={`/assets/img/restricted.jpg`} className="img-fluid mx-auto" alt="404"  style={{maxWidth:'15rem'}}/>
							<h1 className="error-title">Search word Blocked.</h1>
							<p>We are sorry, Your search words are blocked, Prohibited Items Detected!, search another words.</p>
							<Link
								to={'/'}
								className="btn btn-default px-3"
							>
								<span>Shop More</span>
								<i className="icon-right"/>
							</Link>
						</div>
					</div>
				</div>
			</div>

		</main>
	);
}

export default SearchBlock;