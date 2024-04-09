import React from "react";

const MediumSpinner = props => {
	const {buttonClass, textClass} = props;

	return (
		<div className="text-center py-3">
			<div className={`spinner-border ${buttonClass && buttonClass}`} role="status">
				<span className={`sr-only ${textClass && textClass}`}>Loading...</span>
			</div>
		</div>
	);
};


export default MediumSpinner;