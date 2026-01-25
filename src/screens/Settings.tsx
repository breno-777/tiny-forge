import { SelectFolderCard } from "../components/cards/select-folder-card"
import { useSettings } from "../hooks/useSettings"
export const ScreenSettings = () => {
    const outputPaths = useSettings((state) => state.outputPaths)
    const selectOutputPath = useSettings((state) => state.selectOutputPath)
    

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
        </div>
    )
}
