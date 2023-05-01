import { SummaryData } from "./SummaryData";

export interface ISummaryRepository {
  create(summary: SummaryData): Promise<void>;
  findByVideoId(videoId: string): Promise<SummaryData | null>;
}
