import { IVideoRepository } from "./IVideoRepository";
import { VideoData } from "./VideoData";
import VideoService from "./VideoService";

export class Video {
  constructor(
    videoId: string,
    private videoMetadata: VideoData,
    private videoRepository: IVideoRepository
  ) {}

  

  public createVideoMetadata = async () => {
    const vService = new VideoService(this.videoRepository);
    try {
      vService.create(this.videoMetadata);
    } catch (error) {
      throw new Error(
        `${error} Failed to create video metadata for ${this.videoMetadata}`
      );
    }
  };
}
export default Video;