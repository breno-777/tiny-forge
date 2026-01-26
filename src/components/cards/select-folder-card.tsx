import { FolderPen, FolderPlus } from "lucide-preact";
import "../index.css"
import { useEffect, useState } from "preact/hooks";

type SelectFolderCardProps = {
    title: string;
    outputPath: string;
    onClick: () => void;
};

export const SelectFolderCard = ({ title, outputPath, onClick }: SelectFolderCardProps) => {
    const [isEmpty, setIsEmpty] = useState<boolean>(false);

    useEffect(() => {
        setIsEmpty(outputPath === "" || outputPath === null ? true : false)
    }, [outputPath]);

    return (
        <div
            onClick={onClick}
            style={{
                padding: '0.25rem',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                transition: 'all 0.3s',
            }}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    width: "100%",
                    gap: "0.6rem",
                }}
            >
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '48px',
                    height: '48px',
                    borderRadius: 4,
                    backgroundColor: 'rgba(68, 68, 68, 0.6)',
                }}>
                    {isEmpty ? <FolderPlus /> : <FolderPen />}
                </div>

                <div>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: "bold" }}>{title}</p>
                    <p style={{ margin: 0, fontSize: 12, opacity: 0.6 }}>{!isEmpty ? outputPath : "No path selected"}</p>
                </div>
            </div>
        </div >
    );
};
