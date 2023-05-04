import supabase from "./supabase";
import { TranscriptData } from "@/domain/transcript/Transcript";
import { ITranscriptRepository } from "@/domain/transcript/Transcript";

export class TranscriptRepositorySupabase implements ITranscriptRepository {
  constructor() {}
  getAll(): Promise<TranscriptData[] | null> {
    throw new Error("Method not implemented.");
  }
  update(transcript: TranscriptData): Promise<void> {
    throw new Error("Method not implemented.");
  }
  delete(videoId: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  private readonly supabase = supabase;

  async create(transcript: TranscriptData): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('transcripts')
        .insert(transcript)
        .single();

      if (error) {
        return Promise.reject(new Error(error.message));
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async findByVideoId(videoId: string): Promise<TranscriptData | null> {
    try {
      const { data, error } = await this.supabase
        .from('transcripts')
        .select("*")
        .eq("video_id", videoId)
        .single();
      if (!data) {
        return null;
      }
      if (error) {
        return Promise.reject(new Error(error));
      }
      return data as TranscriptData;
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

export default TranscriptRepositorySupabase;
