import { invoke } from "@tauri-apps/api/core"
import { FileType, SupportedFormat } from "../types"
import { useFile, FileStore } from "./useFile"
import { useSettings, SettingsStore } from "./useSettings"

type CompressResult = {
    src: string
    dest: string
    size_before: number
    size_after: number
}

export function useCompression() {
    const updateStatus = useFile((state: FileStore) => state.updateFileStatus)
    const updateSize = useFile((state: FileStore) => state.updateSize)
    const updateProgress = useFile((state: FileStore) => state.updateProgress)

    const outputDir = useSettings(
        (state: SettingsStore) => state.outputPaths.imageCompression
    )

    const compressOne = async (item: FileType) => {
        if (!outputDir) {
            alert("First, select an output folder for images.")
            return
        }

        const globalFormat = useFile.getState().globalFormat
        let format = item.outputFormat
        if (!format || globalFormat === "custom") format = item.inputFormat

        format = format.toLowerCase().trim() as SupportedFormat

        console.debug("[useCompression] Starting:", {
            id: item.id,
            path: item.path,
            outputDir,
            format,
        })

        updateStatus(item.id, "compressing")
        updateProgress(item.id, 0)

        let current = 0
        const step = 1
        const intervalMs = 10
        const intervalId = setInterval(() => {
            current = Math.min(current + step, 99)
            updateProgress(item.id, current)
        }, intervalMs)

        try {
            const result = await invoke<CompressResult>("compress_image", {
                srcPath: item.path,
                destDir: outputDir,
                format,
                quality: 80,
            })

            clearInterval(intervalId)
            updateStatus(item.id, "done")
            updateSize(item.id, result.size_after)
            updateProgress(item.id, 100)
            useFile.setState((state) => ({
                files: state.files.map((file) =>
                    file.id === item.id ? { ...file, outputPath: result.dest } : file
                ),
            }))

            console.debug("[useCompression] Success:", { id: item.id, result })
        } catch (error) {
            clearInterval(intervalId)
            updateStatus(item.id, "error")
            updateProgress(item.id, 0)

            console.error("[useCompression] Failed:", { id: item.id, error })
            alert(`Erro ao comprimir "${item.name}"`)
        }
    }

    return { compressOne }
}
