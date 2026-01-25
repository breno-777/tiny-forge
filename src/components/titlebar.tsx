import { getCurrentWindow } from "@tauri-apps/api/window"
import { Anvil, Minus, X } from "lucide-preact";
import { useSettings } from "../hooks/useSettings";

export const TitleBar = () => {
    const appWindow = getCurrentWindow();
    const currentAppMode = useSettings((state: any) => state.appMode);
    const isLoading = useSettings((state: any) => state.isLoading);

    function handleClose() { appWindow.close(); }
    function handleMinimize() { appWindow.minimize(); }

    return (
        <div
            data-tauri-drag-region
            class="title-bar"
            style={{
                position: 'sticky',
                top: 0,
                left: 0,
                right: 0,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#2B2B2B',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            }}
        >
            <div style={{ display: 'flex', gap: '0.8rem', pointerEvents: 'none' }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingLeft: '0.5rem',
                    pointerEvents: 'none',
                    opacity: 0.1,
                }}>
                    <Anvil />
                </div>

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0.2,
                    fontSize: 14,
                }}>
                    {
                        isLoading ? "Welcome" :
                            currentAppMode === 'image-compression'
                                ? 'Image Compression'
                                : currentAppMode === 'video-converter'
                                    ? 'Video Converter'
                                    : 'Settings'
                    }
                </div>
            </div>

            <div
                data-tauri-drag-region
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'end',
                    flexGrow: 1,
                }}>
                <div style={{
                    display: 'flex',
                    padding: '0.25rem',
                    transition: 'all 0.3s',

                }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#444444'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    onClick={() => handleMinimize()}><Minus size={18} opacity={0.2} /></div>

                <div style={{
                    display: 'flex',
                    padding: '0.25rem',
                    transition: 'all 0.3s',
                }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#FF7474'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    onClick={() => handleClose()}><X size={18} opacity={0.2} /></div>
            </div>
        </div>
    )
}