import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

/**
 * The entry point of the application.
 */
createRoot(document.getElementById("root")!).render(<App />);
