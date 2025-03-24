import React, { useState, useCallback, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { VideoSummarizer } from '@/components/VideoSummarizer';
import { faSearch, faBoxOpen } from '@fortawesome/free-solid-svg-icons'
import { VideoTitleList } from '@/components/VideoTitleList';
import VideoDataService from '@/application/VideoDataService';




export default function Home() {

  const [url, setUrl] = useState('');
  const [videoId, setVideoId] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [validationError, setValidationError] = useState('');
  const [shouldFetchVideos, setShouldFetchVideos] = useState(true);
  const [useChapters, setUseChapters] = useState(true);
  const [selectedModel, setSelectedModel] = useState('gpt-4o-mini');
  const [apiKey, setApiKey] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

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
  const checkApiKey = useCallback(async (): Promise<boolean> => {
    const checked = await VideoDataService.checkApiKey(apiKey, selectedModel);
    if (!checked) {
      setValidationError('Please enter a valid OpenAI API key');
      setApiKey('');
      return false;
    } else {
      setValidationError('');
      // Save the API key to localStorage
      localStorage.setItem('openai_api_key', apiKey);
      return true;
    }
  }, [apiKey]);

  useEffect(() => {
    // Get the API key from localStorage
    const storedApiKey = localStorage.getItem('openai_api_key');
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
  }, []);

  const handleButtonClick = useCallback(async () => {
  const hasapi = await checkApiKey();
  console.log(hasapi);
  if (validateInput(url) && hasapi && apiKey) {
    const videoId = extractVideoId(url);
    setVideoId('');

    // Set a timeout to give time to clear the videoId
    setTimeout(() => {
      setVideoId(videoId);
    }, 0);
  }else if(!hasapi){ 
    setValidationError('Please enter a valid OpenAI API key, or choose one already summarized video from the list of titles.');
  }
}, [url, checkApiKey, apiKey]);

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
            <button className="btn btn-primary" onClick={handleButtonClick} disabled={!apiKey}>
              <i>
                <FontAwesomeIcon icon={faSearch} /> Go!
              </i>
            </button> &nbsp;
            <button
              className="btn btn-primary"
              type="button"
              onClick={toggleModal}
            >
              <i>
                <FontAwesomeIcon icon={faBoxOpen} />
              </i>
              Options
            </button>
          </div>
        </div>

      </section>

      <div className={`modal ${isModalOpen ? 'show' : ''}`} tabIndex={-1} style={{ display: isModalOpen ? 'block' : 'none' }}>
        <div className="modal-dialog">
          <div className="modal-content modal-custom">
            <div className="modal-header">
              <h5 className="modal-title">Options</h5>
              <button type="button" className="btn-close btn-close-custom" title='Close' onClick={toggleModal}></button>
            </div>
            <div className="modal-body">
              <div className="options-container">
                <div className="mb3">
                  <input
                    className="custom-checkbox form-check-input"
                    type="checkbox"
                    id="useChapters"
                    checked={useChapters}
                    onChange={handleCheckboxChange}
                  /> &nbsp;
                  <label className="form-check-label" htmlFor="useChapters">
                    Use Chapters
                  </label>
                </div>
                <div className="mb3">
                  <label className="form-label" htmlFor="modelSelect">Use model to summarize:</label>
                  <select
                    className="form-control"
                    id="modelSelect"
                    value={selectedModel}
                    onChange={handleSelectChange}
                  >
                    <option value="gpt-4o-mini">gpt-4o-mini</option>
                    <option value="deepseek-reasoner">deepseek-reasoner</option>
                    {/* <option value="text-davinci-003">davinci-003</option>
                    <option value="text-babbage-001">babbage-001</option> */}
                  </select>
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="apiKey" className="form-label">OpenAI API Key</label>
                <input
                  type="text"
                  className="form-control"
                  id="apiKey"
                  placeholder="Enter your OpenAI API key"
                  value={apiKey}
                  onChange={handleApiKeyChange}
                />
              </div>
              <div className="mb-3">
                <ul>
                  <li>An API key is required to use this app.</li>
                  <li>Don&apos;t have an OpenAPI key? <a href="https://platform.openai.com/" target="_blank" rel="noopener">Sign up</a> for access.</li>
                  <li>Don&apos;t have an DeepSeek API key? <a href="https://platform.deepseek.com/api_keys" target="_blank" rel="noopener">Sign up</a> for access.</li>
                  <li>In any moment you key is stored or saved on server, just in your browser for convenience.</li>
                </ul>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={toggleModal}>Close</button>
            </div>
          </div>
        </div>
      </div>
      <div className="content-wrapper">
        <div className="main-content">
          {!apiKey && <div className="alert alert-warning mt-2">
            <i>To summarize a new video please enter your OpenAI API key in the <a href='#' onClick={toggleModal}>options menu</a>.</i>
          </div>}
          {validationError && <div className="alert alert-danger mt-2">{validationError}</div>}
          
          {!videoId && <ul className='alert alert-info mt-2 list-unstyled'>
            <li> On the right panel click on video to show summary </li>
            <li> On the right panel click on video title to show a mini-player</li>
          </ul>
          } 
          {videoId && <h1 className='youtube-title'>{videoTitle} </h1>}
          {videoId && <VideoSummarizer videoId={videoId}
            onVideoTitleUpdate={handleVideoTitleUpdate}
            useChapters={useChapters}
            apiKey={apiKey}
            selectedModel={selectedModel}
            onVideoSummarized={() => setShouldFetchVideos(true)} />}
        </div>
        <VideoTitleList setVideoId={setVideoId} shouldFetchVideos={shouldFetchVideos} setShouldFetchVideos={setShouldFetchVideos} />
      </div>
    </div>
  );
}
