import supabase from "./supabase";
import { SummaryData } from "@/domain/summary/SummaryData";
import { ISummaryRepository } from "@/domain/summary/ISummaryRepository";

export class SummaryRepositorySupabase implements ISummaryRepository {
  private readonly supabase = supabase;

  async create(summary: SummaryData): Promise<void> {
    try {
      const { error } = await this.supabase
        .from("summaries")
        .insert(summary)
        .single();

      if (error) {
        return Promise.reject(new Error(error.message));
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async findByVideoId(videoId: string): Promise<SummaryData | null> {
    try {
      const { data, error } = await this.supabase
        .from("summaries")
        .select("*")
        .eq("video_id", videoId)
        .single();
      if (!data) {
        return null;
      }
      if (error) {
        return Promise.reject(new Error(error));
      }
      return data as SummaryData;
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

export default SummaryRepositorySupabase;
