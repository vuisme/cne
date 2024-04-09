import AliSearchForm from "./includes/AliSearchForm";

function AliExpressSearchBar() {

	return (
		<div className="section my-3">
			<div className="container">
				<div className="aliExpressSearchBar mt-2">
					<div className=" row align-items-center">
						<div className="col-md-3 d-none d-md-block">
							<img src={`/assets/img/aliExpress.gif`} className="img-fluid aliExpressLogo" alt="aliExpress"/>
						</div>
						<div className="col-md-9 aliSearchFormCol">
							<AliSearchForm/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default AliExpressSearchBar;
