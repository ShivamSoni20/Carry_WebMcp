import { useEffect, useState } from "react";
import { registerCarryTool } from "./registerCarryTool";
import type { WebMCPStatus } from "./useLumaWebMCP";

export function useCarryWebMCP() {
  const [status, setStatus] = useState<WebMCPStatus>("checking");

  useEffect(() => {
    const controller = new AbortController();

    void registerCarryTool(document, controller.signal).then((result) => {
      if (controller.signal.aborted) return;
      if (!result.supported) setStatus("unavailable");
      else if (result.errors.length) setStatus("error");
      else setStatus("connected");
    });

    return () => controller.abort();
  }, []);

  return status;
}

