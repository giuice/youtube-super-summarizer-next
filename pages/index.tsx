import React, { useState, useCallback, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { VideoSummarizer } from '@/components/VideoSummarizer';
import { faSearch, faBoxOpen } from '@fortawesome/free-solid-svg-icons';
import { VideoTitleList } from '@/components/VideoTitleList';
import { ThemeToggle } from '@/components/ThemeToggle';
import VideoDataService from '@/application/VideoDataService';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <section className="relative py-12 mb-12">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg -z-10" />
          
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Supercharge Your YouTube Experience!
            </h1>
            <p className="text-xl text-muted-foreground">
              Get concise summaries of your favorite videos in minutes
            </p>

            <div className="flex items-center gap-2 max-w-2xl mx-auto">
              <Input
                type="text"
                placeholder="Enter YouTube URL"
                value={url}
                onChange={handleInputChange}
                className="flex-1"
              />
              <Button 
                onClick={handleButtonClick} 
                disabled={!apiKey}
                className="whitespace-nowrap"
              >
                <FontAwesomeIcon icon={faSearch} className="mr-2" />
                Go!
              </Button>
              <ThemeToggle />
              <Button 
                variant="outline" 
                onClick={toggleModal}
              >
                <FontAwesomeIcon icon={faBoxOpen} className="mr-2" />
                Options
              </Button>
            </div>
          </div>
        </section>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Options</DialogTitle>
              <DialogDescription>
                Configure your summarization preferences
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="useChapters"
                  checked={useChapters}
                  onCheckedChange={(checked) => setUseChapters(checked as boolean)}
                />
                <label 
                  htmlFor="useChapters"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
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
                  onValueChange={setSelectedModel}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
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
                />
              </div>

              <Card>
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
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 min-w-0 space-y-4">
            {!apiKey && (
              <Alert>
                <AlertDescription>
                  To summarize a new video please enter your OpenAI API key in the{" "}
                  <button onClick={toggleModal} className="text-primary hover:underline">
                    options menu
                  </button>
                  .
                </AlertDescription>
              </Alert>
            )}

            {validationError && (
              <Alert variant="destructive">
                <AlertDescription>{validationError}</AlertDescription>
              </Alert>
            )}

            {!videoId && (
              <Alert>
                <AlertDescription>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>On the right panel click on video to show summary</li>
                    <li>On the right panel click on video title to show a mini-player</li>
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {videoId && (
              <>
                <h1 className="text-2xl font-bold">{videoTitle}</h1>
                <VideoSummarizer
                  videoId={videoId}
                  onVideoTitleUpdate={handleVideoTitleUpdate}
                  useChapters={useChapters}
                  apiKey={apiKey}
                  selectedModel={selectedModel}
                  onVideoSummarized={() => setShouldFetchVideos(true)}
                />
              </>
            )}
          </div>

          <div className="md:w-[300px] md:flex-none">
            <VideoTitleList
              setVideoId={setVideoId}
              shouldFetchVideos={shouldFetchVideos}
              setShouldFetchVideos={setShouldFetchVideos}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
