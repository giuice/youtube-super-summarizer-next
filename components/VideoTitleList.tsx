import React, { useEffect, useState } from 'react';
import { VideoData } from '@/infra/VideoData';
import { VideoService } from '@/infra/services/VideoService';
import { VideoRepositorySupabase } from '@/infra/supabase/VideoRepositorySupabase';
import { VideoModal } from '@/components/VideoModal';

interface VideoTitleProps {
	setVideoId: (videoId: string) => void;
	refreshKey: number;
  }
  
  export const VideoTitleList: React.FC<VideoTitleProps> = ({ setVideoId, refreshKey }) => {
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
	  const fetchVideos = async () => {
		const videos = await fetchLatestVideos();
		if (videos) {
		  setLatestVideos(videos.slice(0, 3));
		}
	  };
	  fetchVideos();
	}, [refreshKey]);
  
  return (
    <div className="latest-videos">
      <h5 className="latest-videos-title">Latest Summarized Videos</h5>
      <ul className="latest-videos-list">
        {latestVideos.map((video) => (
          <li
            key={video.video_id}
            className="latest-videos-item"
            onClick={() => setVideoId(video.video_id)}
          >
            <div className="thumbnail-container">
              <img className="thumbnail" src={video.thumbnail_url} alt={`${video.title} thumbnail`} />
              {/* <img className="thumbnail-preview" src={video.thumbnail_url} alt={`${video.title} thumbnail`} /> */}
            </div>
            <div>
              <a href="#" onClick={() => handleTitleClick(video.video_id)}>{video.title}</a>
              <br />
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
