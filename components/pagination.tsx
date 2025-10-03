"use client"

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  showPreviousNext?: boolean
  showNumbers?: boolean
  maxVisiblePages?: number
  className?: string
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  showPreviousNext = true,
  showNumbers = true,
  maxVisiblePages = 5,
  className = ""
}: PaginationProps) {
  // Generate page numbers to show
  const getVisiblePages = () => {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const half = Math.floor(maxVisiblePages / 2)
    let start = Math.max(1, currentPage - half)
    let end = Math.min(totalPages, start + maxVisiblePages - 1)

    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1)
    }

    const pages = []
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    return pages
  }

  const visiblePages = getVisiblePages()
  const showStartEllipsis = visiblePages[0] > 1
  const showEndEllipsis = visiblePages[visiblePages.length - 1] < totalPages

  if (totalPages <= 1) {
    return null
  }

  return (
    <div className={`flex items-center justify-center space-x-2 ${className}`}>
      {/* Previous Button */}
      {showPreviousNext && (
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </button>
      )}

      {showNumbers && (
        <>
          {/* First page */}
          {showStartEllipsis && (
            <>
              <button
                onClick={() => onPageChange(1)}
                className={`px-3 py-2 text-sm font-medium border rounded-md ${
                  currentPage === 1
                    ? "bg-purple-600 text-white border-purple-600"
                    : "text-gray-700 bg-white border-gray-300 hover:bg-gray-50"
                }`}
              >
                1
              </button>
              <span className="px-2 py-2 text-gray-500">
                <MoreHorizontal className="w-4 h-4" />
              </span>
            </>
          )}

          {/* Visible page numbers */}
          {visiblePages.map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-2 text-sm font-medium border rounded-md ${
                currentPage === page
                  ? "bg-purple-600 text-white border-purple-600"
                  : "text-gray-700 bg-white border-gray-300 hover:bg-gray-50"
              }`}
            >
              {page}
            </button>
          ))}

          {/* Last page */}
          {showEndEllipsis && (
            <>
              <span className="px-2 py-2 text-gray-500">
                <MoreHorizontal className="w-4 h-4" />
              </span>
              <button
                onClick={() => onPageChange(totalPages)}
                className={`px-3 py-2 text-sm font-medium border rounded-md ${
                  currentPage === totalPages
                    ? "bg-purple-600 text-white border-purple-600"
                    : "text-gray-700 bg-white border-gray-300 hover:bg-gray-50"
                }`}
              >
                {totalPages}
              </button>
            </>
          )}
        </>
      )}

      {/* Next Button */}
      {showPreviousNext && (
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      )}
    </div>
  )
}

interface PaginationInfoProps {
  currentPage: number
  pageSize: number
  total: number
  className?: string
}

export function PaginationInfo({ currentPage, pageSize, total, className = "" }: PaginationInfoProps) {
  const start = Math.min((currentPage - 1) * pageSize + 1, total)
  const end = Math.min(currentPage * pageSize, total)

  return (
    <div className={`text-sm text-gray-700 ${className}`}>
      Showing <span className="font-medium">{start}</span> to{" "}
      <span className="font-medium">{end}</span> of{" "}
      <span className="font-medium">{total}</span> results
    </div>
  )
}