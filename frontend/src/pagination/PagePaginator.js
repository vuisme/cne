import React from 'react';
import PropTypes from 'prop-types';
import ReactPaginate from "react-paginate";

const PagePaginator = (props) => {
	let {handlePaginationClick, currentPage, totalPage} = props;

	currentPage = Number(currentPage) > 1 ? Number(currentPage) : 1;

	const maxPage = (totalPage ? Number(totalPage) : 0) > 280 ? 280 : totalPage;

	return (
		<nav aria-label="Page navigation">
			<ReactPaginate
				previousLabel={`<`}
				nextLabel={`>`}
				breakLabel={"..."}
				breakClassName={"break-me"}
				forcePage={currentPage - 1}
				pageCount={maxPage}
				marginPagesDisplayed={1}
				pageRangeDisplayed={2}
				onPageChange={handlePaginationClick}
				containerClassName={"pagination justify-content-center"}
				pageClassName={`page-item`}
				pageLinkClassName={`page-link`}
				previousClassName={`page-item`}
				previousLinkClassName={`page-link page-link-prev`}
				nextClassName={`page-item`}
				nextLinkClassName={`page-link page-link-next`}
				disabledClassName={"disabled"}
				activeClassName={"active"}
			/>
		</nav>
	);
};

PagePaginator.propTypes = {
	handlePaginationClick: PropTypes.func.isRequired,
	currentPage: PropTypes.any.isRequired,
	totalPage: PropTypes.any.isRequired,
};

export default PagePaginator;
