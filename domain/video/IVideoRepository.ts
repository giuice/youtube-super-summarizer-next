import { VideoData } from "./VideoData";

export interface IVideoRepository {
  create(video: VideoData): Promise<void>;
  findByVideoId(videoId: string): Promise<VideoData | null>;
  getAll(): Promise<VideoData[] | null>;
}
