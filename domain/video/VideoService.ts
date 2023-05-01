import { IVideoRepository } from "./IVideoRepository";
import { VideoData } from "./VideoData";

export class VideoService {
	constructor(private readonly videoRepository: IVideoRepository) {}

	async create(video: VideoData): Promise<void> {
		await this.videoRepository.create(video);
	}

	async findByVideoId(videoId: string): Promise<VideoData | null> {
		return await this.videoRepository.findByVideoId(videoId);
	}

	async getAll(): Promise<VideoData[] | null> {
		return await this.videoRepository.getAll();
	}
}
export default VideoService;