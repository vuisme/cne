import React from 'react';
import {useHistory} from "react-router-dom";
import {useSearchSuggestion} from "../../api/ProductApi";

const SearchSuggestion = (props) => {
	const {search: keyword, setShowSuggestion} = props;
	let history = useHistory();

	const {data, isLoading} = useSearchSuggestion(keyword);

	const processSuggestionData = (event, suggestionWord) => {
		event.preventDefault();
		history.push(`/search?keyword=${suggestionWord}`);
		setShowSuggestion(false);
	};

	const closeSuggestion = (event) => {
		event.preventDefault();
		setShowSuggestion(false);
	};

	if (isLoading) {
		return (
			<>
				<div className="SearchSuggestion">
					<ul className="list-group">
						<li className="list-group-item">
							<div className="text-center">
								<div className="spinner-border spinner-border-sm" role="status">
									<span className="sr-only">Loading...</span>
								</div>
							</div>
						</li>
					</ul>
				</div>
			</>
		);
	}


	if (!data?.length) {
		return '';
	}


	return (
		<div className="SearchSuggestion">
			<ul className="list-group">
				{
					data?.map((item, index) =>
						<a key={index}
						   className="list-group-item list-group-item-action"
						   onClick={(event) => processSuggestionData(event, item.query_data)}
						   href={`/search?keyword=${item.query_data}`}>{item.query_data}</a>
					)
				}
			</ul>
		</div>
	);
};

export default SearchSuggestion;