import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { VideoSummarizer } from '@/components/VideoSummarizer';
import { faSearch } from '@fortawesome/free-solid-svg-icons'



export default function Home() {

  const [url, setUrl] = useState('');
  const [videoId, setVideoId] = useState('');
   // Add a loading state
  const [loading, setLoading] = useState(true);
  const [validationError, setValidationError] = useState('');


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const extractVideoId = (url: string): string => {
    const regex = /(?:\?v=|\/embed\/|\.be\/)([-\w]+)/;
    const match = url.match(regex);
    return match ? match[1] : '';
  };

  const handleButtonClick = () => {
    if (validateInput(url)) {
      setLoading(true); // Set loading to true before fetching the video ID
      const videoId = extractVideoId(url);
      console.log(videoId);
      setVideoId(videoId);
      setLoading(false); // Set loading to false after setting the video ID
    }
  };

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
    <div className='container'>
      <div className="row">
        <div className="col">

          {/* <button onClick={toggleTheme}>Toggle theme</button> */}
          <h1 className="text-center mb-4">YouTube Super Summarizer!</h1>
          <div className="input-group mb-3 search-box">
            <FontAwesomeIcon icon={faSearch} />

            <input
              className="form-control"
              type="text"
              placeholder="Enter youtube Url"
              value={url}
              id='txtUrl'
              onChange={handleInputChange}
            />
            <div className="input-group-append">
              <button className="btn btn-primary" onClick={handleButtonClick}>
                Delight!
              </button>
            </div>
          </div>
          {/* Add this div to show the validation error message */}
          {validationError && <div className="alert alert-danger mt-2">{validationError}</div>}
          {/* Add the VideoSummarizer component */}
          {!loading && videoId && <VideoSummarizer videoId={videoId} loading={loading} />}
        </div>
      </div>
    </div>
  )
}
