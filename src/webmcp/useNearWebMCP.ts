import { useEffect, useState } from "react";
import type { NearPreferenceStore } from "../near/store";
import { registerNearBaseTools, registerNearCityTool } from "./registerNearTools";
import type { WebMCPStatus } from "./useLumaWebMCP";

export function useNearWebMCP(store: NearPreferenceStore, needsCityTool: boolean) {
  const [status, setStatus] = useState<WebMCPStatus>("checking");

  useEffect(() => {
    const controller = new AbortController();
    void registerNearBaseTools(document, store, controller.signal).then((result) => {
      if (controller.signal.aborted) return;
      if (!result.supported) setStatus("unavailable");
      else setStatus(result.errors.length ? "error" : "connected");
    });
    return () => controller.abort();
  }, [store]);

  useEffect(() => {
    if (!needsCityTool) return;
    const controller = new AbortController();
    void registerNearCityTool(document, store, controller.signal).catch(() => {
      if (!controller.signal.aborted) setStatus("error");
    });
    return () => controller.abort();
  }, [needsCityTool, store]);

  return status;
}
