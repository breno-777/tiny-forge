import { create } from "zustand"
import { FileType, GlobalFormat, SupportedFormat } from "../types"
import { getFormatFromExt, isAcceptedPath } from "../utils/handles"
import { convertFileSrc } from "@tauri-apps/api/core";
import { basename, extname } from "@tauri-apps/api/path";
import { stat } from "@tauri-apps/plugin-fs";

export type FileStore = {
    files: FileType[]
    ACCEPTED_EXTENSIONS: string[]
    globalFormat: GlobalFormat
    setGlobalFormat: (format: GlobalFormat) => void
    updateFileFormat: (id: string, format: SupportedFormat) => void
    updateFileStatus: (id: string, status: FileType["status"]) => void
    updateSize: (id: string, size: number) => void
    updateProgress: (id: string, progress: number) => void
    addFiles: (paths: string[]) => Promise<void>
    removeFile: (id: string) => void
    removeAllFiles: () => void
}

export const useFile = create<FileStore>((set, get) => ({
    files: [],
    ACCEPTED_EXTENSIONS: [".png", ".jpg", ".jpeg", ".webp"],
    globalFormat: "custom",

    setGlobalFormat: (format) =>
        set((state) => {
            if (format === "custom") {
                return { globalFormat: "custom" }
            }

            return {
                globalFormat: format,
                files: state.files.map((file) => ({
                    ...file,
                    outputFormat: format,
                })),
            }
        }),

    updateFileStatus: (id, status) => {
        set((state) => ({
            files: state.files.map((file) =>
                file.id === id ? { ...file, status } : file
            ),
        }))
    },

    updateFileFormat: (id, format) => {
        set((state) => ({
            globalFormat: "custom",
            files: state.files.map((file) =>
                file.id === id ? { ...file, outputFormat: format } : file
            ),
        }))
    },

    updateSize: (id, size) => {
        set((state) => ({
            files: state.files.map((file) =>
                file.id === id ? { ...file, size } : file
            ),
        }))
    },

    updateProgress: (id, progress) => {
        set((state) => ({
            files: state.files.map((file) =>
                file.id === id ? { ...file, progress } : file
            ),
        }))
    },

    addFiles: async (paths) => {
        const uniquePaths = Array.from(new Set(paths))
        const state = get()

        const cleanedFiles = state.files.filter(
            (file) => !uniquePaths.includes(file.path)
        )

        const newFilesPromises = uniquePaths.map(async (path) => {
            if (!isAcceptedPath(path)) {
                console.debug("[useFile] skipping unsupported path", path)
                return null
            }

            try {
                const [name, ext] = await Promise.all([basename(path), extname(path)])
                const metadata = await stat(path)
                const format = getFormatFromExt(ext)

                const file: FileType = {
                    id: crypto.randomUUID(),
                    name,
                    size: metadata.size ?? 0,
                    path,
                    inputFormat: format,
                    status: "pending",
                    outputFormat:
                        state.globalFormat === "custom"
                            ? format
                            : state.globalFormat,
                    useGlobalFormat: state.globalFormat !== "custom",
                    previewUrl: await convertFileSrc(path),
                    fromDialog: true,
                    progress: 0,
                    outputPath: null,
                }

                return file
            } catch (error) {
                console.error("Failed to process:", path, error)
                return null
            }
        })

        const results = await Promise.all(newFilesPromises)
        const newFiles = results.filter((file): file is FileType => file !== null)

        if (newFiles.length > 0) {
            set({
                files: [...cleanedFiles, ...newFiles],
            })
        }
    },

    removeFile: (id) => {
        set((state) => ({
            files: state.files.filter((file) => file.id !== id),
        }))
    },

    removeAllFiles: () => {
        set({ files: [] })
    },
}))

export const useFileStats = () => {
    return useFile((state) => {
        const files = state.files
        return {
            pending: files.filter(f => f.status === "pending").length,
            processing: files.filter(f => f.status === "compressing").length,
            completed: files.filter(f => f.status === "done").length,
            error: files.filter(f => f.status === "error").length,
            total: files.length,
            hasActive: files.some(f => f.status === "compressing")
        }
    })
}
