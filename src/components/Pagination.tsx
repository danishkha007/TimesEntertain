
"use client";

import {
  Pagination as ShadPagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination-shadcn";
import { useSearchParams, useRouter } from "next/navigation";
import { useCallback } from "react";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
}

export function Pagination({ totalPages, currentPage }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const createPageURL = useCallback((pageNumber: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `/movies?${params.toString()}`;
  }, [searchParams]);

  const renderPaginationItems = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    const ellipsis = <PaginationEllipsis key="ellipsis" />;

    if (totalPages <= maxPagesToShow + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(
          <PaginationItem key={i}>
            <PaginationLink href={createPageURL(i)} isActive={i === currentPage}>
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      pageNumbers.push(
        <PaginationItem key={1}>
          <PaginationLink href={createPageURL(1)} isActive={1 === currentPage}>
            1
          </PaginationLink>
        </PaginationItem>
      );

      if (currentPage > maxPagesToShow - 2) {
        pageNumbers.push(<PaginationEllipsis key="start-ellipsis" />);
      }

      let startPage = Math.max(2, currentPage - 2);
      let endPage = Math.min(totalPages - 1, currentPage + 2);

      if (currentPage <= 3) {
        endPage = maxPagesToShow -1;
      }
      if (currentPage >= totalPages - 2) {
        startPage = totalPages - maxPagesToShow + 2;
      }


      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(
          <PaginationItem key={i}>
            <PaginationLink href={createPageURL(i)} isActive={i === currentPage}>
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
      
      if (currentPage < totalPages - (maxPagesToShow - 2)) {
         pageNumbers.push(<PaginationEllipsis key="end-ellipsis" />);
      }

      pageNumbers.push(
        <PaginationItem key={totalPages}>
          <PaginationLink href={createPageURL(totalPages)} isActive={totalPages === currentPage}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    return pageNumbers;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <ShadPagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href={createPageURL(currentPage - 1)} aria-disabled={currentPage <= 1} />
        </PaginationItem>
        {renderPaginationItems()}
        <PaginationItem>
          <PaginationNext href={createPageURL(currentPage + 1)} aria-disabled={currentPage >= totalPages} />
        </PaginationItem>
      </PaginationContent>
    </ShadPagination>
  );
}
