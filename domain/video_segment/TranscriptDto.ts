import Chapter from "./Chapter";
import { TranscriptEntry } from "./TranscriptEntry";

export interface TranscriptDto {
	transcripts: TranscriptEntry[];
	chapters: Chapter[] | null;
}