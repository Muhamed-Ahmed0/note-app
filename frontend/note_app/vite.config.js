import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  root: "../../frontend/note_app", // Ensure the root points to the correct folder
});
