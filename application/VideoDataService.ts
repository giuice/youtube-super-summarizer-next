import { Summaries, Summary, SummaryViewModel } from "@/domain/summary/Summary";
import { VideoData } from "@/domain/video/VideoData";
import Chapter from "@/domain/video_segment/Chapter";
import { TranscriptData, TranscriptEntry } from '@/domain/transcript/Transcript';
import ApiError from "@/utils/ApiError";
import axios, { AxiosResponse } from "axios";
import { TranscriptResponse } from "youtube-transcript";
import { VideoSegment } from "@/domain/video_segment/VideoSegment";
import { SummaryData } from "@/domain/summary/SummaryData";


export class VideoDataService {
  // Use the RepositoryFactory to get repositories
  // protected static readonly summaryChapterService = new SummaryService(
  //   RepositoryFactory.createSummaryChapterRepository()
  // );

  // protected static readonly summayTranscriptService = new SummaryService(
  //   RepositoryFactory.createSummaryTranscriptRepository()
  // );

  // protected static readonly videoService = new VideoService(
  //   RepositoryFactory.createVideoRepository()
  // );

  static async getVideoMetadata(videoId: string): Promise<VideoData> {
    try {
      const response = await axios.get(
        `/api/youtube_metadata?videoId=${videoId}`
      );
      console.log('response.data', response.data);
      return response.data as VideoData;
    } catch (error) {
      throw new Error(
        `${error} Failed to fetch youtube metadata for ${videoId}`
      );
    }
  }

  static async saveVideoMetadata(videoId: string): Promise<void> {
    const videoData = await this.getVideoMetadata(videoId);
    try {
      
      await axios.post('/api/videos/create', videoData);
    } catch (error) {
      console.error(`Failed to create video metadata: ${error}`);
      throw new Error(`Failed to create video metadata: ${error}`);
    }
  }

  static async getVideoTranscript(videoId: string): Promise<TranscriptEntry[]> {
    try {
      const response = await axios.get(`/api/transcript?videoId=${videoId}`);
      if (response.status !== 200) {
        throw new ApiError(response.status, "Failed to fetch transcript");
      }
      const transcript = response.data as TranscriptResponse[];
      console.log('transcript first', transcript);
      const entry = transcript.map((entry: TranscriptResponse) => {
        return {
          text: entry.text,
          start: entry.offset,
          duration: entry.duration,
        } as TranscriptEntry;
      });
      console.log('entry', entry);
      return entry;
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
        console.log(`Failed to fetch chapters for video ${videoId} }`);
        return null;
      }

      return response.data as Chapter[];
    } catch (error) {
      console.error(`Failed to fetch chapters for video ${videoId}: ${error}`);
      return null;
    }
  }

  static async getSummaries(videoId: string): Promise<Summaries | null> {
    const chapterResponse = await axios.get(`/api/summary_chapters/findByVideoId?videoId=${videoId}`);
    const chapter = chapterResponse.data;
    console.log("chapter", chapter);

    const transcriptResponse = await axios.get(`/api/summary_transcripts/findByVideoId?videoId=${videoId}`);
    const transcript = transcriptResponse.data;
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
    // First ensure video metadata exists
    //await this.saveVideoMetadata(videoId);
    
    const transcript = await this.getVideoTranscript(videoId);
    if(!transcript || transcript.length === 0) {
      throw new Error(`Failed to fetch transcript for video ${videoId}. Maybe  Please try later again.`);
    }
    await this.saveVideoTranscripts(videoId, transcript);
    const videoSegment = new VideoSegment();
    if (!transcript) {
      throw new Error(
        `Failed to fetch transcript for video ${videoId}. Please try later again.`
      );
    }
    let chapters = await this.getChapters(videoId);
    try {
      if (chapters && chapters !== null) {
        const chaptersWithContent = await videoSegment.mergeChaptersWithTranscriptAsync(
          chapters,
          transcript
        );
        chapters = videoSegment.mergeShortChapters(chaptersWithContent, 60);
      }
    } catch (error) {
      console.error(
        `Failed to merge chapters with transcript for video ${videoId}: ${error}`
      );
    }
    const segTranscript = await videoSegment.segmentTranscriptByDuration(
      transcript
    );
    console.log("segTranscript", segTranscript);
    const segmentChapters = chapters
      ? await videoSegment.segmentChapters(chapters)
      : null;
    return {
      transcripts: segTranscript,
      chapters: chapters ? segmentChapters : null,
    };
  }

  static async checkApiKey(apiKey: string, modelName: string): Promise<boolean> {
    try {
      // Don't proceed if no API key provided
      if (!apiKey || apiKey.trim() === '') {
        return false;
      }
      
      // We'll do a check based on model type
      if (modelName.includes('gpt')) {
        // Check OpenAI API key
        const response = await fetch('/api/check-api-key', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ apiKey, modelName }),
        });
        return response.ok;
      } else if (modelName.includes('deepseek')) {
        // Check DeepSeek API key
        const response = await fetch('/api/check-deepseek-key', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ apiKey, modelName }),
        });
        return response.ok;
      }
      
      return false;
    } catch (error) {
      console.error('Error checking API key:', error);
      return false;
    }
  }

  static async saveVideoTranscripts(videoId: string, transcriptEntry: TranscriptEntry[]): Promise<void> {
    const res = await axios.get(`/api/transcripts/findByVideoId?videoId=${videoId}`);
    console.log('res transcript get 2', res);
    if (!res.data) {
      const transData: TranscriptData = {
        video_id: videoId,
        transcript: transcriptEntry,
        created_at: new Date()
      }
      try {
        const response = await axios.post('/api/transcripts/create', transData);
        return response.data;
      } catch (error) {
        throw new Error(`Failed to create summary: ${error}`);
      }
    }
  }

  static async saveSummaryChapters(videoId: string,
    model: string,
    summaries: SummaryViewModel[]) {
    const summaryData: SummaryData = {
      video_id: videoId,
      model: model,
      summary: summaries,
      created_at: new Date(),
    }
    try {
        
        const response = await axios.post('/api/summary_chapters/create', summaryData);
        return response.data;
      } catch (error) {
        console.error(`Failed to create summary chapter: ${error}`);
        throw new Error(`Failed to create summary chapter: ${error}`);
      }
  }

  static async saveSummaryTranscripts(videoId: string,
    model: string,
    summaries: SummaryViewModel[]) {
    const summaryData: SummaryData = {
      video_id: videoId,
      model: model,
      summary: summaries,
      created_at: new Date(),
    }
    try {
      
      const response = await axios.post('/api/summary_transcripts/create', summaryData);
      return response.data;
    } catch (error) {
      console.error(`Failed to create summary transcript: ${error}`);
      throw new Error(`Failed to create summary transcript: ${error}`);
    }
  }
}

export default VideoDataService;
