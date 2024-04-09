import React from 'react';
import PropTypes from 'prop-types';

const SpinnerButtonLoader = props => {
  const buttonClass = props?.buttonClass;
  const textClass = props?.textClass;

  return (
    <button type="button" className={`btn ${buttonClass ? buttonClass : 'btn-block btn-default'} disabled`}>
      <span className={`spinner-border spinner-border-sm ${textClass ? textClass : 'text-white'}`} />
    </button>
  );
};

SpinnerButtonLoader.propTypes = {
  buttonClass: PropTypes.string,
  textClass: PropTypes.string,
};

export default SpinnerButtonLoader;