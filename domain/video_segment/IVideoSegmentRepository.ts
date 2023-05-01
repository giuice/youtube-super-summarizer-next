import { VideoSegmentData } from "./VideoSegmentData";

export interface IVideoSegmentRepository {
  create(VideoSegment: VideoSegmentData): Promise<void>;
  findByVideoId(videoId: string): Promise<VideoSegmentData[] | null>;
}
