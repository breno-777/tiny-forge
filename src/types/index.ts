import React from "preact/compat";

export type AppMode = "image-compression" | "video-converter" | "settings";

export interface ModeConfig {
  id: AppMode;
  label: string;
  icon: string;
  component: React.FC<any>;
}



export type SupportedFormat = "png" | "jpeg" | "webp";
export type GlobalFormat = SupportedFormat | "custom"
export type FileType = {
  id: string;
  name: string;
  size: number;
  path: string;
  outputPath?: string | null
  status: "pending" | "compressing" | "done" | "error";
  inputFormat: SupportedFormat;
  outputFormat: SupportedFormat;
  useGlobalFormat: boolean,
  previewUrl: string;
  fromDialog?: boolean;
  progress?: number;
};


export const SUPPORTED_VIDEO_RESOLUTIONS = ["720", "1080", "2160"] as const;
export type SupportedVideoResolution = (typeof SUPPORTED_VIDEO_RESOLUTIONS)[number];
export const SUPPORTED_VIDEO_FORMATS = ["mp3", "mp4", "webm", "mkv"] as const;
export type SupportedVideoFormat = (typeof SUPPORTED_VIDEO_FORMATS)[number];
export type VideoType = {
  id: string;
  name: string;
  size: number;
  path: string;
  outputPath?: string | null
  status: "pending" | "converting" | "done" | "error";
  outputFormat: SupportedFormat;
  progress?: number;
};
