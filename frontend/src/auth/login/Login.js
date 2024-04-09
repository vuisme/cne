import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import OtpLoginForm from "./include/otpLogin/OtpLoginForm";
import { useSettings } from "../../api/GeneralApi";
import { isAuthenticated } from "../../api/Auth";
import { goPageTop } from "../../utils/Helpers";
import { analyticsPageView } from "../../utils/AnalyticsHelpers";
import { fbTrackCustom } from "../../utils/FacebookPixel";

const Login = props => {
	const { data: settings } = useSettings();

	const isAuth = isAuthenticated();

	useEffect(() => {
		goPageTop();
		analyticsPageView();
		fbTrackCustom('payment-process-click', { click: 'click-for-partial-payment' });
		if (isAuth) {
			props.history.push("/dashboard");
		}
	}, [isAuth]);

	return (
		<main className="main">
			<div className="container">
				<div className="row justify-content-center">
					<div className="col-md-4">
						<div className="card" style={{ margin: '4rem 0' }}>
							<div className="card-body p-4 py-5">
								<img
									src={'/assets/img/logo/chinaexpress.png'}
									style={{ margin: ' 0 auto 1rem', height: '5rem' }}
									alt={settings?.site_name}
								/>

								<OtpLoginForm />

								<Link
									to={`/forgot-password`}
									className="d-block login_link mb-3 text-center"
								>
									Forgot password
								</Link>

							</div>
						</div>

					</div>
				</div>

			</div>
		</main>
	);
};


export default Login;
