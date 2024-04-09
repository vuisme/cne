import queryString from 'query-string'


export const useQuery = () => {
	const query = queryString.parse(window.location.search);
	// console.log('query', query)
	return query;
};
