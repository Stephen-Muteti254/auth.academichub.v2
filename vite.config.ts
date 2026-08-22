import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import netlify from "@netlify/vite-plugin-tanstack-start";

export default defineConfig({
  nitro: false,

  tanstackStart: {
    server: {
      entry: "server",
    },
  },

  vite: {
    plugins: [netlify()],
  },
});