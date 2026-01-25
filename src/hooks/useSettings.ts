import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { AppMode } from "../types"
import { open } from "@tauri-apps/plugin-dialog"
import { Store } from "@tauri-apps/plugin-store"

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

let tauriStorePromise: Promise<Store> | null = null

const getTauriStore = () => {
    if (!tauriStorePromise) {
        tauriStorePromise = Store.load("settings.json")
        console.log(tauriStorePromise);

    }
    return tauriStorePromise
}

const customStorage = {
    getItem: async (name: string): Promise<string | null> => {
        const store = await getTauriStore()
        const value = await store.get(name)
        return value ? JSON.stringify(value) : null
    },
    setItem: async (name: string, value: string): Promise<void> => {
        const store = await getTauriStore()
        await store.set(name, JSON.parse(value))
    },
    removeItem: async (name: string): Promise<void> => {
        const store = await getTauriStore()
        await store.delete(name)
    },
}
export const useSettings = create<SettingsStore>()(
    persist(
        (set) => ({
            isLoading: true,
            setIsLoading: (isLoading) => set({ isLoading }),

            appMode: "image-compression",
            updateAppMode: (mode) => set({ appMode: mode }),

            outputPaths: {
                imageCompression: null,
                videoConverter: null,
            },

            selectOutputPath: (type) => {
                open({ directory: true, multiple: false })
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
                        console.error(
                            `[useSettings] Failed to select ${type} directory:`,
                            error
                        )
                        alert("Error selecting output folder")
                    })
            },
        }),
        {
            name: "settings-storage",
            storage: createJSONStorage(() => customStorage),
            partialize: (state) =>
            ({
                outputPaths: state.outputPaths,
            } as Pick<SettingsStore, "outputPaths">),
        }
    )
)
