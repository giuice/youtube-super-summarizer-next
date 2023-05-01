import React, { useEffect, useState } from 'react';
import { VideoData } from '@/domain/video/VideoData';
import { VideoService } from '@/domain/video/VideoService';
import { VideoRepositorySupabase } from '@/infra/supabase/VideoRepositorySupabase';
import { VideoModal } from '@/components/VideoModal';

interface VideoTitleProps {
	setVideoId: (videoId: string) => void;
	shouldFetchVideos: boolean;
  setShouldFetchVideos: (value: boolean) => void;
  }
  
  export const VideoTitleList: React.FC<VideoTitleProps> = ({ setVideoId, shouldFetchVideos, setShouldFetchVideos }) => {
	const [latestVideos, setLatestVideos] = useState<VideoData[]>([]);  
  
  const [showModal, setShowModal] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState('');

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
    <h5 className="latest-videos-title">Latest Summarized Videos</h5>
    <ul className="latest-videos-list">
      {latestVideos.map((video) => (
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
    <VideoModal show={showModal} onHide={handleModalClose} videoId={currentVideoId} />
  </div>
);

  
};
