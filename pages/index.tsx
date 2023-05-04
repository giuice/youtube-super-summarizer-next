import React, { useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { VideoSummarizer } from '@/components/VideoSummarizer';
import { faSearch, faBoxOpen } from '@fortawesome/free-solid-svg-icons'
import { VideoTitleList } from '@/components/VideoTitleList';




export default function Home() {

  const [url, setUrl] = useState('');
  const [videoId, setVideoId] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [validationError, setValidationError] = useState('');
  const [shouldFetchVideos, setShouldFetchVideos] = useState(true);
  const [useChapters, setUseChapters] = useState(true);
  const [selectedModel, setSelectedModel] = useState('davinci-003');

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUseChapters(e.target.checked);
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedModel(e.target.value);
  };

  const handleVideoTitleUpdate = (title: string) => {
    setVideoTitle(title);
  };

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
    const urlPattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(watch\?v=|embed\/|v\/|)?([a-zA-Z0-9_-]{11})(\S+)?$/;
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
                <FontAwesomeIcon icon={faSearch} /> Go!
              </i>
            </button> &nbsp;
            <button
              className="btn btn-primary"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#optionsPanel"
              aria-expanded="true"
              aria-controls="optionsPanel"
            ><i>
                <FontAwesomeIcon icon={faBoxOpen} />
              </i>
              Options
            </button>
          </div>
        </div>
        
      </section>
      <div className="collapse" id="optionsPanel">
        <div className="options mb-3 row rounded">
          <div className="checkbox-container">
            <input
              className="custom-checkbox"
              type="checkbox"
              id="useChapters"
              checked={useChapters}
              onChange={handleCheckboxChange}
            />
            <label className="form-check-label" htmlFor="useChapters">
              Use Chapters
            </label>
            
              <label className='col-form-label' htmlFor="modelSelect">Use model to summarize:</label>
              <select
                className="form-control-plaintext"
                id="modelSelect"
                value={selectedModel}
                onChange={handleSelectChange}
              >
                <option value="davinci-003">davinci-003</option>
                <option value="babbage-001">babbage-001</option>
              </select>
            
          </div>
        </div>
      </div>

      <div className="content-wrapper">
        <div className="main-content">

          {validationError && <div className="alert alert-danger mt-2">{validationError}</div>}
          {videoId && <h1 className='youtube-title'>{ videoTitle } </h1>}
          {videoId && <VideoSummarizer videoId={videoId} onVideoTitleUpdate={handleVideoTitleUpdate} useChapters={useChapters} selectedModel={selectedModel} onVideoSummarized={() => setShouldFetchVideos(true)} />}
        </div>
        <VideoTitleList setVideoId={setVideoId} shouldFetchVideos={shouldFetchVideos} setShouldFetchVideos={setShouldFetchVideos} />
      </div>
    </div>
  );
}
