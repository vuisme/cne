import React from 'react';
import PropTypes from 'prop-types';

const SmallSpinnerButtonLoader = props => {
	const buttonClass = props?.buttonClass;
	const textClass = props?.textClass;

	return (
		<button type="button" className={`btn ${buttonClass ? buttonClass : 'btn-block btn-primary'} disabled`}>
			<i className={`fa fa-spinner ${textClass ? textClass : 'text-secondary'}`} aria-hidden="true"/>
		</button>
	);
};

SmallSpinnerButtonLoader.propTypes = {
	buttonClass: PropTypes.string,
	textClass: PropTypes.string,
};

export default SmallSpinnerButtonLoader;