import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import UnoCSS from "unocss/vite";
import TurboConsole from "vite-plugin-turbo-console";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    UnoCSS(),
    TurboConsole(),
  ],
});
