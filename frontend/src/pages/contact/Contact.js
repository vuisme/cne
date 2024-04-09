import React, {useEffect, useState} from "react";
import parser from "html-react-parser";
import {goPageTop} from "../../utils/Helpers";
import PageSkeleton from "../../skeleton/PageSkeleton";
import My404Component from "../404/My404Component";
import {useContactMessage, useCustomPageData, useSettings} from "../../api/GeneralApi";
import Swal from "sweetalert2";
import Helmet from "react-helmet";
import SpinnerButtonLoader from "../../loader/SpinnerButtonLoader";
import {analyticsEventTracker, analyticsPageView} from "../../utils/AnalyticsHelpers";

const Contact = () => {
	const {data: settings} = useSettings();
	const {data: contact, isLoading: contactLoading} = useCustomPageData('contact-us', 'contact');

	const {mutateAsync, isLoading} = useContactMessage();

	const gaEventTracker = (eventName) => {
		analyticsEventTracker('contact-page', eventName);
	};

	const [name, setName] = useState('');
	const [phone, setPhone] = useState('');
	const [email, setEmail] = useState('');
	const [subject, setSubject] = useState('');
	const [message, setMessage] = useState('');
	const [errors, setErrors] = useState({});

	useEffect(() => {
		goPageTop();
		analyticsPageView();
	}, []);

	if (contactLoading) {
		return <PageSkeleton/>;
	}

	if (!contact?.id) {
		return <My404Component/>;
	}

	const submitContactForm = (event) => {
		event.preventDefault();
		mutateAsync({name, email, phone, subject, message}, {
			onSuccess: (data) => {
				if (data.status === true) {
					Swal.fire({
						text: data.msg,
						icon: 'success',
						confirmButtonText: 'Dismiss'
					});
					setName('');
					setEmail('');
					setPhone('');
					setSubject('');
					setMessage('');
					goPageTop();
				} else if (data.status === false) {
					setErrors(data?.errors || {})
				}
			}
		});
	};

	const errorName = errors?.name?.[0] || null;
	const errorPhone = errors?.phone?.[0] || null;
	const errorEmail = errors?.email?.[0] || null;
	const errorSubject = errors?.subject?.[0] || null;
	const errorMessage = errors?.message?.[0] || null;

	return (
		<main className="main">
			<Helmet>
				<title>Contact with us</title>
			</Helmet>

			<div className="container">
				<div className="card my-3 my-md-4">
					<div className="card-body">
						<div className="row">
							<div className="col-lg-6 mb-2 mb-lg-0">
								<h2 className="title mb-1">
									Contact Information
								</h2>
								<div className="mb-3">
									{contact?.post_content && parser(contact.post_content)}
								</div>
								<div className="row">
									<div className="col-sm-12">
										<div className="contact-info">
											<h3>The Office</h3>
											<ul className="contact-list">
												<li>
													<i className="icon-location"/>
													{settings?.office_address || ''}
												</li>
												<li>
													<i className="icon-phone"/>
													<a
														href={`tel:${settings?.office_phone || ''}`}
														onClick={() => gaEventTracker('click-call')}
													>
														{settings?.office_phone || ''}
													</a>
												</li>
												<li>
													<i className="icon-mail"/>
													<a
														href={`mailto:${settings?.office_email || ''}`}
														onClick={() => gaEventTracker('click-email')}
													>
														{settings?.office_email || ''}
													</a>
												</li>
											</ul>
										</div>
									</div>
								</div>
								<div className="row">
									<div className="col-sm-12">
										<h2 className="title mb-1">
											Got Any Questions?
										</h2>
										{/* End .title mb-2 */}
										<p className="mb-2">
											Use the form below to get in touch with the sales team
										</p>
										<form
											onSubmit={(event) => submitContactForm(event)}
											className="contact-form mb-3"
										>
											<div className="row">
												<div className="form-group col-sm-6">
													<label htmlFor="name" className="sr-only">Name</label>
													<input
														type="text"
														className="form-control"
														id="name"
														value={name}
														onChange={e => setName(e.target.value)}
														placeholder="Your Name"
														required
													/>
													{errorName && <p className="text-danger">{errorName}</p>}
												</div>
												<div className="form-group col-sm-6">
													<label htmlFor="email" className="sr-only">Email</label>
													<input
														type="email"
														className="form-control"
														id="email"
														value={email}
														onChange={e => setEmail(e.target.value)}
														placeholder="Email *"
														required
													/>
													{errorEmail && <p className="text-danger">{errorEmail}</p>}
												</div>
											</div>
											<div className="row">
												<div className="form-group col-sm-6">
													<label htmlFor="phone" className="sr-only"> Phone </label>
													<input
														type="tel"
														className="form-control"
														id="phone"
														value={phone}
														onChange={e => setPhone(e.target.value)}
														placeholder="Phone"
														required
													/>
													{errorPhone && <p className="text-danger">{errorPhone}</p>}
												</div>
												<div className="form-group col-sm-6">
													<label htmlFor="subject" className="sr-only"> Subject </label>
													<input
														type="text"
														className="form-control"
														id="subject"
														value={subject}
														onChange={e => setSubject(e.target.value)}
														placeholder="Subject"
														required
													/>
													{errorSubject && <p className="text-danger">{errorSubject}</p>}
												</div>
											</div>
											{/* End .row */}
											<div className="form-group">
												<label htmlFor="message" className="sr-only">Message</label>
												<textarea
													className="form-control"
													rows={4}
													id="message"
													value={message}
													onChange={e => setMessage(e.target.value)}
													placeholder="Your Message"
													required
												/>
												{errorMessage && <p className="text-danger">{errorMessage}</p>}
											</div>
											{
												isLoading ?
													<SpinnerButtonLoader buttonClass="btn btn-block btn-default"/>
													:
													<button
														type="submit"
														className="btn btn-block btn-default"
														onClick={() => gaEventTracker('submit-contact')}
													>
														<span>SUBMIT</span>
														<i className="icon-long-arrow-right"/>
													</button>
											}
										</form>
									</div>
								</div>
								{/* End .row */}
							</div>
							{/* End .col-lg-6 */}
							<div className="col-lg-6">
								{settings?.g_map_iframe_url && (
									<div className="embed-responsive embed-responsive-1by1">
										<iframe
											className="embed-responsive-item"
											src={settings.g_map_iframe_url}
										/>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
};


export default Contact;
