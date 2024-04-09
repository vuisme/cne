import React, { useState } from "react";
import { useAuthMutation } from "../../../../../api/Auth";
import SpinnerButtonLoader from "../../../../../loader/SpinnerButtonLoader";
import Swal from "sweetalert2";
import { useHistory } from "react-router-dom";

const PassWordLogin = ({ response, setResponse }) => {
  const history = useHistory();
  const phone = response?.data?.phone;
  const email = response?.data?.email;

  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);

  const {
    loginSubmit: { mutateAsync, isLoading },
  } = useAuthMutation();

  const submitPassword = (event) => {
    event.preventDefault();

    mutateAsync(
      { phone, email, password },
      {
        onSuccess: (res) => {
          if (res?.id > 0) {
            history.push("/dashboard");
          } else {
            const err = res.errors;
            const pwdError = err?.password ? err.password[0] : null;
            if (pwdError) {
              Swal.fire({
                text: pwdError,
                icon: "error",
                buttons: "Ok",
              });
            }
            setErrors(err);
          }
        },
      }
    );
  };

  const backToLoginForm = (event) => {
    event.preventDefault();
    setResponse({});
  };

  const passwordError = errors?.password ? errors.password[0] : null;

  return (
    <div>
      <h1 className="text-center font-weight-bold">Sign In</h1>
      <form onSubmit={(event) => submitPassword(event)}>
        <div className="form-group">
          <label htmlFor="password">
            {" "}
            Password
            <span className="text-danger"> * </span>
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="password"
            placeholder="Password"
            required={true}
          />
          {passwordError && (
            <p className="small m-0 text-danger">{passwordError}</p>
          )}
        </div>
        <div className="border-0 form-footer m-0 p-0">
          {isLoading ? (
            <SpinnerButtonLoader />
          ) : (
            <button type="submit" className={`btn py-2 btn-block btn-default`}>
              Sign In
            </button>
          )}
          <a
            href={`/login`}
            onClick={(event) => backToLoginForm(event)}
            className="d-block login_link mt-3 mb-2 text-center"
          >
            Back to login
          </a>
        </div>
      </form>
    </div>
  );
};

export default PassWordLogin;
