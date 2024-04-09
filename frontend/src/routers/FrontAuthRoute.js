import React from "react";
import {Redirect, Route} from "react-router-dom";
import FrontendLayout from "../layouts/FrontendLayout";
import {isAuthenticated} from "../api/Auth";

const FrontAuthRoute = ({component: Component, ...rest}) => {

  const isAuth = isAuthenticated();

  return (<Route
      {...rest}
      render={(props) => <FrontendLayout>
        {isAuth ? <Component {...props} /> : <Redirect
          to={{
            pathname: "/login", state: {from: props.location},
          }}
        />}
      </FrontendLayout>}
    />);
};


export default FrontAuthRoute;
