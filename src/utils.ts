import axios from "axios";

import { type ParsedOptions } from "./parsedOptions.ts";

export async function callLLMapi(prompt: string, options: ParsedOptions) {
  try {
    switch (options.provider) {
      case "openai":
        return await callOpenAPI(prompt, options);
      case "claude":
        return await callClaudeAPI(prompt, options);
      case "gemini":
        return await callGeminiAPI(prompt, options);
      case "custom":
        return await callCustomAPI(prompt, options);
      default:
        throw new Error(`Unknown provider ${options.provider}`);
    }
  } catch (error) {
    if (typeof error === "object" && error !== null && "response" in error) {
      // biome-ignore lint/suspicious/noExplicitAny: ideally use zed-like tool here but this is OK
      const response = (error as any).response;
      return `Message from LLM endpoint (code ${response.status}): ${response.data.error.message}`;
    }
    return String(error);
  }
}

// --- CLAUDE
async function callClaudeAPI(prompt: string, options: ParsedOptions) {
  const key = options.apiKey;

  const requestConfig = {
    headers: {
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };

  const messages = [{ role: "user", content: prompt }];

  const { data } = await axios.post(
    "https://api.anthropic.com/v1/messages",
    {
      model: options.model,
      max_tokens: 2048,
      messages,
    },
    requestConfig,
  );
  return data.content[0].text.trim();
}

// --- OPENAI
async function callOpenAPI(prompt: string, options: ParsedOptions) {
  const key = options.apiKey;

  const requestConfig = {
    headers: {
      Authorization: `Bearer ${key}`,
    },
  };

  const messages = [{ role: "user", content: prompt }];
  const { data } = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: options.model,
      messages,
    },
    requestConfig,
  );
  return data.choices[0].message.content.trim();
}

// --- GEMINI
async function callGeminiAPI(prompt: string, options: ParsedOptions) {
  const url = `https://generativelanguage.googleapis.com/v1/models/${options.model}:generateContent?key=${options.apiKey}`;

  const body = {
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
  };

  const res = await axios.post(url, body, {
    headers: { "Content-Type": "application/json" },
  });

  const data = res.data;

  const text =
    data.candidates?.[0]?.content?.parts?.map((p) => p.text || "").join("") ??
    "";

  return text;
}

// --- CUSTOM/LOCAL Endpoint
async function callCustomAPI(prompt: string, options: ParsedOptions) {
  const key = options.apiKey;

  const requestConfig = {
    headers: {
      Authorization: `Bearer ${key}`,
    },
    timeout: 300000,
  };

  const messages = [{ role: "user", content: prompt }];
  const { data } = await axios.post(
    `${options.protocol}://${options.server}:${options.port}/v1/chat/completions`,
    {
      model: options.model,
      messages,
    },
    requestConfig,
  );
  return data.choices[0].message.content.trim();
}
