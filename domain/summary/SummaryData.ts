import { SummaryViewModel } from "@/domain/summary/Summary";

export interface SummaryData {
  id?: number;
  video_segment_id: number;
  content: string;
  model: string;
  created_at: Date;
}