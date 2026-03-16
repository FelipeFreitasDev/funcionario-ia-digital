/**
 * AI Image Generation Helper
 * Integra múltiplas AIs gratuitas para geração de imagens
 * - Stability AI (free tier)
 * - Leonardo AI (free tier com $5 crédito inicial)
 * - Replicate (free tier)
 * - Hugging Face (modelos gratuitos)
 */

import { invokeLLM } from "./llm";

export type AIProvider = "stability" | "leonardo" | "replicate" | "huggingface" | "auto";

export interface ImageGenerationOptions {
  prompt: string;
  provider?: AIProvider;
  style?: string;
  width?: number;
  height?: number;
  quality?: "standard" | "high" | "ultra";
  negativePrompt?: string;
}

export interface ImageGenerationResult {
  url: string;
  provider: string;
  prompt: string;
  style?: string;
  generatedAt: string;
  width: number;
  height: number;
  metadata?: Record<string, any>;
}

/**
 * Gera imagem usando a melhor AI disponível
 * Tenta múltiplos provedores em caso de falha
 */
export async function generateImageWithAI(
  options: ImageGenerationOptions
): Promise<ImageGenerationResult> {
  const {
    prompt,
    provider = "auto",
    style = "moderno",
    width = 1024,
    height = 768,
    quality = "high",
    negativePrompt,
  } = options;

  // Selecionar provedor
  const selectedProvider = provider === "auto" ? selectBestProvider() : provider;

  try {
    switch (selectedProvider) {
      case "stability":
        return await generateWithStabilityAI(prompt, style, width, height, quality, negativePrompt);
      case "leonardo":
        return await generateWithLeonardoAI(prompt, style, width, height, quality);
      case "replicate":
        return await generateWithReplicate(prompt, style, width, height);
      case "huggingface":
        return await generateWithHuggingFace(prompt, style, width, height);
      default:
        return await generateWithStabilityAI(prompt, style, width, height, quality, negativePrompt);
    }
  } catch (error) {
    console.error(`Erro ao gerar imagem com ${selectedProvider}:`, error);
    // Tentar próximo provedor
    if (selectedProvider !== "huggingface") {
      return generateImageWithAI({
        ...options,
        provider: getNextProvider(selectedProvider),
      });
    }
    throw error;
  }
}

/**
 * Stability AI - Free tier com limite de requisições
 * Requer API key (pode usar free trial)
 */
async function generateWithStabilityAI(
  prompt: string,
  style: string,
  width: number,
  height: number,
  quality: string,
  negativePrompt?: string
): Promise<ImageGenerationResult> {
  // Usar LLM para gerar imagem via Stability AI
  // A chave é injetada via env STABILITY_AI_API_KEY
  const apiKey = process.env.STABILITY_AI_API_KEY;

  if (!apiKey) {
    throw new Error("STABILITY_AI_API_KEY não configurada");
  }

  // Construir prompt melhorado
  const enhancedPrompt = `${prompt}, estilo ${style}, alta qualidade, profissional, ${quality === "ultra" ? "ultra detalhado" : "bem detalhado"}`;

  try {
    const response = await fetch("https://api.stability.ai/v2beta/stable-image/generate/ultra", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: enhancedPrompt,
        negative_prompt: negativePrompt || "baixa qualidade, desfocado, distorcido",
        aspect_ratio: `${width}:${height}`,
        output_format: "jpeg",
      }),
    });

    if (!response.ok) {
      throw new Error(`Stability AI error: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      url: data.image || `data:image/jpeg;base64,${data.artifacts?.[0]?.base64}`,
      provider: "Stability AI",
      prompt,
      style,
      generatedAt: new Date().toISOString(),
      width,
      height,
      metadata: {
        model: "stable-image-ultra",
        quality,
      },
    };
  } catch (error) {
    console.error("Stability AI generation failed:", error);
    throw error;
  }
}

/**
 * Leonardo AI - Free tier com $5 crédito inicial
 * Melhor custo-benefício para uso contínuo
 */
async function generateWithLeonardoAI(
  prompt: string,
  style: string,
  width: number,
  height: number,
  quality: string
): Promise<ImageGenerationResult> {
  const apiKey = process.env.LEONARDO_AI_API_KEY;

  if (!apiKey) {
    throw new Error("LEONARDO_AI_API_KEY não configurada");
  }

  const enhancedPrompt = `${prompt}, estilo ${style}, alta qualidade, profissional`;

  try {
    const response = await fetch("https://api.leonardo.ai/v1/generations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: enhancedPrompt,
        width,
        height,
        num_images: 1,
        guidance_scale: 7.5,
        model_id: "6bef9f1b-29cb-40c7-b9df-32b51c1f60f8", // Leonardo Diffusion XL
      }),
    });

    if (!response.ok) {
      throw new Error(`Leonardo AI error: ${response.statusText}`);
    }

    const data = await response.json();
    const imageUrl = data.generations?.[0]?.url || data.image_url;

    return {
      url: imageUrl,
      provider: "Leonardo AI",
      prompt,
      style,
      generatedAt: new Date().toISOString(),
      width,
      height,
      metadata: {
        model: "leonardo-diffusion-xl",
        quality,
      },
    };
  } catch (error) {
    console.error("Leonardo AI generation failed:", error);
    throw error;
  }
}

/**
 * Replicate - Free tier com múltiplos modelos
 * Suporta Stable Diffusion, SDXL, etc
 */
async function generateWithReplicate(
  prompt: string,
  style: string,
  width: number,
  height: number
): Promise<ImageGenerationResult> {
  const apiKey = process.env.REPLICATE_API_KEY;

  if (!apiKey) {
    throw new Error("REPLICATE_API_KEY não configurada");
  }

  const enhancedPrompt = `${prompt}, estilo ${style}, alta qualidade`;

  try {
    // Usar Stable Diffusion XL via Replicate
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Token ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: "a45f82a1d6c5d91c9b46e51f4af3c85d667c19a7920ff2546635b9f08b4ab58", // SDXL
        input: {
          prompt: enhancedPrompt,
          width,
          height,
          num_outputs: 1,
          guidance_scale: 7.5,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Replicate error: ${response.statusText}`);
    }

    const data = await response.json();

    // Replicate retorna um ID, precisamos fazer polling
    const predictionId = data.id;
    let imageUrl = null;

    // Polling simples (em produção, usar webhook)
    for (let i = 0; i < 30; i++) {
      const statusResponse = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
        headers: { Authorization: `Token ${apiKey}` },
      });

      const statusData = await statusResponse.json();

      if (statusData.status === "succeeded") {
        imageUrl = statusData.output?.[0];
        break;
      } else if (statusData.status === "failed") {
        throw new Error("Replicate generation failed");
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    if (!imageUrl) {
      throw new Error("Timeout aguardando imagem do Replicate");
    }

    return {
      url: imageUrl,
      provider: "Replicate",
      prompt,
      style,
      generatedAt: new Date().toISOString(),
      width,
      height,
      metadata: {
        model: "stable-diffusion-xl",
        predictionId,
      },
    };
  } catch (error) {
    console.error("Replicate generation failed:", error);
    throw error;
  }
}

/**
 * Hugging Face - Modelos gratuitos e de código aberto
 * Melhor para uso offline/local
 */
async function generateWithHuggingFace(
  prompt: string,
  style: string,
  width: number,
  height: number
): Promise<ImageGenerationResult> {
  const apiKey = process.env.HUGGINGFACE_API_KEY;

  if (!apiKey) {
    throw new Error("HUGGINGFACE_API_KEY não configurada");
  }

  const enhancedPrompt = `${prompt}, estilo ${style}, alta qualidade`;

  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          inputs: enhancedPrompt,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Hugging Face error: ${response.statusText}`);
    }

    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    const imageUrl = `data:image/jpeg;base64,${base64}`;

    return {
      url: imageUrl,
      provider: "Hugging Face",
      prompt,
      style,
      generatedAt: new Date().toISOString(),
      width,
      height,
      metadata: {
        model: "stable-diffusion-2-1",
      },
    };
  } catch (error) {
    console.error("Hugging Face generation failed:", error);
    throw error;
  }
}

/**
 * Seleciona o melhor provedor baseado em disponibilidade
 */
function selectBestProvider(): AIProvider {
  // Ordem de preferência (melhor custo-benefício primeiro)
  const providers: AIProvider[] = ["leonardo", "stability", "replicate", "huggingface"];

  for (const provider of providers) {
    const envKey = getEnvKeyForProvider(provider);
    if (process.env[envKey]) {
      return provider;
    }
  }

  // Se nenhum configurado, retornar padrão
  return "stability";
}

/**
 * Retorna próximo provedor para fallback
 */
function getNextProvider(current: AIProvider): AIProvider {
  const order: AIProvider[] = ["leonardo", "stability", "replicate", "huggingface"];
  const currentIndex = order.indexOf(current);
  return order[currentIndex + 1] || "huggingface";
}

/**
 * Retorna chave de ambiente para cada provedor
 */
function getEnvKeyForProvider(provider: AIProvider): string {
  const keys: Record<AIProvider, string> = {
    stability: "STABILITY_AI_API_KEY",
    leonardo: "LEONARDO_AI_API_KEY",
    replicate: "REPLICATE_API_KEY",
    huggingface: "HUGGINGFACE_API_KEY",
    auto: "STABILITY_AI_API_KEY",
  };
  return keys[provider];
}

/**
 * Obter informações sobre provedores disponíveis
 */
export function getAvailableProviders(): Array<{
  name: string;
  provider: AIProvider;
  available: boolean;
  freeCredits: string;
}> {
  return [
    {
      name: "Leonardo AI",
      provider: "leonardo",
      available: !!process.env.LEONARDO_AI_API_KEY,
      freeCredits: "$5 inicial + tokens diários",
    },
    {
      name: "Stability AI",
      provider: "stability",
      available: !!process.env.STABILITY_AI_API_KEY,
      freeCredits: "Free trial disponível",
    },
    {
      name: "Replicate",
      provider: "replicate",
      available: !!process.env.REPLICATE_API_KEY,
      freeCredits: "Free tier com limite de requisições",
    },
    {
      name: "Hugging Face",
      provider: "huggingface",
      available: !!process.env.HUGGINGFACE_API_KEY,
      freeCredits: "100% gratuito (modelos open-source)",
    },
  ];
}
