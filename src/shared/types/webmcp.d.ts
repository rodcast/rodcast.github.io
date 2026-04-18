export type JSONSchema = {
  type: string;
  properties?: Record<string, unknown>;
  additionalProperties?: boolean;
};

export type WebMCPTool = {
  name: string;
  description: string;
  inputSchema: JSONSchema;
  execute: (input?: Record<string, unknown>) => Promise<unknown>;
};

type WebMCPContext = {
  tools: WebMCPTool[];
};

type ModelContextAPI = {
  provideContext: (context: WebMCPContext) => Promise<void>;
};

declare global {
  interface Navigator {
    modelContext?: ModelContextAPI;
  }
}

export {};
