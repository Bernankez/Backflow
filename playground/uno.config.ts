import { defineConfig, presetIcons, presetUno } from "unocss";
import { presetDaisy } from "unocss-preset-daisy";

export default defineConfig({
  presets: [presetUno(), presetIcons(), presetDaisy({
    themes: ["bumblebee", "forest"],
  })],
});
