import Chapter from "@/domain/video_segment/Chapter";
import { TranscriptEntry } from "@/domain/transcript/Transcript";

export interface TranscriptDto {
	transcripts: TranscriptEntry[];
	chapters: Chapter[] | null;
}