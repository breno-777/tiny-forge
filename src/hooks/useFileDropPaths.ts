import { useEffect } from "preact/hooks"
import { getCurrentWindow } from "@tauri-apps/api/window"

type FileDropHandler = (paths: string[]) => void

export function useFileDropPaths(onPaths: FileDropHandler) {
    useEffect(() => {
        const win = getCurrentWindow()
        let cleanup: (() => void) | undefined

        const setup = async () => {
            try {
                const unlisten = await win.onDragDropEvent((event) => {
                    if (event.payload.type !== "drop") return

                    const paths = event.payload.paths ?? []
                    if (paths.length === 0) return

                    onPaths(paths)
                })

                cleanup = unlisten
            } catch (error) {
                console.error("[useFileDropPaths] failed to register drag-drop listener", error)
            }
        }

        void setup()

        return () => {
            if (cleanup) {
                cleanup()
            }
        }
    }, [onPaths])
}
