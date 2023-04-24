import supabase from "./supabase";
import { VideoData } from "../VideoData";
import { IVideoRepository } from "../IVideoRepository";

export class VideoRepositorySupabase implements IVideoRepository {
  

  private readonly supabase = supabase;


  async getAll(): Promise<VideoData[] | null> {
	try {
		const { data, error } = await this.supabase
		  .from("videos")
		  .select("*")
		  .order("created_at", { ascending: false })
		  .limit(3);
		if (!data) {
		  return null;
		}
		if (error) {
		  return Promise.reject(new Error(error));
		}
		return data as VideoData[];
	  } catch (error) {
		return Promise.reject(error);
	  }
  }

  async create(video: VideoData): Promise<void> {
    try {
      const { error } = await this.supabase
        .from("videos")
        .insert(video)
        .single();

      if (error) {
        return Promise.reject(new Error(error.message));
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async findByVideoId(videoId: string): Promise<VideoData | null> {
    try {
      const { data, error } = await this.supabase
        .from("videos")
        .select("*")
        .eq("video_id", videoId)
        .single();
      if (!data) {
        return null;
      }
      if (error) {
        return Promise.reject(new Error(error));
      }
      return data as VideoData;
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

export default VideoRepositorySupabase;
