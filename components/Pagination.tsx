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
	  <nav className="latest-videos-pagination">
		<ul className="pagination">
		  {pageNumbers.map((number) => (
			<li key={number} className="page-item">
			  <a onClick={() => paginate(number)} href="#" className="page-link">
				{number}
			  </a>
			</li>
		  ))}
		</ul>
	  </nav>
	);
  };
  
