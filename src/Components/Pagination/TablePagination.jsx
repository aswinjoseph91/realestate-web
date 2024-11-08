"use client"
import React from "react";
import ReactPaginate from "react-paginate";

const TablePagination = ({ pageCount, onPageChange, startIndex, endIndex, total }) => {
    return (
        <div className="tabel_pagination">
            <span>
                Showing {startIndex} to {endIndex > total ? total : endIndex} of {total} entries
            </span>
            <ReactPaginate
                previousLabel={"<"}
                nextLabel={">"}
                breakLabel="..."
                breakClassName="break-me"
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={onPageChange}
                containerClassName={"pagination_table"}
                previousLinkClassName={"pagination__link_table"}
                nextLinkClassName={"pagination__link_table"}
                disabledClassName={"pagination__link_table--disabled"}
                activeClassName={"pagination__link_table--active"}
            />
        </div>
    );
};

export default TablePagination;