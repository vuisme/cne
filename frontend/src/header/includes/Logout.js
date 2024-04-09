import React from "react";
import { useAuthMutation } from "../../api/Auth";
import { withRouter } from "react-router-dom";

const Logout = (props) => {
  const { authLogout } = useAuthMutation({
    middleware: "auth",
    redirectIfAuthenticated: "/login",
  });

  const authLogoutProcess = async (e) => {
    e.preventDefault();
    authLogout();
  };

  return (
    <a
      href={`/logout`}
      className="dropdown-item"
      onClick={(e) => authLogoutProcess(e)}
    >
      Logout
    </a>
  );
};

export default withRouter(Logout);
