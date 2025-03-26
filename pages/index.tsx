import React, { useState, useCallback, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { VideoSummarizer } from '@/components/VideoSummarizer';
import { faSearch, faBoxOpen } from '@fortawesome/free-solid-svg-icons';
import { VideoTitleList } from '@/components/VideoTitleList';
import VideoDataService from '@/application/VideoDataService';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Settings } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Hero } from "@/components/ui/hero";
import { VideoListCard } from '@/components/VideoListCard';

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
    localStorage.setItem('selected_model', apiKey);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUseChapters(e.target.checked);
  };

  const handleSelectChange = (value: string) => {
    // First save the current API key for the current model before changing models
    if (apiKey && apiKey.trim() !== '') {
      const currentModelKeyName = `${selectedModel}_api_key`;
      localStorage.setItem(currentModelKeyName, apiKey);
    }
    
    // Now change the selected model
    setSelectedModel(value);
    localStorage.setItem('selected_model', value);
    
    // Load the API key specific to the newly selected model
    const newModelKeyName = `${value}_api_key`;
    const storedApiKey = localStorage.getItem(newModelKeyName);
    
    if (storedApiKey) {
      setApiKey(storedApiKey);
    } else {
      // Only clear the API key if there's no saved key for the new model
      setApiKey('');
    }
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
      setValidationError(`Please enter a valid ${selectedModel} API key`);
      setApiKey('');
      return false;
    } else {
      setValidationError('');
      // Save the API key to localStorage with model-specific name
      const modelKeyName = `${selectedModel}_api_key`;
      localStorage.setItem(modelKeyName, apiKey);
      return true;
    }
  }, [apiKey, selectedModel]);

  useEffect(() => {
    // Get the selected model from localStorage
    const storedModel = localStorage.getItem('selected_model');
    
    if (storedModel) {
      setSelectedModel(storedModel);
      
      // Get the API key specific to the retrieved model
      const modelKeyName = `${storedModel}_api_key`;
      const storedApiKey = localStorage.getItem(modelKeyName);
      
      if (storedApiKey) {
        setApiKey(storedApiKey);
      } else {
        // Clear API key if no stored key exists for this model
        setApiKey('');
      }
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
    } else if (!hasapi) {
      setValidationError(`Please enter a valid ${selectedModel} key, or choose one already summarized video from the list of titles.`);
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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
       
        <Hero onButtonClick={handleButtonClick} onInputChange={handleInputChange}
          toggleModal={toggleModal} url={url} isApiKeyValid />

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="glass-card sm:max-w-md animate-scale-in">
            <DialogHeader>
              <DialogTitle>Settings</DialogTitle>
              <DialogDescription>
                Configure your summarization preferences
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-5 py-4">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="useChapters"
                  checked={useChapters}
                  onCheckedChange={(checked) => setUseChapters(checked as boolean)}
                  className="data-[state=checked]:bg-primary"
                />
                <label
                  htmlFor="useChapters"
                  className="text-sm font-medium leading-none"
                >
                  Use Chapters
                </label>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Use model to summarize:
                </label>
                <Select
                  value={selectedModel}
                  onValueChange={handleSelectChange}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass-card">
                    <SelectItem value="gpt-4o-mini">gpt-4o-mini</SelectItem>
                    <SelectItem value="deepseek-chat">deepseek-chat</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  OpenAI API Key
                </label>
                <Input
                  type="text"
                  placeholder="Enter your OpenAI API key"
                  value={apiKey}
                  onChange={handleApiKeyChange}
                  className="glass-input"
                />
              </div>

              <Card className="glass-card border-border/40">
                <CardContent className="pt-6">
                  <ul className="list-disc pl-4 space-y-2 text-sm text-muted-foreground">
                    <li>An API key is required to use this app.</li>
                    <li>Don&apos;t have an OpenAPI key? <a href="https://platform.openai.com/" target="_blank" rel="noopener" className="text-primary hover:underline">Sign up</a> for access.</li>
                    <li>Don&apos;t have a DeepSeek API key? <a href="https://platform.deepseek.com/api_keys" target="_blank" rel="noopener" className="text-primary hover:underline">Sign up</a> for access.</li>
                    <li>Your key is stored only in your browser for convenience.</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsModalOpen(false)}
                className="glass-card hover:bg-secondary/50">
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className="container max-w-6xl mx-auto mt-8">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 min-w-0 space-y-4 animate-fade-in animation-delay-300">
              {!apiKey && (
                <Alert className="glass-card border-border/30">
                  <AlertDescription>
                    To summarize a new video please enter your OpenAI API key in the{" "}
                    <button onClick={toggleModal} className="text-primary hover:underline">
                      settings menu
                    </button>.
                  </AlertDescription>
                </Alert>
              )}

              {validationError && (
                <Alert variant="destructive" className="animate-fade-in">
                  <AlertDescription>{validationError}</AlertDescription>
                </Alert>
              )}

              {!videoId && !validationError && (
                <div className="space-y-4">
                  <Alert className="glass-card border-border/30">
                    <AlertDescription>
                      <ul className="list-disc pl-4 space-y-1">
                        <li>Paste a YouTube URL above or select a video from the list</li>
                        <li>Click on a video title to see its summary</li>
                      </ul>
                    </AlertDescription>
                  </Alert>

                  <div className="flex items-center justify-center h-[300px] glass-card rounded-lg border-dashed border-2 border-border/50">
                    <div className="text-center p-6">
                      <Search size={40} className="mx-auto text-muted-foreground mb-4 opacity-50" />
                      <h3 className="text-lg font-medium">No video selected</h3>
                      <p className="text-muted-foreground mt-2">Enter a YouTube URL and click Summarize</p>
                    </div>
                  </div>
                </div>
              )}

              {videoId && (
                <Card className="glass-card overflow-hidden animate-scale-in">
                  <CardContent className="p-0">
                    <div className="p-6">
                      <h1 className="text-2xl font-bold">{videoTitle}</h1>
                      <div className="h-[2px] w-16 bg-primary/60 mt-2 mb-4"></div>
                      <VideoSummarizer
                        videoId={videoId}
                        onVideoTitleUpdate={handleVideoTitleUpdate}
                        useChapters={useChapters}
                        apiKey={apiKey}
                        selectedModel={selectedModel}
                        onVideoSummarized={() => setShouldFetchVideos(true)}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="lg:w-[320px] lg:flex-none animate-fade-in animation-delay-600">
              <VideoListCard title="Recently Summarized">
                <VideoTitleList
                  setVideoId={setVideoId}
                  shouldFetchVideos={shouldFetchVideos}
                  setShouldFetchVideos={setShouldFetchVideos}
                />
              </VideoListCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
