import { SummaryType } from "@/types/Summary";

export interface SummaryData {
  video_id: string;
  json_text: SummaryType[];
  model: string;
  created_at: Date;
}
