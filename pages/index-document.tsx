import React, { useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { VideoSummarizer } from '@/components/VideoSummarizer';
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { DocumentTab } from '@/components/DocumentSummarizer';


export default function Home() {

  const [url, setUrl] = useState('');
  const [videoId, setVideoId] = useState('');
  // Add a loading state
  //const [loading, setLoading] = useState(true);
  const [validationError, setValidationError] = useState('');
  const [documentMode, setDocumentMode] = useState(false);

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
      console.log(videoId);
      setVideoId(videoId);

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
        {/* Add a tab navigation */}
        {/* Add a vertical tab navigation */}
        <div className='tabs-container'>
        <div className="tabs">
          <div
            className={`tab ${!documentMode ? 'active' : ''}`}
            onClick={() => setDocumentMode(false)}
          >
            Summarize Video
          </div>
          <div
            className={`tab ${documentMode ? 'active' : ''}`}
            onClick={() => setDocumentMode(true)}
          >
            Summarize Document
          </div>
        </div>
        {/* Conditional rendering of components based on the current tab */}
        <div className='tab-content'>
          {!documentMode ? (<>
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
            {validationError && <div className="alert alert-danger mt-2">{validationError}</div>}
            {videoId && <VideoSummarizer videoId={videoId} />}
          </>) : (
            <DocumentTab />
          )}
        </div>
        </div>
      </section>
    </div>

  )
}
