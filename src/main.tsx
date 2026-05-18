import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./proposal-directory-floating-menu.css";
import "./proposal-directory-floating-menu";
import "./proposal-directory-fit-rank";
import "./proposal-directory-extra-contacts";
import "./proposal-page-phase-timelines";

createRoot(document.getElementById("root")!).render(<App />);
