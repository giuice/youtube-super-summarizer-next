import React, { useEffect, useState } from 'react';
import { VideoData } from '@/domain/video/VideoData';
import { VideoModal } from '@/components/VideoModal';
import { Pagination } from '@/components/Pagination';
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

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
    try {
      const response = await fetch('/api/videos');
      if (!response.ok) {
        const error = await response.json();
        console.error('Error fetching videos:', error);
        return null;
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching videos:', error);
      return null;
    }
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
    <div className="sticky top-4">
      <div className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Latest Summarized Videos</h2>
          <Input
            type="text"
            placeholder="Search by video title"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="space-y-4">
          {currentVideos.map((video) => (
            <Card 
              key={video.video_id} 
              className="overflow-hidden hover:ring-2 hover:ring-primary/50 transition-all cursor-pointer"
              onClick={() => setVideoId(video.video_id)}
            >
              <CardContent className="p-0">
                <div className="aspect-video">
                  <img 
                    className="w-full h-full object-cover" 
                    src={video.thumbnail_url} 
                    alt={`${video.title} thumbnail`} 
                  />
                </div>
                <div className="p-3 space-y-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTitleClick(video.video_id);
                    }}
                    className="text-sm font-medium text-left hover:text-primary line-clamp-2 w-full"
                  >
                    {video.title}
                  </button>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <a 
                      href={video.author_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="hover:text-primary"
                    >
                      {video.author_name}
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Pagination 
          videosPerPage={videosPerPage} 
          totalVideos={getVideosByTitle(searchText).length} 
          paginate={paginate} 
        />
        
        <VideoModal show={showModal} onHide={handleModalClose} videoId={currentVideoId} />
      </div>
    </div>
  );
};
