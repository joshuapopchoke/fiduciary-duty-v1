import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "remove-crossorigin",
      transformIndexHtml(html) {
        return html.replace(/ crossorigin/g, "");
      }
    }
  ],
  base: "./",
  build: {
    outDir: "dist/renderer",
    modulePreload: {
      polyfill: false
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return "vendor";
          }
          if (id.includes("/src/data/authoredQuestions/")) return undefined;
          if (id.includes("/src/engine/question") || id.includes("/src/data/planningQuestions")) return "study-engine";
          if (
            id.includes("/src/engine/compliance") ||
            id.includes("/src/engine/playerCompliance") ||
            id.includes("/src/engine/taxEngine") ||
            id.includes("/src/engine/rebalancingEngine") ||
            id.includes("/src/engine/retirementIncomeEngine") ||
            id.includes("/src/engine/portfolioAnalytics")
          ) return "advice-engines";
          if (id.includes("/src/engine/marketEngine") || id.includes("/src/types/market")) return "market-engine";
          if (
            id.includes("/src/components/MarketChart") ||
            id.includes("/src/components/QuestionPanel") ||
            id.includes("/src/components/StudyDashboard") ||
            id.includes("/src/components/OrderEntry")
          ) return "workstation-core";
          if (
            id.includes("/src/components/ClientRoster") ||
            id.includes("/src/components/TopBar")
          ) return "shell-ui";
          return undefined;
        }
      }
    }
  },
  server: {
    host: "127.0.0.1",
    port: 5173
  }
});
