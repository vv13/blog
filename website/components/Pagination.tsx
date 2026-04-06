import React from "react";

const Pagination: React.FC<{ pageInfo: any, onChange: (page: number) => void }> = (props) => {
  const { pageInfo } = props;
  const { currentPage, pageCount, totalCount, pageSize } = pageInfo;

  return (
    <div className="flex items-center justify-center space-x-2">
      {/* First Page */}
      {currentPage > 1 ? (
        <button
          onClick={() => props.onChange(1)}
          className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 transition-colors duration-200"
          aria-label="First page"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      ) : (
        <div className="w-9 h-9" />
      )}

      {/* Previous Page */}
      {currentPage > 1 ? (
        <button
          onClick={() => props.onChange(currentPage - 1)}
          className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 transition-colors duration-200"
          aria-label="Previous page"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      ) : (
        <div className="w-9 h-9" />
      )}

      {/* Page Numbers */}
      <div className="flex items-center space-x-2">
        {Array.from({ length: pageCount }, (_, i) => i + 1).map((page) => {
          const isNearCurrent = Math.abs(page - currentPage) <= 2;
          const isFirstOrLast = page === 1 || page === pageCount;

          if (isNearCurrent || isFirstOrLast) {
            return (
              <button
                key={page}
                onClick={() => props.onChange(page)}
                className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors duration-200 ${
                  page === currentPage
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {page}
              </button>
            );
          }

          // Show ellipsis for skipped pages
          if (Math.abs(page - currentPage) === 3) {
            return (
              <span key={page} className="text-gray-400 dark:text-gray-500 px-2">
                ...
              </span>
            );
          }

          return null;
        })}
      </div>

      {/* Next Page */}
      {currentPage < pageCount ? (
        <button
          onClick={() => props.onChange(currentPage + 1)}
          className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 transition-colors duration-200"
          aria-label="Next page"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      ) : (
        <div className="w-9 h-9" />
      )}

      {/* Last Page */}
      {currentPage < pageCount ? (
        <button
          onClick={() => props.onChange(pageCount)}
          className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 transition-colors duration-200"
          aria-label="Last page"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </button>
      ) : (
        <div className="w-9 h-9" />
      )}

      {/* Total Count */}
      <span className="ml-4 text-sm text-gray-500 dark:text-gray-400">
        共 {totalCount} 篇
      </span>
    </div>
  );
};

export default Pagination;
