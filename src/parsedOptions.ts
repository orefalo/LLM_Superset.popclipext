/*
Converts a ExtensionOptions into a ParsedOptions or throws an Exception based on constraints
*/

import { type ExtensionOptions } from "./Config.ts";

export type Provider = "openai" | "claude" | "gemini" | "custom";

// export type ParsedHttpUrl = {
//   kind: "http";
//   protocol: "http" | "https";
//   server: string;
//   port: number;
//   model: string;
//   apiKey: string;
//   tone: string;
//   language: string;
// };

// export type ParsedProviderUrl = {
//   kind: "provider";
//   provider: Provider;
//   model: string;
//   apiKey: string;
//   tone: string;
//   language: string;
// };

export interface ParsedOptions {
  provider: Provider;
  model: string;
  // used for custom
  protocol?: "http" | "https";
  server?: string;
  port?: number;

  apiKey: string;
  tone: string;
  language: string;
}

//export type ParsedOptions = ParsedHttpUrl | ParsedProviderUrl;

export function parseOptions(options: ExtensionOptions): ParsedOptions {
  // Model
  let model = options.model;
  if (model === "Custom Model") {
    model = options.customModel.trim();
    if (model.length === 0)
      throw new Error("Settings error: Custom model url not set");
  }

  const modelProvider = parseCustomModelUrl(model);

  popclip.showText(JSON.stringify(modelProvider));

  // API key
  const key = options.apikey.trim();
  if (!key || key.length === 0)
    throw new Error("Settings error: missing API key");
  modelProvider.apiKey = key;

  // Tone
  modelProvider.tone = options.tone;

  // Language
  modelProvider.language = options.tolang.substring(2);

  return modelProvider;
}

function parseCustomModelUrl(urlModel: string): ParsedOptions {
  // 1. Try provider form: openai:model or claude:model
  const providerMatch = urlModel.match(/^(\w+):(.+)$/);
  if (providerMatch) {
    const provider = providerMatch[1];
    if (
      provider === "openai" ||
      provider === "claude" ||
      provider === "gemini"
    ) {
      const model = providerMatch[2];
      if (model.trim().length > 0) {
        return {
          provider,
          model,
          apiKey: "",
          tone: "",
          language: "",
        };
      }
    }
  }

  // 2. Fallback to HTTP/HTTPS URL form
  let url: URL;
  try {
    url = new URL(urlModel);
  } catch {
    throw new Error(
      `Invalid input. Expected one of:
 - http://server:port/model
 - https://server:port/model
 - openai:model
 - claude:model
 - gemini:model
Got: ${urlModel}`,
    );
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error(`Unsupported protocol: ${url.protocol}`);
  }

  if (!url.hostname) {
    throw new Error("Missing server/hostname");
  }

  let port = Number(url.port);
  if (Number.isNaN(port) || port === 0) {
    if (url.protocol === "http:") {
      port = 80;
    } else if (url.protocol === "https:") {
      port = 443;
    } else throw new Error(`Invalid port: ${url.port}`);
  }

  const path = url.pathname.replace(/^\/+/, "");
  if (!path) {
    throw new Error("Missing model in path");
  }

  return {
    provider: "custom",
    model: path,
    protocol: url.protocol === "http:" ? "http" : "https",
    server: url.hostname,
    port,
    apiKey: "",
    tone: "",
    language: "",
  };
}

// Tests:
// ---- helper that traps exceptions ----
function testSafeParse(input: string) {
  try {
    const result = parseCustomModelUrl(input);
    console.log("OK  :", input, "=>", result);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.log("ERR :'", input, "'=>", msg);
  }
}

// ---- your test calls, parameterized ----
for (const url of [
  "https://example.com:443/namespace/model",
  "https://example.com:443/path/namespace/model",
  "https://example.com:8443/namespace/model",
  "http://example.com:8080/myModel",
  "http:/example.com:8080/myModel",
  "https://localhost:3317/mymodel",
  "https://localhost/mymodel",
  "http://localhost/mymodel",
  "openai:gpt-4.1-mini",
  "gemini:gemini-3-pro",
  "claude:claude-3.5-sonnet",
  "claude:",
  "",
]) {
  testSafeParse(url);
}
