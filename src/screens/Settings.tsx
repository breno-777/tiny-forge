import { SelectFolderCard } from "../components/select-folder-card"
import { useSettings } from "../hooks/useSettings"

export const ScreenSettings = () => {
    const outputPaths = useSettings((state) => state.outputPaths)
    const selectOutputPath = useSettings((state) => state.selectOutputPath)

    return (
        <div>
            <div
                className="output-path-buttons"
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                }}
            >
                <SelectFolderCard
                    title={outputPaths.imageCompression !== "" ? "Select images output folder" : "Change images output folder"}
                    outputPath={outputPaths.imageCompression ?? ""}
                    onClick={() => selectOutputPath('imageCompression')}
                />

                <SelectFolderCard
                    title={outputPaths.videoConverter !== "" ? "Select videos output folder" : "Select videos output folder"}
                    outputPath={outputPaths.videoConverter ?? ""}
                    onClick={() => selectOutputPath('videoConverter')}
                />

            </div>
        </div>
    )
}
