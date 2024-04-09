import React from 'react'
import {Link} from 'react-router-dom'
import PropTypes from "prop-types";

const Breadcrumb = (props) => {
	const {current, collections} = props;

	return (
		<nav aria-label="breadcrumb" className="breadcrumb-nav bg-white mb-2">
			<div className="container d-flex align-items-center">
				<ol className="bg-transparent breadcrumb mb-0">
					<li className="breadcrumb-item">
						<Link to="/">Home</Link>
					</li>
					{
						collections?.map((item, key) =>
							<li key={key} className="breadcrumb-item">
								{
									item.url ?
										<Link to={`/${item.url}`}>{item.name && item.name}</Link>
										:
										<span>{item.name && item.name}</span>
								}
							</li>
						)
					}
					<li className="breadcrumb-item active" aria-current="page">
						{current.substring(0, 40)}
					</li>
				</ol>

			</div>
		</nav>
	)
}

Breadcrumb.propTypes = {
	current: PropTypes.string.isRequired,
	collections: PropTypes.array
};

export default Breadcrumb
