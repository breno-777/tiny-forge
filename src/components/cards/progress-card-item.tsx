import { useEffect, useRef, useState } from "preact/hooks"
import "./index.css"

type ProgressCardItemType = {
    completed: number;
    processing: number;
    pending: number;
    total: number;
    max: number;
    value: number;
}

export const ProgressCardItem = ({
    completed,
    processing,
    total,
    max,
    value,
}: ProgressCardItemType) => {
    const [_showAppear, setShowAppear] = useState(false)
    const prevProcessing = useRef(processing)

    useEffect(() => {
        if (prevProcessing.current === 0 && processing > 0) {
            setShowAppear(true)
            const timer = setTimeout(() => setShowAppear(false), 300)
            return () => clearTimeout(timer)
        }

        prevProcessing.current = processing
    }, [processing])

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: "4px 8px",
                borderRadius: 6,
                background: "#444444",
                color: "#f7f7f7",
            }}
        >
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
            }}>
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    <div style={{ transform: "scale(0.5) translateX(-12px)" }}>
                        <div class="card-loader" />
                    </div>
                    <span style={{ fontSize: 14, transform: " translateX(-8px)" }}>
                        Compressing images...
                    </span>
                </div>
                <span style={{ fontSize: 14, opacity: 0.4 }}>
                    {completed}/{total}
                </span>
            </div>

            <progress
                className="app-progress"
                value={value}
                max={max}
                style={{ width: "100%" }}
            />
        </div>
    )
}
