import React, { useEffect, useState } from 'react';
import { VideoData } from '@/domain/video/VideoData';
import { VideoService } from '@/domain/video/VideoService';
import { VideoRepositorySupabase } from '@/infra/supabase/VideoRepositorySupabase';
import { VideoModal } from '@/components/VideoModal';
import { Pagination } from '@/components/Pagination';

interface VideoTitleProps {
  setVideoId: (videoId: string) => void;
  shouldFetchVideos: boolean;
  setShouldFetchVideos: (value: boolean) => void;
}

export const VideoTitleList: React.FC<VideoTitleProps> = ({ setVideoId, shouldFetchVideos, setShouldFetchVideos }) => {
  const [latestVideos, setLatestVideos] = useState<VideoData[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState('');
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const videosPerPage = 6;

  const handleTitleClick = (videId: string) => {
    setCurrentVideoId(videId);
    console.log('embedUrl', videId)
    setShowModal(true);
  };

  const handleModalClose = () => {
    setCurrentVideoId('');
    setShowModal(false);
  };

  const fetchLatestVideos = async (): Promise<VideoData[] | null> => {
    const vService: VideoService = new VideoService(new VideoRepositorySupabase());
    return await vService.getAll();
  };

  const getVideosByTitle = (title: string): VideoData[] => {
    return latestVideos.filter(video => video.title.toLowerCase().includes(title.toLowerCase()));
  };

  const indexOfLastVideo = currentPage * videosPerPage;
  const indexOfFirstVideo = indexOfLastVideo - videosPerPage;
  const currentVideos = getVideosByTitle(searchText).slice(indexOfFirstVideo, indexOfLastVideo);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  useEffect(() => {
    if (shouldFetchVideos) {
      (async () => {
        const videos = await fetchLatestVideos();
        console.log('videos', videos);
        if (videos) {
          setLatestVideos(videos); //.slice(0, 3));
        }
      })();
      setShouldFetchVideos(false);
    }
  }, [shouldFetchVideos, setShouldFetchVideos]);

  return (
    <div className="latest-videos">
      <h5 className="latest-videos-title mb-3">Latest Summarized Videos</h5>
      <div className="latest-videos-search">
        <input type="text" placeholder="Search by video title" 
        value={searchText} onChange={(e) => setSearchText(e.target.value)} 
        className="form-control mb-3 mx-3" />
      </div>
      <ul className="latest-videos-list">
        {currentVideos.map((video) => (
          <li key={video.video_id} className="latest-videos-item"
            onClick={() => setVideoId(video.video_id)}
            title='Click to show this Summary!'>
            <div className="thumbnail-container">
              <img className="thumbnail" src={video.thumbnail_url} alt={`${video.title} thumbnail`} />
            </div>
            <div className="video-title-author">
              <a href="#" onClick={() => handleTitleClick(video.video_id)}>
                {video.title}
              </a>
              <span> · </span>
              <small>
                <a href={video.author_url} target="_blank" rel="noopener noreferrer">
                  {video.author_name}
                </a>
              </small>
            </div>
          </li>
        ))}
      </ul>
      <Pagination videosPerPage={videosPerPage} totalVideos={getVideosByTitle(searchText).length} paginate={paginate} />
      <VideoModal show={showModal} onHide={handleModalClose} videoId={currentVideoId} />
    </div>
  );


};
