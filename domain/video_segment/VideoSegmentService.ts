import { IVideoSegmentRepository } from "./IVideoSegmentRepository";
import { VideoSegmentData } from "./VideoSegmentData";

export class VideoSegmentService {
	constructor(private readonly VideoSegmentRepository: IVideoSegmentRepository) {}

	async create( Transcript: VideoSegmentData): Promise<void> {
		await this.VideoSegmentRepository.create(Transcript);
	}

	async findByVideoId(videoId: string): Promise<VideoSegmentData[] | null> {
		return await this.VideoSegmentRepository.findByVideoId(videoId);
	}
}
export default VideoSegmentService;