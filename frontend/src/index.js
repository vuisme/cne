import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
// import reportWebVitals from "./reportWebVitals";
import { QueryClient, QueryClientProvider } from "react-query";
// import { ReactQueryDevtools } from 'react-query/devtools'

import ReactGA from "react-ga";
import { instanceSetToken } from "./utils/AxiosInstance";

const TRACKING_ID = "UA-188499439-1"; // OUR_TRACKING_ID
ReactGA.initialize(TRACKING_ID);

const authToken = window.localStorage.getItem("_token");

instanceSetToken(authToken ? authToken : "");

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

if (document.getElementById("root")) {
  ReactDOM.render(
    <QueryClientProvider client={queryClient}>
      <App />
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>,
    document.getElementById("root")
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals(console.log);
