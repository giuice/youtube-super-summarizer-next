
export interface ITranscriptRepository {
  create(transcript: TranscriptData): Promise<void>;
  findByVideoId(videoId: string): Promise<TranscriptData | null>;
  getAll(): Promise<TranscriptData[] | null>;
  update(summary: TranscriptData): Promise<void>;
  delete(videoId: string): Promise<void>;
}

export interface TranscriptData {
  id?: number;
  video_id: string;
  transcript: TranscriptEntry[];
  created_at?: Date;
}

export interface TranscriptEntry {
	duration: number;
	start: number;
	text: string;
}
