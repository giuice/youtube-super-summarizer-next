// src/repositories/SummaryRepository.ts

interface SummaryData {
	video_id: string;
	json_data: string;
  }
  
  export interface SummaryRepository {
	save(summaryData: SummaryData): Promise<void>;
	findByVideoId(video_id: string): Promise<SummaryData | null>;
  }
  