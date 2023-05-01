import { Summaries, SummaryViewModel } from "@/domain/summary/Summary";
import { VideoData } from "@/domain/video/VideoData";
import Chapter from "@/domain/video_segment/Chapter";
import { TranscriptEntry } from "@/domain/video_segment/TranscriptEntry";
import ApiError from "@/utils/ApiError";
import axios, { AxiosResponse } from "axios";
import { TranscriptResponse } from "youtube-transcript";
import { VideoSegment } from "@/domain/video_segment/VideoSegment";
import VideoSegmentRepositorySupabase from "@/infra/supabase/VideoSegmentRepositorySupabase";


export class GetVideoData {
    static async getVideoMetadata(videoId: string): Promise<VideoData> {
      try {
        const response = await axios.get(
          `/api/youtube_metadata?videoId=${videoId}`
        );
        return response.data as VideoData;
      } catch (error) {
        throw new Error(
          `${error} Failed to fetch youtube metadata for ${videoId}`
        );
      }
    }
  
    static async getVideoTranscript(videoId: string): Promise<TranscriptEntry[]> {
      try {
        const response = await axios.get(`/api/transcript?videoId=${videoId}`);
        if (response.status !== 200) {
          throw new ApiError(response.status, "Failed to fetch transcript");
        }
        const transcript = response.data as TranscriptResponse[];
        return transcript.map((entry: TranscriptResponse) => {
          return {
            text: entry.text,
            start: entry.offset,
            duration: entry.duration,
          } as TranscriptEntry;
        });
      } catch (error) {
        console.error(`Failed to fetch transcript for video ${videoId}: ${error}`);
        return [];
      }
    }
  
    static async getChapters(videoId: string): Promise<Chapter[] | null> {
      try {
        const response: AxiosResponse<Chapter[] | { error: string }> = await axios.get(`/api/chapter?videoId=${videoId}`);
  
        if (response.status === 404 || response.status === 500) {
          return null;
        }
  
        return response.data as Chapter[];
      } catch (error) {
        console.error(`Failed to fetch chapters for video ${videoId}: ${error}`);
        return null;
      }
    }
  
    static async getVideoTranscripts(videoId: string): Promise<Summaries> {
      const transcript = await this.getVideoTranscript(videoId);
      const videoSegment = new VideoSegment(videoId, new VideoSegmentRepositorySupabase());
      if(!transcript){
        throw new Error(`Failed to fetch transcript for video ${videoId}. Please try later again.`);
      }
      let chapters = null; // await this.getChapters(videoId);
      try {
        if (chapters && chapters !== null) {
          chapters = await videoSegment.mergeChaptersWithTranscriptAsync(chapters, transcript);
        }
      } catch (error) {
        console.error(`Failed to merge chapters with transcript for video ${videoId}: ${error}`);
      }
      const segTranscript = await videoSegment.segmentTranscriptByDuration(transcript);
      const segmentChapters = chapters? await videoSegment.segmentChapters(chapters): null;
      return { transcripts: segTranscript, chapters: chapters? segmentChapters: null };
    }



  
   
  }
  
  export default GetVideoData;
  
 