import { SummaryViewModel } from "@/domain/summary/Summary";

export class SummaryTable {
  constructor(
  public video_id: string,
  public summary: SummaryViewModel[],
  public model: string,
  public id?: number,
  public created_at?: Date) {}
}

export interface SummaryData {
  id?: number,
  video_id: string;
  summary: SummaryViewModel[];
  model: string;
  created_at: Date;
}
export default SummaryData;
