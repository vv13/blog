import React from "react";

const Pagination: React.FC<{ pageInfo: any, onChange: (page: number) => void }> = (props) => {
  const { pageInfo } = props;
  const { currentPage, pageCount, totalCount } = pageInfo;

  return (
    <div className="flex items-center justify-center gap-3">
      <button
        onClick={() => props.onChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="w-9 h-9 inline-flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200"
        aria-label="Previous page"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={() => props.onChange(currentPage + 1)}
        disabled={currentPage >= pageCount}
        className="w-9 h-9 inline-flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200"
        aria-label="Next page"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <span className="ml-1 text-sm text-gray-500 dark:text-gray-400 tabular-nums">
        {currentPage} / {pageCount}
      </span>
      <span className="text-sm text-gray-500 dark:text-gray-400">
        共 {totalCount} 篇
      </span>
    </div>
  );
};

export default Pagination;
