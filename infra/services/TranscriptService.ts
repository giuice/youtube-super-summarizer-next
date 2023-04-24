import { ITranscriptRepository } from "../ITranscriptRepository";
import { TranscriptData } from "../TranscriptData";

export class TranscriptService {
	constructor(private readonly TranscriptRepository: ITranscriptRepository) {}

	async create( Transcript: TranscriptData): Promise<void> {
		await this.TranscriptRepository.create(Transcript);
	}

	async findByVideoId(videoId: string): Promise<TranscriptData | null> {
		return await this.TranscriptRepository.findByVideoId(videoId);
	}
}
export default TranscriptService;