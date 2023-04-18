// src/repositories/TranscriptRepository.ts

export interface TranscriptData {
  video_id: string;
  json_data: string;
}

export interface TranscriptRepository {
  save(transcriptData: TranscriptData): Promise<void>;
  findByVideoId(video_id: string): Promise<TranscriptData | null>;
}
