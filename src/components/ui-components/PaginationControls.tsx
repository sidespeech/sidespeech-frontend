import React from "react";
import styled from "styled-components";

interface PaginationControlsStyledProps {}

const PaginationControlsStyled = styled.div<PaginationControlsStyledProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  & button {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: transparent;
    border: none;
    outline: none;
    box-shadow: none;
    & svg {
      margin: 0 1rem;
      & path {
        fill: var(--text-secondary);
      }
    }
    &:disabled {
      pointer-events: none;
    }
    &.prev-next-btn:disabled {
      color: var(--text-secondary-dark);
      & svg path {
        fill: var(--text-secondary-dark);
      }
    }
    &.page-number-btn {
      display: grid;
      place-content: center;
      height: 37px;
      width: 37px;
      border-radius: 10px;
      background-color: var(--bg-secondary);
      color: var(--text-secondary);
      &.active {
        background-color: var(--button-primary);
        color: var(--text-secondary-light);
      }
    }
  }
`;

type PaginationControlsProps = {
  className?: string;
  currentPage?: number;
  id?: string;
  onChangePage: (page: number) => void;
  style?: object;
  totalPages?: number;
};

const PaginationControls = ({
  className,
  currentPage = 1,
  id,
  onChangePage,
  style,
  totalPages = 1,
}: PaginationControlsProps) => {
  return (
    <PaginationControlsStyled className={className} id={id} style={style}>
      <button
        className="prev-next-btn"
        disabled={currentPage === 1}
        onClick={() => onChangePage(currentPage - 1)}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M6 12L0 6L6 0L7.06875 1.05L2.86875 5.25H12V6.75H2.86875L7.06875 10.95L6 12Z" />
        </svg>
        Previous
      </button>

        {Array.from(Array(totalPages).keys()).map(pageNumber => {
          if (totalPages <= 5 ||
              pageNumber === currentPage ||
                  pageNumber === 0 || 
                    pageNumber === totalPages - 1 || 
                      (pageNumber < currentPage && pageNumber > currentPage - 3) ||
                        (pageNumber > currentPage && pageNumber < currentPage + 1)) return(
            <button 
                className={`page-number-btn ${currentPage === pageNumber + 1 ? 'active' : ''}`}
                disabled={currentPage === pageNumber + 1}
                key={pageNumber}
                onClick={() => onChangePage(pageNumber + 1)}
            >
                {pageNumber + 1}
            </button>
          )
          else if (totalPages > 5 && currentPage !== totalPages - 2 && pageNumber === totalPages - 2 ||
            totalPages > 5 && currentPage !== 1 && pageNumber === 1) return (
            <span>...</span>
          )
          else return null;
        })}

        <button className="prev-next-btn" disabled={currentPage === totalPages} onClick={() => onChangePage(currentPage + 1)}>
            Next
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 -5.24537e-07L12 6L6 12L4.93125 10.95L9.13125 6.75L4.5897e-07 6.75L5.90104e-07 5.25L9.13125 5.25L4.93125 1.05L6 -5.24537e-07Z" />
            </svg>
        </button>
    </PaginationControlsStyled>
  );
};

export default PaginationControls;
