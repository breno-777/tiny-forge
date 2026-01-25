import { open } from "@tauri-apps/plugin-dialog"
import { SquareDashedMousePointer } from "lucide-preact"
import { useCallback } from "preact/hooks"
import { useFile } from "../hooks/useFile"

export const DropZone = () => {
    const addFiles = useFile((state) => state.addFiles)

    const chooseFiles = useCallback(async () => {
        try {
            const selected = await open({
                multiple: true,
                filters: [{ name: "Imagens", extensions: ["png", "jpeg", "webp"] }],
            })

            const paths =
                typeof selected === "string"
                    ? [selected]
                    : Array.isArray(selected)
                        ? selected
                        : []

            console.debug("[DropZone] chooseFiles selection", { selected, paths })

            if (paths.length > 0) {
                await addFiles(paths)
            }
        } catch (error) {
            console.error("[DropZone] Failed to choose files", error)
            alert("An error occurred while selecting the images.")
        }
    }, [addFiles])

    return (
        <div
            class="drop-area"
            onClick={chooseFiles}
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "160px",
                cursor: "pointer",
                border: "1px dashed #F59300",
                borderRadius: "1rem",
                transition: "all 0.2s ease",
            }}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    pointerEvents: "none",
                    gap: "1rem",
                    opacity: 0.4,
                    color: "#F7F7F7",
                }}
            >
                <SquareDashedMousePointer size={32} />
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <p style={{ margin: 0 }}>Drop your images here!</p>
                    <p style={{ margin: 0 }}>or click to choose manually</p>
                </div>
            </div>
        </div>
    )
}
