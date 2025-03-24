import { NextApiRequest, NextApiResponse } from "next";
import { TranscriptRepositorySupabase } from "@/infra/supabase/TranscriptRepositorySupabase";
import { TranscriptData } from "@/domain/transcript/Transcript";
import { TranscriptService } from "@/domain/transcript/TranscriptService";
import { RepositoryFactory } from "@/utils/RepositoryFactory";
const transcriptService = RepositoryFactory.createTranscriptRepository();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

    try {
      const { videoId } = req.query;
      if (!videoId) {
        res.status(400).json({ error: "Video ID is required" });
        return;
      }
      const transcript: TranscriptData | null =
        await transcriptService.findByVideoId(videoId as string);
     
        
      res.status(200).json(transcript);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error creating transcript", error: error });
    }
  } 


