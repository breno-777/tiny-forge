import { useState } from 'preact/hooks';
import { useSettings } from '../../hooks/useSettings';
import { relaunch } from '@tauri-apps/plugin-process';

export const UpdateToast = () => {
    const { newUpdate, setHasNewUpdate, setNewUpdate } = useSettings();
    const [visible, setVisible] = useState(true);

    const install = async () => {
        if (newUpdate) {
            await newUpdate.downloadAndInstall();
            await relaunch();
        }
    };

    const snooze = async () => {
        setHasNewUpdate(false);
        setNewUpdate(null);
        setVisible(false);
    };

    if (!newUpdate || !visible) return null;

    return (
        <div class="update-toast">
            <div class="toast-content">
                <div class={"toast-messages"}>
                    <span class="title">🎉 New version {newUpdate.version}!</span>
                    <span>Improvements and fixes available</span>
                </div>
                <div class="toast-actions">
                    <button onClick={install}>Instalar agora</button>
                    <button onClick={snooze}>Adiar</button>
                </div>
            </div>
        </div>
    );
};
