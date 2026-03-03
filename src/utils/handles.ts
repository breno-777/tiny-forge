import { revealItemInDir } from "@tauri-apps/plugin-opener"
import { FileType, SupportedFormat } from "../types"

export function isAcceptedPath(path: string): boolean {
    const ACCEPTED_IMAGE_EXTENSIONS = [
        ".png",
        ".jpg",
        ".jpeg",
        ".webp",
        ".bmp",
        ".tiff",
        ".gif",
        ".avif"
    ] as const
    const lower = path.toLowerCase()
    return ACCEPTED_IMAGE_EXTENSIONS.some((ext) => lower.endsWith(ext))
}

export function getFormatFromMime(mime: string): SupportedFormat {
    const mimeLower = mime.toLowerCase()
    if (mimeLower.includes("png")) return "png"
    if (mimeLower.includes("jpeg") || mimeLower.includes("jpg")) return "jpeg"
    return "webp"
}


export function getFormatFromExt(ext: string): SupportedFormat {
    const lower = ext.toLowerCase().trim()

    if (lower === ".png" || lower === "png") return "png"
    if (
        lower === ".jpg" ||
        lower === "jpg" ||
        lower === ".jpeg" ||
        lower === "jpeg"
    )
        return "jpeg"

    if (lower === ".webp" || lower === "webp") return "webp"

    throw new Error(`Unsupported extension: ${ext}`)
}

export async function openOutputFile(item: FileType) {
    if (!item.outputPath) {
        alert("This file has not been generated yet.")
        console.warn("[openOutputFile] Tried to open file without outputPath", item)
        return
    }

    try {
        await revealItemInDir(item.outputPath)
    } catch (error) {
        console.error("[openOutputFile] Failed to reveal item in dir", {
            error,
            outputPath: item.outputPath,
        })
        alert("The file location could not be opened.")
    }
}