import React from "react";

const Pagination: React.FC<{ pageInfo: any, onChange: (page: number) => void }> = (props) => {
  const { pageInfo } = props;
  const { currentPage, pageCount, totalCount, pageSize } = pageInfo;


  return (
    <ul className="relative m-auto flex items-center justify-center list-none">
      <li className="w-6 text-center mb-0">
        {currentPage !== 1 && (
          <button className="bg-transparent	 border-none cursor-pointer	outline-none" onClick={() => props.onChange(1)}>«</button>
        )}
      </li>
      <li className="w-6 text-center mb-0">
        {currentPage > 1 && (
          <button onClick={() => props.onChange(currentPage - 1)}>‹</button>
        )}
      </li>
      {currentPage}
      <li className="w-6 text-center mb-0">
        {currentPage < pageCount && (
          <button onClick={() => props.onChange(currentPage + 1)}>›</button>
        )}
      </li>
      <li className="w-6 text-center mb-0">
        {currentPage !== pageCount && (
          <button onClick={() => props.onChange(pageCount)}>»</button>
        )}
      </li>
      <span className="absolute -right-14">共{totalCount}篇</span>
      <span></span>
    </ul>
  );
};

export default Pagination;
