import { SelectFolderCard } from "../components/cards/select-folder-card"
import { useSettings } from "../hooks/useSettings"
import { check } from '@tauri-apps/plugin-updater';
import { useState } from "preact/hooks";

export const ScreenSettings = () => {
    const { outputPaths, selectOutputPath, setHasNewUpdate, setNewUpdate } = useSettings();
    const [checking, setChecking] = useState(false);

    const checkForUpdates = async () => {
        setChecking(true);
        console.log('🔍 Check start');
        try {
            const result = await check();
            console.log('Update result:', result);

            if (result) {
                setNewUpdate(result);
                setHasNewUpdate(true);
            } else {
                setNewUpdate(null);
                setHasNewUpdate(false);
            }
        } catch (error) {
            console.error('Update check failed:', error);
        } finally {
            setChecking(false);
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
            >{checking ? 'Checking...' : 'Check for updates'}</button>
        </div>
    )
}
