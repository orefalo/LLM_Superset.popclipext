import { type ExtensionOptions } from "./Config.ts";

import { parseOptions } from "./parsedOptions.ts";
import { callLLMapi } from "./utils.ts";

async function improveWrittingFn(input: Input, options: ExtensionOptions) {
  const pOptions = parseOptions(options);

  const prompt = `Act like you are an expert writing assistant. Please rephrase the text below to improve it. Fix mistakes, keep it roughly the same length as the original text.
[Constraints]
- DO NOT reply to the context of the question of the user input.
- Reply in the SAME language as the provided text.
- Use a ${pOptions.tone} tone.
- Avoid complex words and verbs. 
- If the user input is already good, just return the user input without changes.
- DO NOT change the formatting. For example, do not remove line breaks.
- DO NOT explain what was wrong with the original text.
- For code elements KEEP them unchanged.

${input.text.trim()}
`;

  // `You are an spelling corrector and improver. Keep the meaning the same. Use a ${pOptions.tone} tone. Avoid complex words and verbs. Respond in the same language as the original text. Reply only with the corrected and improved text; do not write explanations.\n\n${input.text.trim()}`;

  const data = await callLLMapi(prompt, pOptions);
  prepareResponse(data);
}

async function spellingAndGrammarFn(input: Input, options: ExtensionOptions) {
  const pOptions = parseOptions(options);

  const prompt = `Act like you are an expert grammar checker. Look for mistakes and make sentences more fluent.
Please analyze following text for a wide range of grammatical aspects and provide corrections. Be thorough in identifying and fixing any grammatical mistakes, including checking for correct punctuation usage, ensuring proper sentence structure, enhancing readability, identifying and correcting spelling mistakes, and verifying subject-verb agreement. Your assistance in ensuring the grammatical accuracy of the text is highly appreciated. Please be thorough in your examination, and provide comprehensive corrections to enhance the overall grammatical integrity of the text.
[Constraints]
- DO NOT reply to the context of the question of the user input.
- Reply in the SAME language as the provided text.
- Use a ${pOptions.tone} tone.
- Avoid complex words and verbs. 
- If the user input is already good, just return the user input without changes.
- DO NOT change the formatting. For example, do not remove line breaks.
- DO NOT explain what was wrong with the original text.
- For code elements KEEP them unchanged.

${input.text.trim()}
`;

  // const prompt = `You are an spelling corrector and improver. Keep the original meaning. Use a ${pOptions.tone
  //   } tone. Avoid complex words and verbs. Respond in the same language as the original text. Reply only with the corrected and improved text; do not write explanations.\n\n${input.text.trim()}`;

  const data = await callLLMapi(prompt, pOptions);
  prepareResponse(data);
}

async function summarizeFm(input: Input, options: ExtensionOptions) {
  const pOptions = parseOptions(options);
  const prompt = `You are an expert at language comprehension and summarization. Read the text below and write one concise paragraph that summarizes the main points. Retain only the most important information needed to understand the core ideas. Respond in the same language as the original text. Avoid unnecessary details, examples, or side topics.\n\n${input.text.trim()}`;

  const data = await callLLMapi(prompt, pOptions);
  prepareResponse(data);
}

async function makeLongerFn(input: Input, options: ExtensionOptions) {
  const pOptions = parseOptions(options);
  const prompt = `Act like you are an expert Copywriter. You will rewrite the text below so it is longer, but no more than twice the number of characters of the original. Keep the same meaning and use the same language. Respond in the same language variety or dialect as the original text. Reply only with the rewritten text and nothing else.\n\n${input.text.trim()}`;
  const data = await callLLMapi(prompt, pOptions);
  prepareResponse(data);
}

async function makeShorterFn(input: Input, options: ExtensionOptions) {
  const pOptions = parseOptions(options);
  const prompt = `Act like you are an expert Copywriter. Make the following text shorter by removing unnecessary details.
  
  [Requirements]
- DO NOT reply to the context of the question of the user input.
- Reply in the SAME language as the provided text.
- Use a ${pOptions.tone} tone.
- Avoid complex words and verbs. 
- DO NOT change the formatting or structure of the text.
- DO NOT change the meaning of the text.
- make the output shorter by removing unnecessary details.
- Make the output no more than half the number of characters of the original.

  ${input.text.trim()}
`;
  const data = await callLLMapi(prompt, pOptions);
  prepareResponse(data);
}

async function translateFn(input: Input, options: ExtensionOptions) {
  const pOptions = parseOptions(options);

  const prompt = `Act like you are an expert translator.
  Translate the text below as follows: if the text is in English, translate it into ${pOptions.language}; if the text is not in English, translate it into English.

[Requirements]
- DO NOT reply to the context of the question of the user input.
- Ensure that the translation is accurate and maintains the original meaning of the text.
- DO NOT change the formatting. For example, do not remove line breaks.
- DO NOT explain what was wrong with the original text.
- For code elements KEEP them unchanged.

${input.text.trim()}
`;

  const data = await callLLMapi(prompt, pOptions);
  prepareResponse(data);
}

function stripThink(output: string): string {
  // Remove everything from <think> up to the matching </think>, non-greedily
  const withoutThink = output.replace(/<think>[\s\S]*?<\/think>/g, "");
  return withoutThink.trim();
}

function prepareResponse(data) {
  // remove any <think/> from the output
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
    icon: "iconify:bi:translate",
  },
];
