import React from 'react'
import SocialButton from './SocialButton';

const SocialLogin = () => {

  const handleSocialLogin = user => {
    props.customerSocialLogin(user, props.history);
  };

  const handleSocialLoginFailure = err => {
    console.error(err);
  };

  return (
    <div className="form-choice">
      <SocialButton
        provider="google"
        appId="661276138407-252qctok1c1it53u0gu3vroojbouhtl7.apps.googleusercontent.com"
        onLoginSuccess={handleSocialLogin}
        onLoginFailure={handleSocialLoginFailure}
      >
        <span className="btn-g">
          <i className="icon-google" />
        </span>
        Login with Google
      </SocialButton>
      <SocialButton
        provider="facebook"
        appId="251983028680610"
        onLoginSuccess={handleSocialLogin}
        onLoginFailure={
          handleSocialLoginFailure
        }
      >
        <span className="btn-f">
          <i className="icon-facebook-f" />
        </span>
        Login with Facebook
      </SocialButton>
    </div>
  )
}

export default SocialLogin