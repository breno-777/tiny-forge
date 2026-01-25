import { create } from "zustand"
import { AppMode } from "../types"
import { open } from "@tauri-apps/plugin-dialog"

type OutputPaths = {
    imageCompression: string | null
    videoConverter: string | null
}

export type SettingsStore = {
    isLoading: boolean
    setIsLoading: (isLoading: boolean) => void

    appMode: AppMode
    updateAppMode: (mode: AppMode) => void

    outputPaths: OutputPaths
    selectOutputPath: (type: keyof OutputPaths) => void
}

export const useSettings = create<SettingsStore>((set) => ({
    isLoading: true,
    setIsLoading: (isLoading) => set({ isLoading }),

    appMode: "image-compression",
    updateAppMode: (mode) => set({ appMode: mode }),

    outputPaths: {
        imageCompression: null,
        videoConverter: null,
    },

    selectOutputPath: (type) => {
        open({
            directory: true,
            multiple: false,
        })
            .then((selected) => {
                if (typeof selected === "string") {
                    set((state) => ({
                        outputPaths: {
                            ...state.outputPaths,
                            [type]: selected,
                        },
                    }))
                    console.debug(`[useSettings] ${type} path selected:`, selected)
                } else {
                    console.debug(`[useSettings] No ${type} directory selected`)
                }
            })
            .catch((error) => {
                console.error(`[useSettings] Failed to select ${type} directory:`, error)
                alert("Error selecting output folder")
            })
    },
}))
