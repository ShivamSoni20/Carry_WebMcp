import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
export default defineConfig({
    plugins: [react()],
    server: {
        headers: {
            "Origin-Agent-Cluster": "?1",
            "Permissions-Policy": "tools=(self)",
        },
    },
    preview: {
        headers: {
            "Origin-Agent-Cluster": "?1",
            "Permissions-Policy": "tools=(self)",
        },
    },
    test: {
        environment: "jsdom",
        setupFiles: ["./src/test/setup.ts"],
        pool: "threads",
        fileParallelism: false,
        maxWorkers: 1,
    },
});
