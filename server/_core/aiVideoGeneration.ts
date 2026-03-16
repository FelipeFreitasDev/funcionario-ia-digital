/**
 * AI Video Generation Helper
 * Integra múltiplas AIs gratuitas para geração de vídeos
 * - Replicate (Zeroscope, Damo, etc)
 * - Hugging Face (modelos de vídeo)
 * - D-ID (avatares de vídeo - free trial)
 * - Runway ML (edição com IA - free tier)
 */

export type VideoProvider = "replicate" | "huggingface" | "did" | "runway" | "auto";

export interface VideoGenerationOptions {
  prompt: string;
  provider?: VideoProvider;
  duration?: number; // em segundos: 15, 30, 60
  style?: string;
  quality?: "standard" | "high";
  aspectRatio?: "16:9" | "9:16" | "1:1";
}

export interface VideoGenerationResult {
  url: string;
  provider: string;
  prompt: string;
  duration: number;
  style?: string;
  generatedAt: string;
  status: "processing" | "completed" | "failed";
  metadata?: Record<string, any>;
}

/**
 * Gera vídeo usando a melhor AI disponível
 */
export async function generateVideoWithAI(
  options: VideoGenerationOptions
): Promise<VideoGenerationResult> {
  const {
    prompt,
    provider = "auto",
    duration = 15,
    style = "moderno",
    quality = "high",
    aspectRatio = "16:9",
  } = options;

  const selectedProvider = provider === "auto" ? selectBestVideoProvider() : provider;

  try {
    switch (selectedProvider) {
      case "replicate":
        return await generateWithReplicate(prompt, duration, style, quality, aspectRatio);
      case "huggingface":
        return await generateWithHuggingFace(prompt, duration, style);
      case "did":
        return await generateWithDID(prompt, duration);
      case "runway":
        return await generateWithRunway(prompt, duration, style);
      default:
        return await generateWithReplicate(prompt, duration, style, quality, aspectRatio);
    }
  } catch (error) {
    console.error(`Erro ao gerar vídeo com ${selectedProvider}:`, error);
    if (selectedProvider !== "runway") {
      return generateVideoWithAI({
        ...options,
        provider: getNextVideoProvider(selectedProvider),
      });
    }
    throw error;
  }
}

/**
 * Replicate - Zeroscope V2 para geração de vídeos
 * Free tier com limite de requisições
 */
async function generateWithReplicate(
  prompt: string,
  duration: number,
  style: string,
  quality: string,
  aspectRatio: string
): Promise<VideoGenerationResult> {
  const apiKey = process.env.REPLICATE_API_KEY;

  if (!apiKey) {
    throw new Error("REPLICATE_API_KEY não configurada");
  }

  const enhancedPrompt = `${prompt}, estilo ${style}, alta qualidade, ${quality === "high" ? "4K" : "HD"}`;

  try {
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Token ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: "9f747673945c2514876b92e265fd4e5fcf65ebfc7cbf1d6b0b6131b57842a214", // Zeroscope V2
        input: {
          prompt: enhancedPrompt,
          num_frames: Math.min(duration * 24, 576), // 24fps, máx 576 frames
          guidance_scale: 17.5,
          negative_prompt: "baixa qualidade, desfocado, distorcido, texto",
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Replicate error: ${response.statusText}`);
    }

    const data = await response.json();
    const predictionId = data.id;

    return {
      url: `https://replicate.delivery/pbxt/${predictionId}/output.mp4`,
      provider: "Replicate (Zeroscope)",
      prompt,
      duration,
      style,
      generatedAt: new Date().toISOString(),
      status: "processing",
      metadata: {
        model: "zeroscope-v2",
        predictionId,
        quality,
        aspectRatio,
      },
    };
  } catch (error) {
    console.error("Replicate video generation failed:", error);
    throw error;
  }
}

/**
 * Hugging Face - Modelos de geração de vídeo
 * Modelos open-source e gratuitos
 */
async function generateWithHuggingFace(
  prompt: string,
  duration: number,
  style: string
): Promise<VideoGenerationResult> {
  const apiKey = process.env.HUGGINGFACE_API_KEY;

  if (!apiKey) {
    throw new Error("HUGGINGFACE_API_KEY não configurada");
  }

  const enhancedPrompt = `${prompt}, estilo ${style}, alta qualidade`;

  try {
    // Usar modelo de geração de vídeo (ex: Damo-VTON)
    const response = await fetch(
      "https://api-inference.huggingface.co/models/damo-viton/text-to-video-ms",
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
    const videoUrl = `data:video/mp4;base64,${base64}`;

    return {
      url: videoUrl,
      provider: "Hugging Face",
      prompt,
      duration,
      style,
      generatedAt: new Date().toISOString(),
      status: "completed",
      metadata: {
        model: "damo-text-to-video",
      },
    };
  } catch (error) {
    console.error("Hugging Face video generation failed:", error);
    throw error;
  }
}

/**
 * D-ID - Geração de avatares de vídeo com IA
 * Free trial com créditos
 */
async function generateWithDID(prompt: string, duration: number): Promise<VideoGenerationResult> {
  const apiKey = process.env.DID_API_KEY;

  if (!apiKey) {
    throw new Error("DID_API_KEY não configurada");
  }

  try {
    // Criar avatar de vídeo
    const response = await fetch("https://api.d-id.com/talks", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        script: {
          type: "text",
          input: prompt,
          provider: {
            type: "microsoft",
            voice_id: "pt-BR-AntonioNeural",
          },
        },
        config: {
          fluent: true,
          pad_audio: 0.5,
        },
        source_url: "https://d-id-public-bucket.s3.amazonaws.com/alice.jpg", // Avatar padrão
      }),
    });

    if (!response.ok) {
      throw new Error(`D-ID error: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      url: data.result_url || data.talk_url,
      provider: "D-ID",
      prompt,
      duration,
      generatedAt: new Date().toISOString(),
      status: data.status || "processing",
      metadata: {
        model: "d-id-avatar",
        talkId: data.id,
      },
    };
  } catch (error) {
    console.error("D-ID video generation failed:", error);
    throw error;
  }
}

/**
 * Runway ML - Edição de vídeo com IA
 * Free tier com créditos mensais
 */
async function generateWithRunway(
  prompt: string,
  duration: number,
  style: string
): Promise<VideoGenerationResult> {
  const apiKey = process.env.RUNWAY_API_KEY;

  if (!apiKey) {
    throw new Error("RUNWAY_API_KEY não configurada");
  }

  const enhancedPrompt = `${prompt}, estilo ${style}`;

  try {
    const response = await fetch("https://api.runwayml.com/v1/generate", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        task_type: "gen2",
        prompt: enhancedPrompt,
        duration: Math.min(duration, 60),
        model: "gen2",
      }),
    });

    if (!response.ok) {
      throw new Error(`Runway error: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      url: data.video?.url || data.output_url,
      provider: "Runway ML",
      prompt,
      duration,
      style,
      generatedAt: new Date().toISOString(),
      status: data.status || "processing",
      metadata: {
        model: "runway-gen2",
        taskId: data.id,
      },
    };
  } catch (error) {
    console.error("Runway video generation failed:", error);
    throw error;
  }
}

/**
 * Seleciona melhor provedor de vídeo
 */
function selectBestVideoProvider(): VideoProvider {
  const providers: VideoProvider[] = ["replicate", "did", "runway", "huggingface"];

  for (const provider of providers) {
    const envKey = getEnvKeyForVideoProvider(provider);
    if (process.env[envKey]) {
      return provider;
    }
  }

  return "replicate";
}

/**
 * Próximo provedor para fallback
 */
function getNextVideoProvider(current: VideoProvider): VideoProvider {
  const order: VideoProvider[] = ["replicate", "did", "runway", "huggingface"];
  const currentIndex = order.indexOf(current);
  return order[currentIndex + 1] || "huggingface";
}

/**
 * Chave de ambiente para cada provedor
 */
function getEnvKeyForVideoProvider(provider: VideoProvider): string {
  const keys: Record<VideoProvider, string> = {
    replicate: "REPLICATE_API_KEY",
    huggingface: "HUGGINGFACE_API_KEY",
    did: "DID_API_KEY",
    runway: "RUNWAY_API_KEY",
    auto: "REPLICATE_API_KEY",
  };
  return keys[provider];
}

/**
 * Provedores de vídeo disponíveis
 */
export function getAvailableVideoProviders(): Array<{
  name: string;
  provider: VideoProvider;
  available: boolean;
  freeCredits: string;
}> {
  return [
    {
      name: "Replicate (Zeroscope)",
      provider: "replicate",
      available: !!process.env.REPLICATE_API_KEY,
      freeCredits: "Free tier com limite",
    },
    {
      name: "D-ID",
      provider: "did",
      available: !!process.env.DID_API_KEY,
      freeCredits: "Free trial com créditos",
    },
    {
      name: "Runway ML",
      provider: "runway",
      available: !!process.env.RUNWAY_API_KEY,
      freeCredits: "Créditos mensais gratuitos",
    },
    {
      name: "Hugging Face",
      provider: "huggingface",
      available: !!process.env.HUGGINGFACE_API_KEY,
      freeCredits: "100% gratuito (open-source)",
    },
  ];
}
