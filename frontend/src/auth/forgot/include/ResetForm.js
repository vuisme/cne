import React, { useState } from "react";
import { useAuthMutation } from "../../../api/Auth";
import SpinnerButtonLoader from "../../../loader/SpinnerButtonLoader";
import Swal from "sweetalert2";
import { withRouter } from "react-router-dom";

const ResetForm = (props) => {
  const { response, setResponse } = props;
  const phone = response?.data?.phone;
  const email = response?.data?.email;

  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState([]);

  const { resetRequest: reset } = useAuthMutation();

  const resetCustomerPassword = (event) => {
    event.preventDefault();
    reset
      .mutateAsync({
        email,
        phone,
        otp,
        password,
        password_confirmation: password,
      })
      .then((res) => {
        if (res?.login === true) {
          props.history.push("/login");
          Swal.fire({
            text: res.message,
            icon: "success",
            buttons: "Dismiss",
          });
        } else {
          let err = res.errors;
          const otpError = err?.otp_code ? err.otp_code[0] : null;
          if (otpError) {
            Swal.fire({
              text: res.message,
              icon: "error",
              buttons: "Dismiss",
            });
          }
          setErrors(err);
        }
      });
  };

  const passwordError = errors?.password ? errors.password[0] : null;
  const otpError = errors?.otp_code ? errors.otp_code[0] : null;

  return (
    <div>
      <h1 className="text-center font-weight-bold">Reset Password</h1>

      <form
        onSubmit={(event) => resetCustomerPassword(event)}
        autoComplete="off"
      >
        <div className="form-group">
          <label htmlFor="otp_code">
            {" "}
            OTP <span className="text-danger"> * </span>{" "}
          </label>
          <input
            type="text"
            className="form-control"
            id="otp_code"
            value={otp || ""}
            onChange={(e) => setOtp(e.target.value)}
            minLength={4}
            maxLength={4}
            size="4"
            placeholder="OTP"
            required={true}
            autoComplete="off"
          />
          {otpError ? (
            <p className="small m-0 text-danger">{otpError}</p>
          ) : (
            <p className="small m-0">
              We just sent you a SMS and email with an OTP.
            </p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="password">
            {" "}
            Password <span className="text-danger"> * </span>
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="off"
            placeholder="Password"
            required={true}
          />
          {passwordError && (
            <p className="small m-0 text-danger">{passwordError}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="password_confirmation">
            {" "}
            Confirm Password <span className="text-danger"> * </span>
          </label>
          <input
            type="password"
            className="form-control"
            id="password_confirmation"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="off"
            placeholder="Confirm Password"
            required={true}
          />
        </div>

        <div className="border-0 form-footer m-0 p-0">
          {reset.isLoading ? (
            <SpinnerButtonLoader
              buttonClass={"btn-block btn-default"}
              textClass={"text-white"}
            />
          ) : (
            <button type="submit" className={`btn btn-block btn-default`}>
              Reset Password
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default withRouter(ResetForm);
