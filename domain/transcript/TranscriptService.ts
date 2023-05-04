import { ITranscriptRepository, TranscriptData , TranscriptEntry} from "@/domain/transcript/Transcript";


export class TranscriptService {
	constructor(private readonly transcriptRepository: ITranscriptRepository) {}

	async create(transcript: TranscriptData): Promise<void> {
		await this.transcriptRepository.create(transcript);
	}

	async findByVideoId(videoId: string): Promise<TranscriptData | null> {
		return await this.transcriptRepository.findByVideoId(videoId);
	}
}
export default TranscriptService;