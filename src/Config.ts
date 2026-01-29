// #popclip
// name: LLM Superset
// icon: preserve-color file:superset.svg
// identifier: orefalo.popclip.extension.chatgpt-superset
// description: Send the selected text to your prefered LLM and pastes the response. Hold Shift (⇧) to copy the response to the clipboard.
// note: To use this extension you will need API keys from the respective providers
// popclipVersion: 4586
// keywords: openai claude gemini chatgpt superset
// entitlements: [network]

import { actions as theActions } from "./actions.ts";

export const actions = theActions;
export type ExtensionOptions = InferOptions<typeof options>;
export const options = [
  {
    identifier: "apikey",
    label: "API Key",
    type: "secret",
    requirements: ["text", "paste"],
    description:
      "Obtain an API key from https://platform.openai.com/account/api-keys or https://console.anthropic.com/settings/keys",
  },
  {
    identifier: "model",
    label: "Model",
    type: "multiple",
    defaultValue: "openai:gpt-5.2",
    description:
      "Model list: https://platform.openai.com/docs/pricing or https://platform.claude.com/docs/en/about-claude/pricing",
    values: [
      "Custom Model",
      "openai:gpt-5.2",
      "openai:gpt-5.1",
      "openai:gpt-5-mini",
      "openai:gpt-4o",
      "claude:claude-opus-4-5",
      "claude:claude-sonnet-4-5",
      "gemini:gemini-3-pro-preview",
      "gemini:gemini-3-flash-preview",
      "gemini:gemini-2.5-flash",
    ],
  },
  {
    identifier: "customModel",
    label: "Custom Model",
    type: "string",
    defaultValue: "",
    description:
      "URL of the form 'http://server:port/<model>'. you can also use 'openai:<model>', 'gemini:<model>' or 'claude:<model>'",
  },
  {
    identifier: "tone",
    label: "Answer tone",
    type: "multiple",
    defaultValue: "professional",
    values: ["concise", "professional", "friendly"],
    description: "Default tone used for drafting responses",
  },
  {
    identifier: "tolang",
    label: "Language",
    type: "multiple",
    defaultValue: "🇫🇷 French",
    description: "The target translation language",
    values: [
      "🇬🇧 English",
      "🇨🇳 Chinese",
      "🇷🇺 Russian",
      "🇫🇷 French",
      "🇧🇷 Português",
      "🇪🇸 Spanish",
    ],
  },
  {
    identifier: "showImprove",
    label: "Show Improve Button",
    type: "boolean",
    icon: "iconify:tabler:file-text-ai",
  },
  {
    identifier: "showSpellcheck",
    label: "Show SpellCheck Button",
    type: "boolean",
    icon: "iconify:ic:round-fact-check",
  },
  {
    identifier: "showMakeLonger",
    label: "Show Make Longer",
    type: "boolean",
    icon: "iconify:mdi:file-plus",
  },
  {
    identifier: "showMakeShorter",
    label: "Show Make Shorter",
    type: "boolean",
    icon: "iconify:mdi:file-minus",
  },
  {
    identifier: "showSimplify",
    label: "Show Simplify Button",
    type: "boolean",
    icon: "file:simplify.svg",
  },
  {
    identifier: "showTranslate",
    label: "Show Translate Button",
    type: "boolean",
    icon: "iconify:bi:translate",
  },
  {
    identifier: "showAnswer",
    label: "Show Answer Button",
    type: "boolean",
    icon: "iconify:mdi:head-lightbulb-outline",
  },
] as const;
