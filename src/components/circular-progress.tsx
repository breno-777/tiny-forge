type CircularProgressProps = {
    size?: number // px
    strokeWidth?: number
    value: number // 0–100
    color?: string
}

export const CircularProgress = ({
    size = 40,
    strokeWidth = 2,
    value,
    color = "#F59300",
}: CircularProgressProps) => {
    const radius = (size - strokeWidth) / 2
    const circumference = 2 * Math.PI * radius
    const clamped = Math.min(100, Math.max(0, value))
    const offset = circumference - (clamped / 100) * circumference

    return (
        <svg
            width={size}
            height={size}
            style={{ display: "block" }}
        >
            <circle
                stroke="#3A3A3A"
                fill="transparent"
                strokeWidth={strokeWidth}
                r={radius}
                cx={size / 2}
                cy={size / 2}
            />
            <circle
                stroke={color}
                fill="transparent"
                strokeWidth={strokeWidth}
                r={radius}
                cx={size / 2}
                cy={size / 2}
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                style={{
                    transform: "rotate(-90deg)",
                    transformOrigin: "50% 50%",
                    transition: "stroke-dashoffset 0.15s linear",
                }}
            />
            <text
                x="50%"
                y="55%"
                dominantBaseline="middle"
                textAnchor="middle"
                fontSize={size * 0.32}
                fill="#F7F7F7"
                opacity={0.4}
            >
                {Math.round(clamped)}
            </text>
        </svg>
    )
}
