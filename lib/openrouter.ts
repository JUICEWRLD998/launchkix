/** LauchKix — OpenRouter client for AI generation */

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface ChatCompletionOptions {
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
  json?: boolean;
}

interface ChatCompletionResponse {
  choices: Array<{
    message: {
      content: string;
    };
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  model: string;
}

class OpenRouterError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public details?: unknown
  ) {
    super(message);
    this.name = "OpenRouterError";
  }
}

/**
 * OpenRouter client for chat completions
 * Uses Gemini 2.0 Flash (fast, cost-effective, good structured output)
 */
export class OpenRouterClient {
  private apiKey: string;
  private baseURL = "https://openrouter.ai/api/v1";
  // Gemini 2.5 Flash — best price/performance, strong structured output
  private defaultModel = "google/gemini-2.5-flash";
  private fallbackModel = "google/gemini-2.5-flash-preview-09-2025";

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.OPENROUTER_API_KEY || "";
    if (!this.apiKey) {
      throw new OpenRouterError(
        "OPENROUTER_API_KEY is required. Set it in .env.local"
      );
    }
  }

  /**
   * Chat completion with JSON mode support
   */
  async chatCompletion(
    options: ChatCompletionOptions
  ): Promise<{ content: string; model: string }> {
    const {
      messages,
      temperature = 0.7,
      maxTokens = 4000,
      json = false,
    } = options;

    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
          "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
          "X-Title": "LauchKix",
        },
        body: JSON.stringify({
          model: this.defaultModel,
          messages,
          temperature,
          max_tokens: maxTokens,
          // JSON mode helps but Gemini is good at structured output anyway
          ...(json && {
            response_format: { type: "json_object" },
          }),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        // If default model fails, try fallback
        if (response.status === 400 && errorData.error?.message?.includes("model")) {
          console.warn(`Primary model failed, trying fallback: ${this.fallbackModel}`);
          return this.chatCompletionWithModel(this.fallbackModel, options);
        }

        throw new OpenRouterError(
          errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          errorData
        );
      }

      const data: ChatCompletionResponse = await response.json();

      if (!data.choices || data.choices.length === 0) {
        throw new OpenRouterError("No response from model");
      }

      const content = data.choices[0].message.content;
      const model = data.model || this.defaultModel;

      return { content, model };
    } catch (error) {
      if (error instanceof OpenRouterError) {
        throw error;
      }
      throw new OpenRouterError(
        `OpenRouter request failed: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Chat completion with specific model (for fallback)
   */
  private async chatCompletionWithModel(
    model: string,
    options: ChatCompletionOptions
  ): Promise<{ content: string; model: string }> {
    const {
      messages,
      temperature = 0.7,
      maxTokens = 4000,
      json = false,
    } = options;

    const response = await fetch(`${this.baseURL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
        "X-Title": "LauchKix",
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens: maxTokens,
        ...(json && {
          response_format: { type: "json_object" },
        }),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new OpenRouterError(
        errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        errorData
      );
    }

    const data: ChatCompletionResponse = await response.json();

    if (!data.choices || data.choices.length === 0) {
      throw new OpenRouterError("No response from model");
    }

    const content = data.choices[0].message.content;
    return { content, model: data.model || model };
  }
}

/** Singleton instance */
let client: OpenRouterClient | null = null;

/**
 * Get or create OpenRouter client instance
 */
export function getOpenRouterClient(): OpenRouterClient {
  if (!client) {
    client = new OpenRouterClient();
  }
  return client;
}
