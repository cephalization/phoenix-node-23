import { NodeTracerProvider } from "@opentelemetry/sdk-trace-node";
import { OpenAIInstrumentation } from "@arizeai/openinference-instrumentation-openai";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { DiagConsoleLogger, DiagLogLevel, diag } from "@opentelemetry/api";
import OpenAI from "openai";
import { Resource } from "@opentelemetry/resources";
import { SimpleSpanProcessor } from "@opentelemetry/sdk-trace-base";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-proto";
import { SEMRESATTRS_PROJECT_NAME } from "@arizeai/openinference-semantic-conventions";
import { ATTR_SERVICE_NAME } from "@opentelemetry/semantic-conventions";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions.mjs";

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

const provider = new NodeTracerProvider({
  resource: new Resource({
    [ATTR_SERVICE_NAME]: "openai-service",
    [SEMRESATTRS_PROJECT_NAME]: "openai-service",
  }),
  spanProcessors: [
    // new SimpleSpanProcessor(new ConsoleSpanExporter()),
    new SimpleSpanProcessor(
      new OTLPTraceExporter({
        url: "http://localhost:6006/v1/traces",
      })
    ),
  ],
});

provider.register();

// span exporter

const instrumentation = new OpenAIInstrumentation();
instrumentation.manuallyInstrument(OpenAI);

registerInstrumentations({
  instrumentations: [instrumentation],
});

// test

const openai = new OpenAI();

const messages: ChatCompletionMessageParam[] = [
  { role: "system", content: "You are a helpful assistant." },
  { role: "user", content: "What is Arize Phoenix?" },
];

openai.chat.completions
  .create({
    model: "gpt-4o-mini",
    messages,
    temperature: 0.5,
  })
  .then((response) => {
    // eslint-disable-next-line no-console
    console.log(response.choices[0].message.content);
  });
