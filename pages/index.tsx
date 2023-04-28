import React, { useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { VideoSummarizer } from '@/components/VideoSummarizer';
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { VideoTitleList } from '@/components/VideoTitleList';



export default function Home() {

  const [url, setUrl] = useState('');
  const [videoId, setVideoId] = useState('');
  // Add a loading state
  //const [loading, setLoading] = useState(true);
  const [validationError, setValidationError] = useState('');
  const [shouldFetchVideos, setShouldFetchVideos] = useState(true);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const extractVideoId = (url: string): string => {
    const regex = /(?:\?v=|\/embed\/|\.be\/)([-\w]+)/;
    const match = url.match(regex);
    return match ? match[1] : '';
  };

  const handleButtonClick = useCallback(() => {
    if (validateInput(url)) {

      const videoId = extractVideoId(url);
      setVideoId('');;

      //seta um timeout para dar tempo de limpar o videoId
      setTimeout(() => {
        setVideoId(videoId);
      }, 0);



    }
  }, [url]);

  // Add this function to validate the input
  const validateInput = (input: string): boolean => {
    const urlPattern = /^(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=\S+$/;
    if (!urlPattern.test(input)) {
      setValidationError('Please enter a valid YouTube URL.');
      return false;
    } else {
      setValidationError('');
      return true;
    }
  };


  return (
    <div className="container">
      <section className="hero">
        <div className="hero-text">
          <h1 className="header-text">Supercharge Your YouTube Experience!</h1>
          <p className="lead">Get concise summaries of your favorite videos in minutes</p>
        </div>
        <div className="input-group mb-3 search-box">
          <input
            className="form-control"
            type="text"
            placeholder="Enter YouTube URL"
            value={url}
            id="txtUrl"
            onChange={handleInputChange}
          />
          <div className="input-group-append">
            <button className="btn btn-primary" onClick={handleButtonClick}>
              <i>
                <FontAwesomeIcon icon={faSearch} /> Summarize!
              </i>
            </button>
          </div>
        </div>
      </section>
      <div className="content-wrapper">
        <div className="main-content">

          {validationError && <div className="alert alert-danger mt-2">{validationError}</div>}
          {videoId && <VideoSummarizer videoId={videoId} onVideoSummarized={() => setShouldFetchVideos(true)} />}
        </div>
        <VideoTitleList setVideoId={setVideoId} shouldFetchVideos={shouldFetchVideos} setShouldFetchVideos={setShouldFetchVideos} />
      </div>
    </div>
  );
}
