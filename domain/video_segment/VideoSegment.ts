import { IVideoSegmentRepository } from "./IVideoSegmentRepository";
import { TranscriptEntry } from "./TranscriptEntry";
import Chapter from "./Chapter";
import { SummaryViewModel } from "../summary/Summary";

export class VideoSegment {
  protected formatDuration = (duration: number): string => {
    const minutes = Math.floor(duration / 60000);
    const seconds = ((duration % 60000) / 1000).toFixed(0);
    return `${minutes}:${Number(seconds) < 10 ? "0" : ""}${seconds}`;
  };

  protected formatDurationAsync = async (duration: number): Promise<string> => {
    const minutes = Math.floor(duration / 60000);
    const seconds = ((duration % 60000) / 1000).toFixed(0);
    return `${minutes}:${Number(seconds) < 10 ? "0" : ""}${seconds}`;
  };

  //

  public async segmentChapters(
    chapters: Chapter[]
  ): Promise<SummaryViewModel[]> {
    const totalTime = Math.max(...chapters.map((chapter) => chapter.time));

    return chapters.map((chapter, index) => {
      const nextChapterTime =
        index < chapters.length - 1 ? chapters[index + 1].time : null;
      const duration = nextChapterTime
        ? nextChapterTime - chapter.time
        : totalTime - chapter.time;

      const minuteStarting = chapter.time / 60;
      const formattedDuration = (duration / 60).toFixed(2);

      return {
        text: chapter.content,
        minuteStarting: minuteStarting,
        duration: duration,
        formattedDuration: `${minuteStarting.toFixed(2)} - ${(
          minuteStarting + parseFloat(formattedDuration)
        ).toFixed(2)}`,
        title: chapter.title,
      };
    }, []);
  }

  public async segmentTranscriptByDuration(
    transcript: TranscriptEntry[]
  ): Promise<SummaryViewModel[]> {
    const segmentDuration = 5 * 60 * 1000; // 5 minutes in milliseconds
    const initialAccumulator = {
      results: [] as SummaryViewModel[],
      currentIntervalStart: 0,
      currentIntervalText: "",
      currentDuration: 0,
    };

    const finalAccumulator = transcript.reduce((accumulator, item) => {
      while (item.start >= accumulator.currentIntervalStart + segmentDuration) {
        accumulator.results.push({
          text: accumulator.currentIntervalText.trim(),
          minuteStarting: accumulator.currentIntervalStart / 60000,
          duration: segmentDuration,
          formattedDuration: this.formatDuration(segmentDuration),
        });

        accumulator.currentIntervalStart += segmentDuration;
        accumulator.currentIntervalText = "";
        accumulator.currentDuration = 0;
      }

      accumulator.currentIntervalText += " " + item.text;
      accumulator.currentDuration += item.duration;

      return accumulator;
    }, initialAccumulator);

    if (finalAccumulator.currentIntervalText.trim()) {
      finalAccumulator.results.push({
        text: finalAccumulator.currentIntervalText.trim(),
        minuteStarting: finalAccumulator.currentIntervalStart / 60000,
        duration: finalAccumulator.currentDuration,
        formattedDuration: this.formatDuration(
          finalAccumulator.currentDuration
        ),
      });
    }

    return finalAccumulator.results;
  }

  public async mergeChaptersWithTranscriptAsync(
    chapters: Chapter[],
    transcript: TranscriptEntry[]
  ): Promise<Chapter[]> {
    const transcriptInSeconds = transcript.map((entry) => ({
      duration: entry.duration / 1000,
      start: entry.start / 1000,
      text: entry.text,
    }));

    const mergedChapters = chapters.map((chapter, i) => {
      const chapterEnd =
        i + 1 < chapters.length ? chapters[i + 1].time : Infinity;

      const content = transcriptInSeconds
        .filter(
          (transcription) =>
            chapter.time <= transcription.start &&
            transcription.start < chapterEnd
        )
        .map((transcription) => transcription.text)
        .join(" ");

      return { ...chapter, content };
    });

    return mergedChapters;
  }

  public mergeChaptersWithTranscript = (
    chapters: Chapter[],
    transcript: TranscriptEntry[]
  ): Chapter[] => {
    const transcriptInSeconds = transcript.map((entry) => ({
      duration: entry.duration / 1000,
      start: entry.start / 1000,
      text: entry.text,
    }));

    for (let i = 0; i < chapters.length; i++) {
      chapters[i].content = "";
      const chapterEnd =
        i + 1 < chapters.length ? chapters[i + 1].time : Infinity;
      for (let j = 0; j < transcriptInSeconds.length; j++) {
        const transcription = transcriptInSeconds[j];
        if (
          chapters[i].time <= transcription.start &&
          transcription.start < chapterEnd
        ) {
          chapters[i].content += transcription.text + " ";
        } else if (transcription.start >= chapterEnd) {
          break;
        }
      }
    }

    return chapters;
  };
}
