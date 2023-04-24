import { ITranscriptRepository } from "@/infra/ITranscriptRepository";
import supabase from "./supabase";
import { TranscriptData } from "../TranscriptData";

export class TranscriptRepositorySupabase implements ITranscriptRepository {
  private readonly supabase = supabase;

  async create(Transcript: TranscriptData): Promise<void> {
    try {
      const { error } = await this.supabase
        .from("transcriptions")
        .insert({
          video_id: Transcript.video_id,
          json_text: Transcript.json_text,
        })
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
        .from("transcriptions")
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
