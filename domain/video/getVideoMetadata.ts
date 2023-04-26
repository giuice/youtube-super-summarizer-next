import { VideoData } from "@/infra/VideoData";
import VideoService from "@/infra/services/VideoService";
import VideoRepositorySupabase from "@/infra/supabase/VideoRepositorySupabase";
import axios from "axios";

const getVideoMetadata = async (videoId: string): Promise<VideoData> => {	
	  
  try {
	const response = await axios.get(`/api/youtube_metadata?videoId=${videoId}`);
	return response.data as VideoData;
  } catch (error) {
	throw new Error(`${error} Failed to fetch youtube metadata for ${videoId}`);
  }
}

const  createVideoMetadata = async (videoId: string) => {
	  const videoMetadata = await getVideoMetadata(videoId);
	  const vRepository = new VideoRepositorySupabase();
	  const vService = new VideoService(vRepository);
	 try { 
	  vService.create(videoMetadata);
	 } catch (error) {
		 throw new Error(`${error} Failed to create video metadata for ${videoMetadata}`);
	 }
}

export default createVideoMetadata;