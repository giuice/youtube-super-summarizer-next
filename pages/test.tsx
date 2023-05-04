import getVideoData from "@/application/VideoDataService";
import { useState } from "react";
import { TranscriptData, TranscriptEntry } from "@/domain/transcript/Transcript";


const TestPage = () => {
	const [result, setResult] = useState<TranscriptEntry[] | null>(null);
	const [videoId, setVideoId] = useState('');

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setVideoId(e.target.value);
	  };

	const handleClick = async () => {

		await getVideoData.saveVideoTranscripts(videoId);
	};
	return (
	  <div>
		<h1>Test MongoDB</h1>
		<label htmlFor="input_id">
		<input id="input_id" placeholder="Enter YouTube URL" onChange={handleInputChange} className="form-control" type="text" value={videoId}  />
		</label>
		<button onClick={handleClick}>Click me to add data</button>
		{result && (
		  <div>
			<h2>Result:</h2>
			<pre>{JSON.stringify(result, null, 2)}</pre>
		  </div>
		)}
	  </div>
	);
  };

export default TestPage;