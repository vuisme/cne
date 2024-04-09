import React, { useState } from "react";
import { isValidPhoneNumber, parsePhoneNumber } from "react-phone-number-input";
import SpinnerButtonLoader from "../../../../loader/SpinnerButtonLoader";
import { useAuthMutation } from "../../../../api/Auth";
import PassWordLogin from "./includes/PassWordLogin";
import VerifyOtpCode from "./includes/VerifyOtpCode";
import Swal from "sweetalert2";
import { checkIsEmail } from "../../../../utils/Helpers";

const OtpLoginForm = (props) => {
  const [input, setInput] = useState("");
  const [isValidPhone, setIsValidPhone] = useState(true);
  const [response, setResponse] = useState({});

  const {
    checkExistsUser: { mutateAsync, isLoading },
  } = useAuthMutation({
    middleware: "guest",
    redirectIfAuthenticated: "/dashboard",
  });

  const formSubmitForOtpSubmit = (event) => {
    event.preventDefault();
    let phone = input.startsWith("+880") ? input : `+880${input}`;
    let isPhone = isValidPhoneNumber(phone);
    let isEmail = checkIsEmail(input);
    if (!isEmail && !isPhone) {
      Swal.fire({
        text: "Type your valid mobile or email",
        icon: "warning",
        buttons: "Dismiss",
      });
      setIsValidPhone(false);
      return false;
    }
    phone = isPhone ? parsePhoneNumber(phone)?.number : null;
    const email = isEmail ? input : null;
    mutateAsync({ phone, email }).then((response) => {
      setResponse(response);
    });
    return true;
  };

  if (response?.hasPassword === true) {
    return <PassWordLogin response={response} setResponse={setResponse} />;
  }

  if (response?.hasPassword === false) {
    return <VerifyOtpCode response={response} setResponse={setResponse} />;
  }

  return (
    <div>
      <h1 className="text-center mb-3 font-weight-bold">Sign-in / Sign-up</h1>
      <form onSubmit={(e) => formSubmitForOtpSubmit(e)}>
        <div className="form-group">
          <label htmlFor="phone">
            Mobile or Email
            <span className="text-danger"> * </span>
          </label>
          <div className="countryPhoneInput">
            <input
              name="phone"
              id="phone"
              className="form-control"
              placeholder="Mobile or Email"
              value={input}
              onChange={(event) => setInput(event.target.value)}
            />
          </div>
          {!isValidPhone && (
            <p className="small m-0 text-danger">
              Type your valid mobile or email{" "}
            </p>
          )}
        </div>

        <div className="form-group">
          {isLoading ? (
            <SpinnerButtonLoader />
          ) : (
            <button type="submit" className="btn py-2 btn-block btn-default">
              <span className="mr-1">Sign In / Sign Up</span>
              <i className="icon-long-arrow-right" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default OtpLoginForm;
