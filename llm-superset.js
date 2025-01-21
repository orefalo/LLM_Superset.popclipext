const axios = require("axios");

function prepareResponse(data) {
  // if holding shift, copy just the response. else, paste the last input and response.
  if (popclip.modifiers.shift) {
    popclip.copyText(data);
  } else {
    popclip.pasteText(data);
  }
}

async function callLLMapi(prompt, options) {
  if (options.model.startsWith("gpt") || options.model.startsWith("o1")) {
    return await callOpenAPI(prompt, options);
  } else if (options.model.startsWith("claude")) {
    return await callClaudeAPI(prompt, options);
  } else throw new Error("Unknown model selection:" + options.model);
}

// --- CLAUDE
async function callClaudeAPI(prompt, options) {
  const key = options.claudeapikey.trim();
  if (!key || key.length === 0)
    throw new Error("Settings error: missing ClaudeAPI key");

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
    requestConfig
  );
  return data.content[0].text.trim();
}

// --- OPENAI
async function callOpenAPI(prompt, options) {
  const key = options.apikey.trim();
  if (!key || key.length === 0)
    throw new Error("Settings error: missing OpenAPI key");

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
    requestConfig
  );
  return data.choices[0].message.content.trim();
}

async function improveWritting(input, options) {
  const prompt =
    "I want you to act as an improver. Keep the meaning the same, use a " +
    options.tone +
    " tone, avoid complex words and verbs. I want you to only reply the improvements and nothing else, do not write explanations. keep the input language the same, rewrite and improve the following: \n\n" +
    input.text.trim();

  const data = await callLLMapi(prompt, options);
  prepareResponse(data);
}

async function spellingAndGrammar(input, options) {
  const prompt =
    "I want you to act as an spelling corrector, only reply the correction and nothing else, do not write explanations. keep the input language the same, correct the following using a " +
    options.tone +
    " tone: \n\n" +
    input.text.trim();

  const data = await callLLMapi(prompt, options);
  prepareResponse(data);
}

async function summarize(input, options) {
  const prompt =
    "You are a highly skilled AI trained in language comprehension and summarization. I would like you to read the following text and summarize it into a concise abstract paragraph. Aim to retain the most important points, providing a coherent and readable summary that could help a person understand the main points of the discussion without needing to read the entire text. keep the input language the same, avoid unnecessary details or tangential points: \n\n" +
    input.text.trim();

  const data = await callLLMapi(prompt, options);
  prepareResponse(data);
}

async function makeLonger(input, options) {
  const prompt =
    "You are a highly advanced AI with exceptional language comprehension skills. I will provide you with a piece of text, and your task will be to rewrite it into a longer, more detailed form. Ensure the original meaning is preserved and maintain the same language variety or dialect as the input. Your response should consist solely of the rewritten text, with no additional commentary or explanation: \n\n" +
    input.text.trim();

  const data = await callLLMapi(prompt, options);
  prepareResponse(data);
}

async function makeShorter(input, options) {
  const prompt =
    "You are a highly advanced AI with exceptional language comprehension skills. I will provide you with a piece of text, and your task will be to rewrite it into a short, less detailed form. Ensure the original meaning is preserved and maintain the same language variety or dialect as the input. Your response should consist solely of the rewritten text, with no additional commentary or explanation: \n\n" +
    input.text.trim();

  const data = await callLLMapi(prompt, options);
  prepareResponse(data);
}

async function translate(input, options) {
  const prompt = `I will provide you with text content, and your task is to translate it into ${
    options.tolang
  } while preserving its original meaning. Maintain the exact structure and formatting of the original text without any alterations. Your response should consist solely of the translated content, with no additional commentary or explanation: ${input.text.trim()} `;

  const data = await callLLMapi(prompt, options);
  prepareResponse(data);
}

exports.actions = [
  {
    title: "Improve Writing",
    code: improveWritting,
    icon: "iconify:tabler:file-text-ai",
  },
  {
    title: "Correct Spelling&Grammar",
    // after: "copy-result",
    code: spellingAndGrammar,
    icon: "iconify:ic:round-fact-check",
  },
  {
    title: "Make Longer",
    code: makeLonger,
    icon: "iconify:mdi:file-plus",
  },
  {
    title: "Make Shorter",
    code: makeShorter,
    icon: "iconify:mdi:file-minus",
  },
  {
    title: "Summarize the text",
    after: "show-result",
    code: summarize,
    icon: "symbol:arrow.down.right.and.arrow.up.left",
  },
  {
    title: "Translate",
    code: translate,
    icon: "iconify:bi:translate",
  },
];
