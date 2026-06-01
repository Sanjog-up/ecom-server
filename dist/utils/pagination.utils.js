"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPagination = void 0;
const getPagination = (totalCount, currentPage, perPage) => {
    const total_page = Math.ceil(totalCount / perPage);
    return {
        total_page,
        total_count: totalCount,
        current_page: currentPage,
        next_page: currentPage < total_page ? currentPage + 1 : null,
        prev_page: currentPage > 1 ? currentPage - 1 : null,
    };
};
exports.getPagination = getPagination;
