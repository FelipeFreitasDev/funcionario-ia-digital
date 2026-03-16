/**
 * Bull Queue Service - Processamento assíncrono de gerações de IA
 * Gerencia fila de requisições longas com retry automático
 */

import Bull from "bull";
import { updateGenerationStatus } from "../db-generations";

// Tipos de jobs na fila
export interface GenerationJob {
  generationId: string;
  userId: number;
  type: "image" | "video";
  prompt: string;
  style: string;
  provider: string;
  quality?: string;
  width?: number;
  height?: number;
  duration?: number;
}

// Criar fila de gerações
let generationQueue: Bull.Queue<GenerationJob> | null = null;

/**
 * Inicializar fila de processamento
 */
export async function initializeQueue() {
  if (generationQueue) return generationQueue;

  try {
    generationQueue = new Bull<GenerationJob>("generations", {
      redis: {
        host: process.env.REDIS_HOST || "localhost",
        port: parseInt(process.env.REDIS_PORT || "6379"),
      },
      defaultJobOptions: {
        attempts: 3, // Retry 3 vezes
        backoff: {
          type: "exponential",
          delay: 2000, // 2 segundos
        },
        removeOnComplete: true,
        removeOnFail: false,
      },
    });

    // Processar jobs
    generationQueue.process(async (job) => {
      console.log(`[Queue] Processing job ${job.id}:`, job.data.generationId);

      try {
        // Atualizar status para "processing"
        await updateGenerationStatus(job.data.generationId, "processing", {
          processingTime: 0,
        });

        // Simular processamento (em produção, chamar API de IA)
        const startTime = Date.now();

        // Aqui você chamaria a API de IA real
        // const result = await generateImageWithAI(job.data);

        // Para este exemplo, simulamos sucesso após 2 segundos
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const processingTime = Date.now() - startTime;

        // Simular URL de resultado
        const resultUrl = `https://example.com/generated/${job.data.generationId}.jpg`;

        // Atualizar com sucesso
        await updateGenerationStatus(job.data.generationId, "completed", {
          url: resultUrl,
          processingTime,
        });

        console.log(`[Queue] Job ${job.id} completed in ${processingTime}ms`);

        return {
          success: true,
          url: resultUrl,
          processingTime,
        };
      } catch (error) {
        console.error(`[Queue] Job ${job.id} failed:`, error);

        const errorMessage = error instanceof Error ? error.message : "Unknown error";

        // Atualizar com erro
        await updateGenerationStatus(job.data.generationId, "failed", {
          error: errorMessage,
        });

        throw error;
      }
    });

    // Event listeners
    generationQueue.on("completed", (job) => {
      console.log(`[Queue] Job ${job.id} completed successfully`);
    });

    generationQueue.on("failed", (job, err) => {
      console.error(`[Queue] Job ${job.id} failed after retries:`, err.message);
    });

    generationQueue.on("error", (error) => {
      console.error("[Queue] Queue error:", error);
    });

    console.log("[Queue] Generation queue initialized");
    return generationQueue;
  } catch (error) {
    console.error("[Queue] Failed to initialize queue:", error);
    // Retornar null se Redis não estiver disponível
    return null;
  }
}

/**
 * Adicionar job à fila
 */
export async function addGenerationJob(job: GenerationJob) {
  const queue = await initializeQueue();

  if (!queue) {
    throw new Error("Queue not available - Redis connection failed");
  }

  const queueJob = await queue.add(job, {
    jobId: job.generationId,
  });

  return {
    jobId: queueJob.id,
    generationId: job.generationId,
    status: "queued",
  };
}

/**
 * Obter status do job
 */
export async function getJobStatus(jobId: string) {
  const queue = await initializeQueue();

  if (!queue) {
    return null;
  }

  const job = await queue.getJob(jobId);

  if (!job) {
    return null;
  }

  const state = await job.getState();
  const progress = job.progress();

  return {
    jobId: job.id,
    state,
    progress,
    data: job.data,
    attemptsMade: job.attemptsMade,
    failedReason: job.failedReason,
  };
}

/**
 * Limpar fila (para testes)
 */
export async function clearQueue() {
  const queue = await initializeQueue();

  if (queue) {
    await queue.clean(0, "completed");
    await queue.clean(0, "failed");
  }
}

/**
 * Obter estatísticas da fila
 */
export async function getQueueStats() {
  const queue = await initializeQueue();

  if (!queue) {
    return null;
  }

  const counts = await queue.getJobCounts();

  return {
    waiting: counts.waiting,
    active: counts.active,
    completed: counts.completed,
    failed: counts.failed,
    delayed: counts.delayed,
  };
}

/**
 * Fechar fila (para shutdown)
 */
export async function closeQueue() {
  if (generationQueue) {
    await generationQueue.close();
    generationQueue = null;
    console.log("[Queue] Generation queue closed");
  }
}
