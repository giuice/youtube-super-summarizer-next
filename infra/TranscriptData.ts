import { TranscriptResponse } from "youtube-transcript";

export interface TranscriptData {
	video_id: string;
	json_text?: TranscriptResponse[] | null;
	created_at: Date;
  }