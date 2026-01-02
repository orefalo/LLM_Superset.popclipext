// Tests:

import { parseCustomModelUrl } from "./parsedOptions";

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