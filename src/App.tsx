import { useEffect } from "preact/hooks";
import "./App.css";
import { NavBar } from "./components/navbar";
import { useSettings } from "./hooks/useSettings";
import { ScreenImageCompression } from "./screens/ImageCompression";
import { ScreenSettings } from "./screens/Settings";
import { ScreenVideoConverter } from "./screens/VideoConverter";
import { UpdateToast } from "./components/cards/update-toast";
import { check } from "@tauri-apps/plugin-updater";

function App() {
  const currentAppMode = useSettings((state: any) => state.appMode);
  const isLoading = useSettings((state: any) => state.isLoading);
  const setIsLoading = useSettings((state: any) => state.setIsLoading);
  const hasNewUpdate = useSettings((state: any) => state.hasNewUpdate);

  const { autoCheckUpdates, setHasNewUpdate, setNewUpdate } = useSettings();

  useEffect(() => {
    if (autoCheckUpdates && !isLoading) {
      const checkStartup = async () => {
        try {
          const result = await check();
          if (result) {
            setNewUpdate(result);
            setHasNewUpdate(true);
          }
        } catch (e) {
          console.error('Startup update check failed:', e);
        }
      };
      checkStartup();
    }
  }, [autoCheckUpdates, isLoading, setHasNewUpdate, setNewUpdate]);


  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  return (
    <div class="app">
      {hasNewUpdate && <UpdateToast />}

      {isLoading ?
        (
          <div class="loader-container">
            <div class="loader">
              <p>loading</p>
              <div class="words">
                <span class="word">folders</span>
                <span class="word">tools</span>
                <span class="word">inputs</span>
                <span class="word">buttons</span>
                <span class="word">folders</span>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div class="left-container">
              <NavBar />
            </div>

            <div class="right-container" tabIndex={-1}>
              {currentAppMode === 'image-compression' ? <ScreenImageCompression />
                : currentAppMode === "video-converter" ? <ScreenVideoConverter />
                  : <ScreenSettings />}
            </div >
          </>
        )
      }
    </div >
  );
}

export default App;