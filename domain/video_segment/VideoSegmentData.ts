
export interface VideoSegmentData {
	id?: number;
	video_id: string;
	title?: string;
	start_time: number; // in milliseconds
	duration: number; // in milliseconds
	content: string;
	is_chapter: boolean;
	created_at?: Date;
  }