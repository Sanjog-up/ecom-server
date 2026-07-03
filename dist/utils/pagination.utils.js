"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPagination = void 0;
const getPagination = (count, currentPage, perPage) => {
    const total_page = Math.ceil(count / perPage);
    return {
        total_page,
        total_count: count,
        current_page: currentPage,
        next_page: currentPage < total_page ? currentPage + 1 : null,
        prev_page: currentPage === 1 ? null : currentPage - 1,
    };
};
exports.getPagination = getPagination;
