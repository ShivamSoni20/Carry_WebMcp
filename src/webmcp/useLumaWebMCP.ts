import { useEffect, useState } from "react";
import type { LumaPreferenceStore } from "../luma/store";
import { registerLumaTools } from "./registerLumaTools";

export type WebMCPStatus = "checking" | "connected" | "unavailable" | "error";

export function useLumaWebMCP(store: LumaPreferenceStore) {
  const [status, setStatus] = useState<WebMCPStatus>("checking");

  useEffect(() => {
    const controller = new AbortController();

    void registerLumaTools(document, store, controller.signal).then((result) => {
      if (controller.signal.aborted) return;
      if (!result.supported) setStatus("unavailable");
      else if (result.errors.length) setStatus("error");
      else setStatus("connected");
    });

    return () => controller.abort();
  }, [store]);

  return status;
}
