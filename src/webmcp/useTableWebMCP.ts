import { useEffect, useState } from "react";
import type { TablePreferenceStore } from "../table/store";
import type { WebMCPStatus } from "./useLumaWebMCP";
import { registerTableTools } from "./registerTableTools";

export function useTableWebMCP(store: TablePreferenceStore) {
  const [status, setStatus] = useState<WebMCPStatus>("checking");
  useEffect(() => {
    const controller = new AbortController();
    void registerTableTools(document, store, controller.signal).then((result) => {
      if (controller.signal.aborted) return;
      if (!result.supported) setStatus("unavailable");
      else setStatus(result.errors.length ? "error" : "connected");
    });
    return () => controller.abort();
  }, [store]);
  return status;
}
