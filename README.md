# Phoenix Node 23

This respository demonstrates how to instrument a typescript node application with Arize AI's OpenInference instrumentation and Node v23 native typescript support.

## Getting Started

1. Clone the repository and navigate to the directory
2. Install node v23 using [nvm](https://github.com/nvm-sh/nvm) via `nvm install`
3. Run `npm install`
4. Add your API key to environment `export OPENAI_API_KEY=your_api_key`
5. Run `npm start`

## Notes

- This example is written in typescript, yet runs without a build step.
  - This is because Node v23 supports native typescript type stripping.
- tsconfig.json is only configured to enable editor type checking support.
- .vscode/settings.json is provided to enable editor type checking against the new node v23 types in tsconfig.
