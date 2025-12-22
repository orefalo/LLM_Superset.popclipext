// #popclip
// name: LLM Superset
// icon: iconify:tabler:file-text-ai
// identifier: orefalo.popclip.extension.chatgpt-superset
// description: Send the selected text to your prefered LLM and pastes the response. Hold Shift (⇧) to copy the response to the clipboard.
// note: To use this extension you will need API keys from the respective providers
// app: { name: LLM Superset, link: 'https://github.com/orefalo/LLM_Superset' }
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
    description:
      "Obtain an API key from https://platform.openai.com/account/api-keys or https://console.anthropic.com/settings/keys",
  },
  {
    identifier: "model",
    label: "Model",
    type: "multiple",
    defaultValue: "openai:gpt-5.2-mini",
    description:
      "Model list: https://platform.openai.com/docs/pricing or https://platform.claude.com/docs/en/about-claude/pricing",
    values: [
      "openai:gpt-5.2",
      "openai:gpt-5.2-mini",
      "openai:gpt-4o",
      "claude:claude-sonnet-4-5",
      "claude:claude-opus-4-5",
    ],
  },
  {
    identifier: "customModel",
    label: "Custom Model",
    type: "string",
    defaultValue: "",
    description:
      "If filled, overwrites model with a URL of the form 'http://server:port/<model>'. you can also use 'openai:<model>', 'gemini:<model>' or 'claude:<model>'",
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
    identifier: "showSummary",
    label: "Show Summary Button",
    type: "boolean",
    icon: "symbol:arrow.down.right.and.arrow.up.left",
  },
  {
    identifier: "showTranslate",
    label: "Show Translate Button",
    type: "boolean",
    icon: "iconify:bi:translate",
  },
] as const;



