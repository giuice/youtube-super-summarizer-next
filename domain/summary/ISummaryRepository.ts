import { SummaryData } from "./SummaryData";

export interface ISummaryRepository {
  create(summary: SummaryData): Promise<void>;
  findByVideoId(videoId: string): Promise<SummaryData | null>;
  getAll(): Promise<SummaryData[] | null>;
  update(summary: SummaryData): Promise<void>;
  delete(videoId: string): Promise<void>;
}

