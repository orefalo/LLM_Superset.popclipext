import { type ExtensionOptions } from "./Config.ts";

import { parseOptions } from "./parsedOptions.ts";
import { callLLMapi } from "./utils.ts";

const improveWrittingFn: ActionFunction<ExtensionOptions> = async (
  input,
  options,
) => {
  const pOptions = parseOptions(options);

  const prompt = `You are an spelling corrector and improver. Keep the meaning the same. Use a ${
    pOptions.tone
  } tone. Avoid complex words and verbs. Respond in the same language as the original text. Reply only with the corrected and improved text; do not write explanations. Correct and improve this sentence:\n\n${input.text.trim()}`;

  const data = await callLLMapi(prompt, pOptions);
  prepareResponse(data);
};

const spellingAndGrammarFn: ActionFunction<ExtensionOptions> = async (
  input,
  options,
) => {
  const pOptions = parseOptions(options);
  const prompt = `You are an spelling corrector and improver. Keep the original meaning. Use a ${
    pOptions.tone
  } tone. Avoid complex words and verbs. Respond in the same language as the original text. Reply only with the corrected and improved text; do not write explanations. Improve the following sentence:\n\n${input.text.trim()}`;

  const data = await callLLMapi(prompt, pOptions);
  prepareResponse(data);
};

const summarizeFm: ActionFunction<ExtensionOptions> = async (
  input,
  options,
) => {
  const pOptions = parseOptions(options);
  const prompt = `You are an expert at language comprehension and summarization. Read the text below and write one concise paragraph that summarizes the main points. Retain only the most important information needed to understand the core ideas. Respond in the same language as the original text. Avoid unnecessary details, examples, or side topics.\n\n${input.text.trim()}`;

  const data = await callLLMapi(prompt, pOptions);
  prepareResponse(data);
};

const makeLongerFn: ActionFunction<ExtensionOptions> = async (
  input,
  options,
) => {
  const pOptions = parseOptions(options);
  const prompt = `You will rewrite the text below so it is longer, but no more than twice the number of characters of the original. Keep the same meaning and use the same language. Respond in the same language variety or dialect as the original text. Reply only with the rewritten text and nothing else.\n\n${input.text.trim()}`;
  const data = await callLLMapi(prompt, pOptions);
  prepareResponse(data);
};

const makeShorterFn: ActionFunction<ExtensionOptions> = async (
  input,
  options,
) => {
  const pOptions = parseOptions(options);
  const prompt = `You will rewrite the text below so it is no more than half the number of characters of the original. Keep the meaning the same. If needed, remove less important details to meet the length limit.Respond in the same language variety or dialect as the original text. Reply only with the rewritten text and nothing else.\n\n${input.text.trim()}`;

  const data = await callLLMapi(prompt, pOptions);
  prepareResponse(data);
};

const translateFn: ActionFunction<ExtensionOptions> = async (
  input,
  options,
) => {
  const pOptions = parseOptions(options);
  const prompt = `You are a translator. Translate the text below as follows: if the text is in English, translate it into ${
    pOptions.language
  }; if the text is not in English, translate it into English. Keep the meaning the same. Do not change the original structure, layout, or formatting in any way. Reply only with the translated text and nothing else.\n\n${input.text.trim()}`;

  const data = await callLLMapi(prompt, pOptions);
  prepareResponse(data);
};

function stripThink(output: string): string {
  // Remove everything from <think> up to the matching </think>, non-greedily
  const withoutThink = output.replace(/<think>[\s\S]*?<\/think>/g, "");
  return withoutThink.trim();
}

function prepareResponse(data) {
  data = stripThink(data);

  // if holding SHIFT, copy the response to the clipboard
  if (popclip.modifiers.shift) {
    popclip.copyText(data);
  } else {
    popclip.pasteText(data);
  }
}

export const actions: Action<ExtensionOptions>[] = [
  {
    title: "Improve Writing",
    code: improveWrittingFn,
    stayVisible: true,
    requirements: ["option-showImprove=1"],
    icon: "iconify:tabler:file-text-ai",
  },
  {
    title: "Correct Spelling&Grammar",
    code: spellingAndGrammarFn,
    stayVisible: true,
    requirements: ["option-showSpellcheck=1"],
    icon: "iconify:ic:round-fact-check",
  },
  {
    title: "Make Longer",
    code: makeLongerFn,
    stayVisible: true,
    requirements: ["option-showMakeLonger=1"],
    icon: "iconify:mdi:file-plus",
  },
  {
    title: "Make Shorter",
    code: makeShorterFn,
    stayVisible: true,
    requirements: ["option-showMakeShorter=1"],
    icon: "iconify:mdi:file-minus",
  },
  {
    title: "Summarize the text",
    after: "show-result",
    code: summarizeFm,
    stayVisible: true,
    requirements: ["option-showSummary=1"],
    icon: "symbol:arrow.down.right.and.arrow.up.left",
  },
  {
    title: "Translate",
    code: translateFn,
    stayVisible: true,
    requirements: ["option-showTranslate=1"],
    //TODO: See if those can be removed
    icon: "iconify:bi:translate",
  },
];
