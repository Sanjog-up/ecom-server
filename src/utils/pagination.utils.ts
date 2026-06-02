export const getPagination = (
    count: number, 
    currentPage: number, 
    perPage: number
) => {
        const total_page = Math.ceil(count / perPage);

        return {
            total_page,
            total_count: count,
            current_page: currentPage,
            next_page: currentPage < total_page ? currentPage + 1 : null,
            prev_page: currentPage === 1 ? null : currentPage - 1,
        };
    };