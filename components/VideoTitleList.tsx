import React, { useEffect, useState } from 'react';
import { VideoData } from '@/infra/VideoData';
import { VideoService } from '@/infra/services/VideoService';
import { VideoRepositorySupabase } from '@/infra/supabase/VideoRepositorySupabase';

interface VideoTitleProps {
	setVideoId: (videoId: string) => void;
	refreshKey: number;
  }
  
  export const VideoTitleList: React.FC<VideoTitleProps> = ({ setVideoId, refreshKey }) => {
	const [latestVideos, setLatestVideos] = useState<VideoData[]>([]);
  
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
    <div className="mt-4">
      <h5>Latest Summarized Videos</h5>
      <ul className="list-group">
        {latestVideos.map((video) => (
          <li
            key={video.video_id}
            className="list-group-item list-group-item-action"
            onClick={() => setVideoId(video.video_id)}
          >
            {video.title}
          </li>
        ))}
      </ul>
    </div>
  );
};
