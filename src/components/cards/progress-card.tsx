import { useFile, FileStore } from "../../hooks/useFile"
import { ProgressCardItem } from "./progress-card-item"
import "./index.css"

export const ProgressCard = () => {
    const files = useFile((state: FileStore) => state.files)

    const completed = files.filter(f => f.status === "done").length
    const processing = files.filter(f => f.status === "compressing").length
    const pending = files.filter(f => f.status === "pending").length
    const total = files.length

    const value = completed
    const max = total || 1

    // ✅ só mostra enquanto houver algo pra fazer
    const hasActiveTasks = processing > 0 || pending > 0

    if (!hasActiveTasks) {
        // nada processando nem pendente → não renderiza o card
        return null
    }

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: 4,
                borderRadius: 8,
                maxWidth: "240px",
                border: "1px solid #444444",
                backgroundColor: "rgba(68, 68, 68, 0.6)",
                backdropFilter: "blur(4px)",
            }}
        >
            <span>Tasks</span>

            <ProgressCardItem
                completed={completed}
                processing={processing}
                pending={pending}
                total={total}
                max={max}
                value={value}
            />
        </div>
    )
}
