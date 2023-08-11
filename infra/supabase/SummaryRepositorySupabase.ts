import supabase from "./supabase";
import { SummaryData } from "@/domain/summary/SummaryData";
import { ISummaryRepository } from "@/domain/summary/ISummaryRepository";

export class SummaryRepositorySupabase implements ISummaryRepository {
  constructor(private summaryTable: string) {}
  getAll(): Promise<SummaryData[] | null> {
    throw new Error("Method not implemented.");
  }
  update(summary: SummaryData): Promise<void> {
    throw new Error("Method not implemented.");
  }
  delete(videoId: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  private readonly supabase = supabase;

  async create(summary: SummaryData): Promise<void> {
    try {
      const { error } = await this.supabase
        .from(this.summaryTable)
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
        .from(this.summaryTable)
        .select("*")
        .eq("video_id", videoId)
        .single();
      if (!data) {
        return null;
      }
      if (error) {
        return Promise.reject(new Error(error.message));
      }
      return data as SummaryData;
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

export default SummaryRepositorySupabase;

export class SummaryChapterRepositorySupabase extends SummaryRepositorySupabase {
  constructor() {
super("summary_chapters");
}
}

export class SummaryTranscriptRepositorySupabase extends SummaryRepositorySupabase {
constructor() {
super("summary_transcripts");
}
}