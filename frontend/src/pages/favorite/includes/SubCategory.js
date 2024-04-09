import React from 'react';
import PropTypes from 'prop-types';
import {Link} from "react-router-dom";
import {loadCatImg} from "../../../utils/Helpers";

const SubCategory = (props) => {
	const {parent, child} = props;

	let picture = child?.picture ? `/${picture}` : null;
	let ImageUrl = child?.IconImageUrl || null;
	ImageUrl = picture ? picture : ImageUrl;
	ImageUrl = ImageUrl ? ImageUrl : '/assets/img/backend/no-image-300x300.png';


	return (
		<div className="col-6 col-md-4 col-lg-3">
			<Link to={`/shop/${child.slug}`} className="cat-block">
				<figure>
               <span>
                  <img src={ImageUrl} alt={child.name}/>
               </span>
				</figure>
				<h3 className="cat-block-title">{child.name}</h3>
			</Link>
		</div>
	);
};

SubCategory.propTypes = {
	parent: PropTypes.object.isRequired,
	child: PropTypes.object.isRequired,
};

export default SubCategory;