import getVideoData from "@/application/VideoDataService";
import { Summaries } from "@/domain/summary/Summary";
import { useState } from "react";
import { InferGetServerSidePropsType } from 'next'
import { GetServerSideProps } from 'next'

const TestPage = () => {
	const [result, setResult] = useState<Summaries | null>(null);
	const handleClick = async () => {
	  try {
		const data = await getVideoData.getSummaries('1234243')
		setResult(data);
	  } catch (error) {
		console.error("Error:", error);
	  }
	};
	return (
	  <div>
		<h1>Test MongoDB</h1>
		<button onClick={handleClick}>Click me to test MongoDB</button>
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