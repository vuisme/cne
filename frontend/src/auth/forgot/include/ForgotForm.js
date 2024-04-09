import React, { useState } from "react";
import { isValidPhoneNumber, parsePhoneNumber } from "react-phone-number-input";
import SpinnerButtonLoader from "../../../loader/SpinnerButtonLoader";
import { useAuthMutation } from "../../../api/Auth";
import ResetForm from "./ResetForm";
import { checkIsEmail } from "../../../utils/Helpers";
import Swal from "sweetalert2";

const ForgotForm = (props) => {
  const [input, setInput] = useState("");
  const [isValidPhone, setIsValidPhone] = useState(true);
  const [response, setResponse] = useState({});

  const { forgotRequest: forgot } = useAuthMutation();

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

    forgot.mutateAsync({ phone, email }).then((res) => {
      if (res.status === true) {
        setResponse(res);
      } else {
        Swal.fire({
          text: res.message,
          icon: "error",
          buttons: "Dismiss",
        });
      }
    });
  };

  const handleValidPhone = () => {
    setIsValidPhone(isValidPhoneNumber(input));
  };

  if (response?.forgot === true) {
    return <ResetForm response={response} setResponse={setResponse} />;
  }

  return (
    <div>
      <h1 className="text-center font-weight-bold">Forgot Password</h1>
      <form onSubmit={(e) => formSubmitForOtpSubmit(e)}>
        <div className="form-group">
          <label htmlFor="phone">
            {" "}
            Phone Number
            <span className="text-danger"> * </span>
          </label>
          <div className="countryPhoneInput">
            <span
              className="country_logo"
              style={{ backgroundImage: "url('/img/bangladesh.svg')" }}
            />
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
              Type your valid phone number{" "}
            </p>
          )}
        </div>

        <div className="form-group">
          {forgot.isLoading ? (
            <SpinnerButtonLoader
              buttonClass={"btn-block btn-default"}
              textClass={"text-white"}
            />
          ) : (
            <button type="submit" className="btn py-2 btn-block btn-default">
              <span className="mr-1">Request for OTP</span>
              <i className="icon-long-arrow-right" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ForgotForm;
