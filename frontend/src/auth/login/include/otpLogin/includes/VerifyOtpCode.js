import React, { useState } from "react";
import SpinnerButtonLoader from "../../../../../loader/SpinnerButtonLoader";
import { useAuthMutation } from "../../../../../api/Auth";
import { useHistory } from "react-router-dom";

const VerifyOtpCode = (props) => {
  const { response, setResponse } = props;
  const history = useHistory();
  const phone = response?.data?.phone;
  const email = response?.data?.email;
  const [otp, setOtp] = useState("");

  const {
    registerSubmit: { mutateAsync, isLoading },
  } = useAuthMutation();

  const registerCustomer = (e) => {
    e.preventDefault();
    mutateAsync({ phone, otp, email }).then((response) => {
      if (response?.id) {
        history.push("/dashboard");
      }
    });
  };

  const backToLoginForm = (event) => {
    event.preventDefault();
    setResponse({});
  };

  return (
    <div>
      <h1 className="text-center font-weight-bold">Verify OTP</h1>
      <p className="text-center">
        We just sent you a SMS with an OTP code on your{" "}
        <strong>{phone || email}</strong> as a login account, Please enter the
        4-digit OTP code below.
      </p>
      <form onSubmit={(e) => registerCustomer(e)}>
        <div className="form-group">
          <label htmlFor="otp_code">
            {" "}
            OTP <span className="text-danger"> * </span>{" "}
          </label>
          <input
            type="text"
            className="form-control text-center"
            id="otp_code"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            minLength={4}
            maxLength={4}
            size="4"
            autoComplete="off"
            placeholder="----"
            required={true}
          />
          <p className="m-0">We just sent you a SMS with an OTP.</p>
        </div>

        <div className="border-0 form-footer m-0 p-0">
          {isLoading ? (
            <SpinnerButtonLoader />
          ) : (
            <button type="submit" className={`btn py-2 btn-block btn-default`}>
              Verify
            </button>
          )}
          <a
            href={`/login`}
            onClick={(event) => backToLoginForm(event)}
            className="d-block login_link my-3 text-center"
          >
            Back to login
          </a>
        </div>
      </form>
    </div>
  );
};

export default VerifyOtpCode;
