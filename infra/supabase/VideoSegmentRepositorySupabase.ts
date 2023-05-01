import { IVideoSegmentRepository } from "@/domain/video_segment/IVideoSegmentRepository";
import supabase from "./supabase";
import { VideoSegmentData } from "../../domain/video_segment/VideoSegmentData";

export class VideoSegmentRepositorySupabase implements IVideoSegmentRepository {
  private readonly supabase = supabase;

  async create(data: VideoSegmentData): Promise<void> {
    try {
      const { error } = await this.supabase
        .from("transcriptions")
        .insert({
          
          video_id: data.video_id,
          title: data.title,
          start_time: data.start_time, // in milliseconds
          duration: data.duration,  //in milliseconds
          content: data.content,
          is_chapter: data.is_chapter
        })
        .single();

      if (error) {
        return Promise.reject(new Error(error.message));
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async findByVideoId(videoId: string): Promise<VideoSegmentData[] | null> {
    try {
      const { data, error } = await this.supabase
        .from("transcriptions")
        .select("*")
        .eq("video_id", videoId)
        .single();

      if (!data) {
        return null;
      }
      if (error) {
        return Promise.reject(new Error(error));
      }
      return data as VideoSegmentData[];
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

export default VideoSegmentRepositorySupabase;
