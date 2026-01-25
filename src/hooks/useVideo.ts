import { create } from "zustand"
import { SupportedVideoFormat, SupportedVideoResolution } from "../types";

export type VideoStore = {
    videoFormat: SupportedVideoFormat;
    videoResolution: SupportedVideoResolution;
    convertingVideo: boolean;
    convertingVideoUrl: string;

    updateVideoFormat: (format: SupportedVideoFormat) => void;
    updateVideoResolution: (format: SupportedVideoResolution) => void;
    setConvertingVideo: (value: boolean) => void;
    setConvertingVideoUrl: (value: string) => void;
    updateFileStatus: (id: string, status: string) => void;
    updateProgress: (id: string, progress: number) => void;
};

export const useVideo = create<VideoStore>((set) => ({
    videoFormat: "mp3",
    videoResolution: "720",
    convertingVideo: false,
    convertingVideoUrl: "",


    updateVideoFormat: (format) => {
        set(() => ({
            videoFormat: format,
        }));
    },

    updateVideoResolution: (resolution) => {
        set(() => ({
            videoResolution: resolution,
        }));
    },
    setConvertingVideo: (value) => {
        set(() => ({
            convertingVideo: value,
        }));
    },
    setConvertingVideoUrl: (value) => {
        set(() => ({
            convertingVideoUrl: value,
        }));
    },

    updateFileStatus: (_id, _status) => {
        set((state) => ({
            // se você tiver um mapa de arquivos, atualize aqui
            // por enquanto pode ser um stub, só para compilar:
            ...state,
        }));
    },

    updateProgress: (_id, _progress) => {
        set((state) => ({
            // idem, ajuste quando implementar progresso real
            ...state,
        }));
    },
}));
