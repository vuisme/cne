import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';
import SpinnerButtonLoader from "../../../../../loader/SpinnerButtonLoader";
import {useAliSearchProduct} from "../../../../../api/AliExpressProductApi";
import Swal from "sweetalert2";

const AliSearchForm = () => {
	const history = useHistory();
	const [search, setSearch] = useState("");

	const {mutateAsync, isLoading} = useAliSearchProduct();

	const submitExpressSearch = (event) => {
		event.preventDefault();
		if (search) {
			mutateAsync({search},
				{
					onSuccess: (response) => {
						if (response?.status === true) {
							history.push(`/aliexpress/product/${response?.product_id}`);
						} else {
							Swal.fire({
								text: response?.msg,
								icon: "warning",
							});
						}
					}
				});

		} else {
			Swal.fire({
				text: "Paste a valid link",
				icon: "warning",
			});
		}
	};
	return (
		<div>
			<img src={`/assets/img/paste-aliExpress-link.gif`} className="img-fluid aliExpressText" alt="aliExpressText"/>
			<form
				className="ali_express_search_form"
				method="get"
				onSubmit={(event) => submitExpressSearch(event)}>
				<div className="input-group">
					<input
						type="text"
						className="form-control"
						onChange={(event) =>
							setSearch(
								event.target.value
							)
						}
						placeholder="Search By Aliexpress Link"
					/>
					<div className="input-group-append">
						{
							isLoading ?
								<SpinnerButtonLoader buttonClass={'btn-search'}/>
								:
								<button
									type="submit"
									className="btn btn-search"
								>
									<i className="icon-search"/>
								</button>
						}
					</div>
				</div>
			</form>
		</div>
	);
};

export default AliSearchForm;