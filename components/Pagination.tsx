import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PaginationProps {
  videosPerPage: number;
  totalVideos: number;
  paginate: (pageNumber: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ videosPerPage, totalVideos, paginate }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalVideos / videosPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="flex justify-center" aria-label="Pagination">
      <ul className="flex gap-2">
        {pageNumbers.map((number) => (
          <li key={number}>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                paginate(number);
              }}
              className={cn(
                "min-w-[2.5rem] h-8"
              )}
            >
              <span className="sr-only">Page </span>
              {number}
            </Button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

