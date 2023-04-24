import { TranscriptData } from "./TranscriptData";

export interface ITranscriptRepository {
  create(Transcript: TranscriptData): Promise<void>;
  findByVideoId(videoId: string): Promise<TranscriptData | null>;
}
