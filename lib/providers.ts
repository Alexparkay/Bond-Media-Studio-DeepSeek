export const PROVIDERS = {
  "fireworks-ai": {
    name: "Landing Page Specialist",
    max_tokens: 131_000,
    id: "fireworks-ai",
  },
  nebius: {
    name: "Blog Website Expert",
    max_tokens: 131_000,
    id: "nebius",
  },
  sambanova: {
    name: "Portfolio Creator",
    max_tokens: 32_000,
    id: "sambanova",
  },
  novita: {
    name: "Business Site Builder",
    max_tokens: 16_000,
    id: "novita",
  },
  hyperbolic: {
    name: "E-commerce Developer",
    max_tokens: 131_000,
    id: "hyperbolic",
  },
  together: {
    name: "Personal Brand Designer",
    max_tokens: 128_000,
    id: "together",
  },
  groq: {
    name: "Restaurant Web Expert",
    max_tokens: 16_384,
    id: "groq",
  },
};

export const MODELS = [
  {
    value: "deepseek-ai/DeepSeek-V3-0324",
    label: "Bond Media Studio Pro Model",
    providers: ["fireworks-ai", "nebius", "sambanova", "novita", "hyperbolic"],
    autoProvider: "novita",
  },
  {
    value: "deepseek-ai/DeepSeek-R1-0528",
    label: "Bond Media Creative Designer",
    providers: [
      "fireworks-ai",
      "novita",
      "hyperbolic",
      "nebius",
      "together",
      "sambanova",
    ],
    autoProvider: "novita",
    isThinker: true,
  },
  {
    value: "Qwen/Qwen3-Coder-480B-A35B-Instruct",
    label: "Bond Media E-commerce Specialist",
    providers: ["novita", "hyperbolic"],
    autoProvider: "novita",
    isNew: true,
  },
  {
    value: "moonshotai/Kimi-K2-Instruct",
    label: "Bond Media Portfolio Expert",
    providers: ["together", "novita", "groq"],
    autoProvider: "groq",
  },
];
