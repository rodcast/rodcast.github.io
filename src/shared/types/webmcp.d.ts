export type JSONSchema = {
  type: string;
  description?: string;
  enum?: string[];
  default?: unknown;
  minimum?: number;
  maximum?: number;
  required?: string[];
  items?: JSONSchema;
  properties?: Record<string, unknown>;
  additionalProperties?: boolean;
};

export type ToolAnnotations = {
  readOnlyHint?: boolean;
  untrustedContentHint?: boolean;
};

export type WebMCPTool = {
  name: string;
  title?: string;
  description: string;
  inputSchema?: JSONSchema;
  execute: (input?: Record<string, unknown>) => Promise<unknown>;
  annotations?: ToolAnnotations;
};

type WebMCPContext = {
  tools: WebMCPTool[];
};

type ModelContextRegisterToolOptions = {
  signal?: AbortSignal;
  exposedTo?: string[];
};

type ModelContextAPI = {
  registerTool?: (
    tool: WebMCPTool,
    options?: ModelContextRegisterToolOptions
  ) => Promise<void>;
  provideContext?: (context: WebMCPContext) => Promise<void>;
  ontoolchange?: ((event: Event) => void) | null;
};

declare global {
  interface Document {
    modelContext?: ModelContextAPI;
  }

  interface Navigator {
    modelContext?: ModelContextAPI;
  }
}

export {};
