import { ISummaryRepository } from "../ISummaryRepository";
import { SummaryData } from "../SummaryData";

export class SummaryService {
	constructor(private readonly summaryRepository: ISummaryRepository) {}

	async create(summary: SummaryData): Promise<void> {
		await this.summaryRepository.create(summary);
	}

	async findByVideoId(videoId: string): Promise<SummaryData | null> {
		return await this.summaryRepository.findByVideoId(videoId);
	}
}
export default SummaryService;