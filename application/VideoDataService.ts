import { Summaries, Summary, SummaryViewModel } from "@/domain/summary/Summary";
import { VideoData } from "@/domain/video/VideoData";
import Chapter from "@/domain/video_segment/Chapter";
import { TranscriptData, TranscriptEntry } from '@/domain/transcript/Transcript';
import ApiError from "@/utils/ApiError";
import axios, { AxiosResponse } from "axios";
import { TranscriptResponse } from "youtube-transcript";
import { VideoSegment } from "@/domain/video_segment/VideoSegment";
import VideoSegmentRepositorySupabase from "@/infra/supabase/VideoSegmentRepositorySupabase";
import VideoRepositorySupabase from "@/infra/supabase/VideoRepositorySupabase";
import SummaryService from "@/domain/summary/SummaryService";
import { SummaryChapterRepositorySupabase, SummaryTranscriptRepositorySupabase } from "@/infra/supabase/SummaryRepositorySupabase";
import { SummaryData } from "@/domain/summary/SummaryData";
import VideoService from "@/domain/video/VideoService";
import { OpenAI } from "langchain/llms/openai";
import { faL } from "@fortawesome/free-solid-svg-icons";


export class VideoDataService {
  protected static  readonly summaryChapterService = new SummaryService(new SummaryChapterRepositorySupabase);
  protected static readonly summayTranscriptService = new SummaryService(new SummaryTranscriptRepositorySupabase);
  protected static readonly videoService = new VideoService(new VideoRepositorySupabase());

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

  static async saveVideoMetadata(videoId: string): Promise<void> {
    const videoData = await this.getVideoMetadata(videoId);
    await this.videoService.create(videoData);
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
      console.error(
        `Failed to fetch transcript for video ${videoId}: ${error}`
      );
      return [];
    }
  }

  static async getChapters(videoId: string): Promise<Chapter[] | null> {
    try {
      const response: AxiosResponse<Chapter[] | { error: string }> =
        await axios.get(`/api/chapter?videoId=${videoId}`);

      if (response.status === 404 || response.status === 500) {
        return null;
      }

      return response.data as Chapter[];
    } catch (error) {
      console.error(`Failed to fetch chapters for video ${videoId}: ${error}`);
      return null;
    }
  }

  

  static async getSummaries(videoId: string): Promise<Summaries | null> {
    console.log("getSummaries");
    const chapter = await this.summaryChapterService.findByVideoId(videoId);
    console.log("chapter", chapter);
    const transcript = await this.summayTranscriptService.findByVideoId(videoId);
    console.log("transcript", transcript);
    if (chapter || transcript) {
      let summary: Summaries = {
        chapters: null,
        transcripts: null,
      };
  
      if (chapter) {
        summary.chapters = chapter.summary;
      }
      if (transcript) {
        summary.transcripts = transcript.summary;
      }
  
      return summary;
    }
  
    return null;
  }



  static async getVideoTranscripts(videoId: string): Promise<Summaries> {
    const transcript = await this.getVideoTranscript(videoId);
    //not waiting for the promise to resolve here, its not interesting to the user
    this.saveVideoTranscripts(videoId, transcript);
    const videoSegment = new VideoSegment();
    if (!transcript) {
      throw new Error(
        `Failed to fetch transcript for video ${videoId}. Please try later again.`
      );
    }
    let chapters = await this.getChapters(videoId);
    try {
      if (chapters && chapters !== null) {
        chapters = await videoSegment.mergeChaptersWithTranscriptAsync(
          chapters,
          transcript
        );
      }
    } catch (error) {
      console.error(
        `Failed to merge chapters with transcript for video ${videoId}: ${error}`
      );
    }
    const segTranscript = await videoSegment.segmentTranscriptByDuration(
      transcript
    );
    const segmentChapters = chapters
      ? await videoSegment.segmentChapters(chapters)
      : null;
    return {
      transcripts: segTranscript,
      chapters: chapters ? segmentChapters : null,
    };
  }

  static async checkApiKey(openAIApiKey: string): Promise<boolean> {
    try {
      const prompt = "Hello!";
      const response = await axios.post(
        'https://api.openai.com/v1/engines/ada/completions',
        {
          prompt: prompt,
          max_tokens: 15,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openAIApiKey}`,
          },
        }
      );
  
      // If the API call is successful, return true
      if (response.status === 200) {
        return true;
      }
    } catch (error) {
      // If an error occurs during the API call, return false
      return false;
    }
    return true;
  }

  static async saveVideoTranscripts(videoId: string, transcriptEntry: TranscriptEntry[]): Promise<void> {
    const res = await axios.get(`/api/transcripts/findByVideoId?videoId=${videoId}`);	
    if(res.data) {
    const transData : TranscriptData = {
			video_id: videoId,
			transcript: transcriptEntry,
			created_at: new Date() }
      try {
        const response = await axios.post('/api/transcripts/create', transData);
        return response.data;
      } catch (error) {
        throw new Error(`Failed to create summary: ${error}`);
      }
    }		
  }

  static async saveSummaryChapters(videoId: string,
    model:string,
    summaries: SummaryViewModel[]) {
      const summaryData: SummaryData = {
        video_id: videoId,
        model: model,
        summary: summaries,
        created_at: new Date(),
      }
      this.summaryChapterService.create(summaryData);
  }

  static async saveSummaryTranscripts(videoId: string,
    model:string,
    summaries: SummaryViewModel[]) {
      const summaryData: SummaryData = {
        video_id: videoId,
        model: model,
        summary: summaries,
        created_at: new Date(),
      }
      this.summayTranscriptService.create(summaryData);
  }
}

export default VideoDataService;
