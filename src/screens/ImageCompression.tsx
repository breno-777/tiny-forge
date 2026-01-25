import { Repeat, Trash } from "lucide-preact"
import { DropZone } from "../components/dropzone"
import { FileStore, useFile } from "../hooks/useFile"
import { ItemListCard } from "../components/item-list-card"
import { FileType, GlobalFormat, SupportedFormat } from "../types"
import { useCompression } from "../hooks/useCompression"
import { useFileDropPaths } from "../hooks/useFileDropPaths"
import { useSettings } from "../hooks/useSettings"
import { useCallback } from "preact/hooks"

export const ScreenImageCompression = () => {
    const files = useFile((state: FileStore) => state.files)
    const globalFormat = useFile((state: FileStore) => state.globalFormat)
    const setGlobalFormat = useFile((state: FileStore) => state.setGlobalFormat)

    const updateFileFormat = useFile((state: FileStore) => state.updateFileFormat)
    const outputDir = useSettings((state: any) => state.outputPaths.imageCompression)

    const addFiles = useFile((state) => state.addFiles)
    const removeFile = useFile((state: FileStore) => state.removeFile)
    const removeAllFiles = useFile((state: FileStore) => state.removeAllFiles)

    const handleDropPaths = useCallback(
        async (paths: string[]) => {
            console.debug("[ScreenImageCompression] file-drop paths", paths)
            await addFiles(paths)
        },
        [addFiles]
    )
    useFileDropPaths(handleDropPaths)

    const { compressOne } = useCompression();
    const handleConvertAll = async () => {
        if (!outputDir) {
            alert("First, select an output folder for images.")
            return
        }
        for (const file of files) {
            if (file.status === "done") continue
            await compressOne(file)
            // ou, se quiser rodar em paralelo:
            // promises.push(compressOne(file))
        }
        // para paralelo:
        // await Promise.all(promises)
    }

    const handleChangeFormat = (id: string, format: SupportedFormat) => {
        updateFileFormat(id, format)
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: '1rem' }}>
            <DropZone />

            {files.length > 0 && (
                <div>
                    <div style={{ display: "flex", width: "100%", alignItems: "center", gap: 8 }}>
                        <p style={{ margin: 0, fontSize: 14, opacity: 0.4 }}>Total: {files.length}</p>

                        <div style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "flex-end",
                            flexGrow: 1,
                            gap: 8
                        }}>
                            <select
                                class="custom-select"
                                value={globalFormat}
                                onChange={(e) => setGlobalFormat(e.currentTarget.value as GlobalFormat)}
                                tabIndex={-1}
                            >
                                <option value="custom">CUSTOM</option>
                                <option value="webp">WEBP</option>
                                <option value="jpeg">JPEG</option>
                                <option value="png">PNG</option>
                            </select>

                            <div
                                onClick={removeAllFiles}
                                style={{
                                    display: 'flex',
                                    fontSize: 14,
                                    cursor: 'pointer',
                                    transition: 'all 0.3s',
                                    color: "#F7F7F7",
                                    opacity: 0.6
                                }}
                                onMouseEnter={(e) => [e.currentTarget.style.color = "#FF7474", e.currentTarget.style.opacity = '1']}
                                onMouseLeave={(e) => [e.currentTarget.style.color = "#F7F7F7", e.currentTarget.style.opacity = '0.6']}
                            >
                                <Trash size={20} />
                            </div>

                            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{
                                    position: 'absolute',
                                    right: 0,
                                    width: '5px',
                                    height: '20px',
                                    marginRight: '0.5rem',
                                    borderRadius: '0.25rem',
                                    backgroundColor: '#F59300',
                                }} />
                                <button
                                    type="button"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 4,
                                        padding: '0.4rem 1.6rem',
                                        borderRadius: 4,
                                        border: 'none',
                                        cursor: 'pointer',
                                        backdropFilter: 'blur(4px)',
                                        backgroundColor: 'rgba(68, 68, 68, 0.6)',
                                    }}
                                    onClick={() => handleConvertAll()}
                                    tabIndex={-1}
                                >
                                    <Repeat size={18} color="#F7F7F7" />
                                    <p style={{ margin: 0, fontSize: 14, color: "#F7F7F7" }}>
                                        Convert All
                                    </p>
                                </button>

                                <div style={{
                                    position: 'absolute',
                                    right: 0,
                                    width: '2px',
                                    height: '20px',
                                    marginRight: '0.5rem',
                                    borderRadius: '0.25rem',
                                    backgroundColor: '#F59300',
                                }} />
                            </div>
                        </div>
                    </div>

                    <ul style={{ listStyle: "none", paddingLeft: 0, marginTop: 12 }}>
                        {files.map((item: FileType) => (
                            <li key={item.id}>
                                <ItemListCard
                                    item={item}
                                    onRemove={() => removeFile(item.id)}
                                    onChangeFormat={handleChangeFormat}
                                    onConvert={() => compressOne(item)}
                                />
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}