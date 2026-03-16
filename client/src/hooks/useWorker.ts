/**
 * Hook - useWorker
 * Gerencia o worker autônomo 24h e suas recomendações
 */

import { useEffect, useState, useCallback } from "react";
import { trpc } from "@/lib/trpc";

export interface WorkerStatus {
  isRunning: boolean;
  taskCount: number;
  tasks: Array<{
    id: string;
    name: string;
    interval: number;
    lastRun?: Date;
    nextRun?: Date;
    isRunning: boolean;
  }>;
  recommendations: any[];
  recommendationCount: number;
}

export function useWorker() {
  const [isInitialized, setIsInitialized] = useState(false);

  // Queries
  const statusQuery = trpc.worker.getStatus.useQuery(undefined, {
    refetchInterval: 30000, // Atualizar a cada 30 segundos
  });

  const recommendationsQuery = trpc.worker.getRecommendations.useQuery(
    { limit: 10 },
    {
      refetchInterval: 10000, // Atualizar a cada 10 segundos
    }
  );

  // Mutations
  const startMutation = trpc.worker.start.useMutation();
  const stopMutation = trpc.worker.stop.useMutation();
  const dismissMutation = trpc.worker.dismissRecommendation.useMutation();
  const executeTaskMutation = trpc.worker.executeTask.useMutation();

  // Inicializar worker na primeira renderização
  useEffect(() => {
    if (!isInitialized && statusQuery.data) {
      if (!(statusQuery.data as any)?.data?.isRunning) {
        startMutation.mutate(undefined, {
          onSuccess: () => {
            setIsInitialized(true);
            statusQuery.refetch();
          },
        });
      } else {
        setIsInitialized(true);
      }
    }
  }, [isInitialized, statusQuery, startMutation]);

  // Callbacks
  const startWorker = useCallback(() => {
    startMutation.mutate();
  }, [startMutation]);

  const stopWorker = useCallback(() => {
    stopMutation.mutate();
  }, [stopMutation]);

  const dismissRecommendation = useCallback(
    (recommendationId: string) => {
      dismissMutation.mutate(
        { recommendationId },
        {
          onSuccess: () => {
            recommendationsQuery.refetch();
          },
        }
      );
    },
    [dismissMutation, recommendationsQuery]
  );

  const executeTask = useCallback(
    (taskId: string) => {
      executeTaskMutation.mutate(
        { taskId },
        {
          onSuccess: () => {
            statusQuery.refetch();
          },
        }
      );
    },
    [executeTaskMutation, statusQuery]
  );

  return {
    // Status
    isRunning: (statusQuery.data as any)?.data?.isRunning || false,
    taskCount: (statusQuery.data as any)?.data?.taskCount || 0,
    tasks: (statusQuery.data as any)?.data?.tasks || [],
    recommendations: (recommendationsQuery.data as any)?.data || [],
    recommendationCount: (recommendationsQuery.data as any)?.count || 0,

    // Mutations
    startWorker,
    stopWorker,
    dismissRecommendation,
    executeTask,

    // Status
    isLoading: statusQuery.isLoading || recommendationsQuery.isLoading,
    isInitialized,
  };
}
