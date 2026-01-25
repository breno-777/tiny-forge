import { NavbarItem } from "./navbar-item"
import { useSettings } from "../hooks/useSettings"
import { Clapperboard, Cloud, Image, Settings } from "lucide-preact";
import { useState } from "preact/hooks";
import { ProgressCard } from "./cards/progress-card";
export const NavBar = () => {
    const currentAppMode = useSettings((state: any) => state.appMode);
    const updateAppMode = useSettings((state: any) => state.updateAppMode);
    const [showTasks, setShowTasks] = useState<boolean>(false);

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            paddingRight: '0.5rem',
            paddingTop: '0.5rem',
            height: "100%",
            gap: "0.25rem",
            boxSizing: "border-box",
            borderRight: '1px solid rgba(255, 255, 255, 0.1)',
        }}>
            <NavbarItem
                icon={<Image />}
                selected={currentAppMode === 'image-compression'}
                onclick={() => updateAppMode('image-compression')}
            />
            <NavbarItem
                icon={<Clapperboard />}
                selected={currentAppMode === 'video-converter'}
                onclick={() => updateAppMode('video-converter')}
            />
            <NavbarItem
                icon={<Settings />}
                selected={currentAppMode === 'settings'}
                onclick={() => updateAppMode('settings')}
            />
            <div style={{ display: "flex", flexGrow: 1, height: "100%", alignItems: "flex-end" }}>
                <div
                    style={{ postion: "relative" }}
                    onMouseEnter={() => setShowTasks(true)}
                    onMouseLeave={() => setShowTasks(false)}>
                    <NavbarItem
                        icon={<Cloud />}
                    />
                    {showTasks && <div style={{ position: "absolute", bottom: 46, left: 42, zIndex: 1, animation: "none" }}><ProgressCard /></div>}
                </div>
            </div>
            <div />
            <div />
        </div >
    )
}