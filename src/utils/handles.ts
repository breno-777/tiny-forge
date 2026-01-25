import { revealItemInDir } from "@tauri-apps/plugin-opener"
import { FileType, SupportedFormat } from "../types"

/**
 * Check if a filesystem path has an accepted extension.
 */
export function isAcceptedPath(path: string): boolean {
    const ACCEPTED_EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp"] as const
    const lower = path.toLowerCase()
    return ACCEPTED_EXTENSIONS.some((ext) => lower.endsWith(ext))
}

/**
 * Derives the logical image format from MIME type.
 */
export function getFormatFromMime(mime: string): SupportedFormat {
    const mimeLower = mime.toLowerCase()
    if (mimeLower.includes("png")) return "png"
    if (mimeLower.includes("jpeg") || mimeLower.includes("jpg")) return "jpeg"
    return "webp"
}

/**
 * Derives the logical image format from file extension.
 */
export function getFormatFromExt(ext: string): SupportedFormat {
    const lower = ext.toLowerCase()
    if (lower === ".png" || lower === "png") return "png"
    if (lower === ".jpg" || lower === "jpg" || lower === ".jpeg" || lower === "jpeg") return "jpeg"
    return "webp"
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