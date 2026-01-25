import { SelectFolderCard } from "../components/cards/select-folder-card"
import { useSettings } from "../hooks/useSettings"
import { check } from '@tauri-apps/plugin-updater';
import { relaunch } from '@tauri-apps/plugin-process';

export const ScreenSettings = () => {
    const outputPaths = useSettings((state) => state.outputPaths)
    const selectOutputPath = useSettings((state) => state.selectOutputPath)

    const checkForUpdates = async () => {
        const update = await check();
        if (update) {
            console.log('Update available:', update.version);
            console.log('Notes:', update.body ?? 'No notes');
            await update.downloadAndInstall();
            await relaunch();
        } else {
            console.log('No update');
        }
    };

    return (
        <div>
            <div
                className="output-path-buttons"
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                }}
            >
                <SelectFolderCard
                    title={
                        outputPaths.imageCompression
                            ? "Change images output folder"
                            : "Select images output folder"
                    }
                    outputPath={outputPaths.imageCompression ?? ""}
                    onClick={() => selectOutputPath("imageCompression")}
                />

                <SelectFolderCard
                    title={
                        outputPaths.videoConverter
                            ? "Change videos output folder"
                            : "Select videos output folder"
                    }
                    outputPath={outputPaths.videoConverter ?? ""}
                    onClick={() => selectOutputPath("videoConverter")}
                />
            </div>
            <button
                style={{ borderRadius: 4, outline: "none", border: "none", padding: "4px 8px", backgroundColor: "#F59300", cursor: "pointer" }}
                onClick={checkForUpdates}
            >Check for updates</button>
        </div>
    )
}
