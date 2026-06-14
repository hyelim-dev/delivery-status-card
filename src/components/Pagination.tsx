import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import styled from "styled-components";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  visiblePages: number[];
  onPageChange: (page: number) => void;
}

const PaginationNav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 22px;

  @media (max-width: 720px) {
    gap: 4px;
  }
`;

const PageNumbers = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0 2px;

  @media (max-width: 720px) {
    gap: 4px;
    margin: 0;
  }
`;

const PageButton = styled.button<{ $current?: boolean }>`
  display: inline-grid;
  min-width: 38px;
  min-height: 38px;
  place-items: center;
  border: 1px solid ${({ $current }) => ($current ? "#154b86" : "var(--line)")};
  border-radius: var(--radius-card);
  color: ${({ $current }) => ($current ? "#ffffff" : "var(--text)")};
  background: ${({ $current }) => ($current ? "#154b86" : "var(--surface)")};
  cursor: pointer;
  font-weight: 800;
  transition:
    border-color 160ms ease,
    color 160ms ease,
    background 160ms ease;

  &:disabled {
    color: var(--text-soft);
    cursor: not-allowed;
    opacity: 0.58;
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover:not(:disabled):not([aria-current="page"]) {
      border-color: #154b86;
      color: #154b86;
    }
  }

  @media (max-width: 720px) {
    min-width: 32px;
    min-height: 34px;
    font-size: 0.82rem;
  }
`;

export function Pagination({
  currentPage,
  totalPages,
  visiblePages,
  onPageChange,
}: PaginationProps) {
  return (
    <PaginationNav aria-label="배송 목록 페이지">
      <PageButton
        type="button"
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        aria-label="첫 페이지"
      >
        <ChevronsLeft size={17} aria-hidden="true" />
      </PageButton>
      <PageButton
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="이전 페이지"
      >
        <ChevronLeft size={17} aria-hidden="true" />
      </PageButton>

      <PageNumbers
        role="group"
        aria-label={`${currentPage} / ${totalPages} 페이지`}
      >
        {visiblePages.map((page) => (
          <PageButton
            key={page}
            type="button"
            $current={page === currentPage}
            onClick={() => onPageChange(page)}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </PageButton>
        ))}
      </PageNumbers>

      <PageButton
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="다음 페이지"
      >
        <ChevronRight size={17} aria-hidden="true" />
      </PageButton>
      <PageButton
        type="button"
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        aria-label="마지막 페이지"
      >
        <ChevronsRight size={17} aria-hidden="true" />
      </PageButton>
    </PaginationNav>
  );
}
