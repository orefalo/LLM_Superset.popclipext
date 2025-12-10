# LLM_Superset.popclipext

<p align="center">
Supports
  <img src="chatgpt-icon.svg" width="60px"/>
  <img src="claude-ai-icon.svg" width="60px"/>
</p>

<p align="center">
 <img src="screenshot1.png"/>
<p>
<p align="center">
 <img src="screenshot2.png"/>
</p>

This is my custom extension for PopClip supporting some of the best LLM out there.

- Supports OpenAI ChatGPT and Anthropic Claude
- Tone settings: professional, concise, and friendly
- Text improvements, corrections, enhancements, and summarization
- Translation into multiple languages
- Holding **SHIFT** copies the response to clipboard
- Easy to modify by editing the code and JavaScript file

## Install

### Option 1

1. Download LLM_Superset.popclipextz from [Releases](https://github.com/orefalo/LLM_Superset.popclipext/releases/tag/main)
2. Double click the file
3. Follow PopClip instructions

### Option 2

1. Clone the repo **git clone <this repo url>**
2. Double click on the toplevel folder, LLM_Superset.popclipext
3. Follow PopClip instructions

### Configuration

You need to create API keys with the services to enable the integration. Use the links below to activate them.

- [https://platform.openai.com/account/api-keys](https://platform.openai.com/account/api-keys)
- [https://console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys)
- For local LLM (LM Studio), enter 'local:modelname' for example 'local:qwen/qwen3-coder-30b'. This will connect to the address 127.0.0.1:1234.

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=orefalo/LLM_Superset.popclipext&type=Date)](https://star-history.com/#orefalo/LLM_Superset.popclipext&Date)

## Debug

1. run **defaults write com.pilotmoon.popclip EnableExtensionDebug -bool YES**
2. then open **console.app** and apply filter **Process:PopClip Category:Extension**
