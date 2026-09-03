/// <reference types="vite/client" />

type WebMCPTool = {
  name: string;
  title?: string;
  description: string;
  inputSchema: Record<string, unknown>;
  annotations?: {
    readOnlyHint?: boolean;
    untrustedContentHint?: boolean;
  };
  execute: (
    input: unknown,
    context?: { signal?: AbortSignal },
  ) => Promise<string> | string;
};

type RegisteredWebMCPTool = Pick<WebMCPTool, "name"> & Record<string, unknown>;

interface ModelContext {
  registerTool(
    tool: WebMCPTool,
    options?: { signal?: AbortSignal; exposedTo?: string[] },
  ): Promise<void>;
  getTools?(): Promise<RegisteredWebMCPTool[]>;
  executeTool?(
    tool: RegisteredWebMCPTool,
    input: string,
    options?: { signal?: AbortSignal },
  ): Promise<string | null>;
}

interface Document {
  modelContext?: ModelContext;
}
