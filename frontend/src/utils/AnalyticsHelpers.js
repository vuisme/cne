import ReactGA from "react-ga";

const TRACKING_ID = "UA-188499439-1"; // OUR_TRACKING_ID
ReactGA.initialize(TRACKING_ID);


const environment = process.env.REACT_APP_ENVIRONMENT;


export const analyticsPageView = () => {
	if (environment !== 'production') {
		return '';
	}
	ReactGA.pageview(window.location.pathname + window.location.search);
	// console.log('activated');
};

export const analyticsEventTracker = (category = "ChineExpress Home", action = "Test click", label = "Test Lavel") => {
	if (environment !== 'production') {
		return '';
	}
	ReactGA.event({ category, action, label });
};