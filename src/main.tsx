import { render } from "preact";
import App from "./App";
import { TitleBar } from "./components/titlebar";

const RootLayout = () => (
    <div class="root-layout">
        <TitleBar />
        <div class="app-wrapper">
            <App />
        </div>
    </div>
);

render(<RootLayout />, document.getElementById("root")!);
