import { FolderOpen, RefreshCw, X } from "lucide-preact";
import { formatBytes } from "../../utils/format-bytes";
import "../index.css"
import { FileType, SupportedFormat } from "../../types";
import { openOutputFile } from "../../utils/handles";
import { CircularProgress } from "../circular-progress";

type ItemListCardProps = {
    item: FileType;
    onRemove: () => void;
    onChangeFormat: (id: string, format: SupportedFormat) => void
    onConvert: () => void;
};

async function handleOpenFile(item: FileType) {
    if (!item.outputPath) {
        alert("This file has not been generated yet.");
        console.warn("[ItemListCard] Tried to open file without outputPath", item);
        return;
    }

    openOutputFile(item);
}

export const ItemListCard = ({
    item,
    onRemove,
    onConvert,
    onChangeFormat,
}: ItemListCardProps) => {
    const truncate = (text: string, max: number) => text.length <= max ? text : text.slice(0, max - 3) + "...";

    const isDone = item.status === "done";

    const handlePrimaryAction = () => {
        if (isDone) {
            void handleOpenFile(item);
        } else {
            onConvert?.();
        }
    };

    return (
        <div style={{
            padding: '0.25rem',
            borderRadius: '0.5rem',
            backgroundColor: 'rgba(68, 68, 68, 0.6)',
            animation: "appear 0.3s ease-in",
        }}>
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                    gap: "0.6rem",
                }}
            >
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: '0.8rem',
                }}>
                    <div style={{
                        position: 'relative',
                        width: '48px',
                        height: '48px',
                        overflow: 'hidden',
                        borderRadius: 4,
                    }}>
                        <img
                            src={item.previewUrl || undefined}
                            alt={item.name}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: "cover",
                                background: item.previewUrl ? "transparent" : "#2B2B2B",
                            }}
                        />

                        <div style={{
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            top: 0,
                            opacity: 0,
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            transition: 'all 0.3s',
                            backgroundColor: 'rgba(255, 116, 116, 0.8)',
                            cursor: 'pointer'
                        }}
                            onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                            onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}
                            onClick={() => onRemove()}>
                            <X color="#2B2B2B" />
                        </div>
                    </div>

                    <div>
                        <p style={{ margin: 0, fontSize: 14 }}>{truncate(item.name, 28)}</p>

                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.4rem",
                            }}
                        >
                            <select
                                class={`custom-select ${item.outputFormat === "png"
                                    ? "png"
                                    : item.outputFormat === "jpeg"
                                        ? "jpeg"
                                        : "webp"
                                    }`}
                                value={item.outputFormat}
                                onChange={(e) => onChangeFormat(item.id, e.currentTarget.value as SupportedFormat)}
                                tabIndex={-1}
                            >
                                <option value="png">PNG</option>
                                <option value="jpeg">JPEG</option>
                                <option value="webp">WEBP</option>
                            </select>
                            <p
                                style={{
                                    margin: 0,
                                    fontSize: 12,
                                    opacity: 0.6,
                                }}
                            >
                                {formatBytes(item.size)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Buttons Container */}
                <div
                    style={{
                        paddingRight: '0.6rem'
                    }}
                >
                    {
                        item.status === "compressing" ? (
                            <CircularProgress value={item.progress ?? 0} size={36} />
                        ) : (
                            <button
                                type="button"
                                style={{
                                    display: "flex",
                                    cursor: "pointer",
                                    border: "none",
                                    background: "transparent",
                                }}
                                onClick={handlePrimaryAction}
                                aria-label={isDone ? "Open file" : "Convert file"}
                                tabIndex={-1}
                            >
                                {isDone ? (
                                    <FolderOpen size={22} color="#FFFFFF" />
                                ) : (
                                    <RefreshCw size={20} color="#FFFFFF" />
                                )}
                            </button>
                        )
                    }

                </div>
            </div>
        </div>
    );
};
