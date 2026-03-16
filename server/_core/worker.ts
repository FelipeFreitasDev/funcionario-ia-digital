/**
 * Background Worker - Executa tarefas continuamente 24h
 * Sincronização de pedidos, estoque, publicações agendadas, etc.
 */

import { EventEmitter } from "events";

export interface WorkerTask {
  id: string;
  name: string;
  interval: number; // em milissegundos
  lastRun?: Date;
  nextRun?: Date;
  isRunning: boolean;
  execute: () => Promise<void>;
}

export interface WorkerRecommendation {
  id: string;
  type: "price_optimization" | "new_product" | "description_improvement" | "publish_time" | "inventory" | "performance";
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  action?: string;
  data?: Record<string, any>;
  createdAt: Date;
  dismissed?: boolean;
}

export class AutonomousWorker extends EventEmitter {
  private tasks: Map<string, WorkerTask> = new Map();
  private recommendations: WorkerRecommendation[] = [];
  private isRunning: boolean = false;
  private timers: NodeJS.Timeout[] = [];

  constructor() {
    super();
    this.setupDefaultTasks();
  }

  /**
   * Configurar tarefas padrão
   */
  private setupDefaultTasks() {
    // Sincronizar pedidos a cada 5 minutos
    this.addTask({
      id: "sync-orders",
      name: "Sincronizar Pedidos",
      interval: 5 * 60 * 1000,
      isRunning: false,
      execute: async () => {
        console.log("[Worker] Sincronizando pedidos...");
        // Simular sincronização
        await new Promise((resolve) => setTimeout(resolve, 1000));
        this.addRecommendation({
          id: `rec-${Date.now()}`,
          type: "price_optimization",
          title: "Oportunidade de Otimização de Preço",
          description: "Produto XYZ pode aumentar vendas com ajuste de preço",
          priority: "medium",
          data: { productId: "prod-123", suggestedPrice: 99.90 },
          createdAt: new Date(),
        });
      },
    });

    // Sincronizar estoque a cada 10 minutos
    this.addTask({
      id: "sync-inventory",
      name: "Sincronizar Estoque",
      interval: 10 * 60 * 1000,
      isRunning: false,
      execute: async () => {
        console.log("[Worker] Sincronizando estoque...");
        await new Promise((resolve) => setTimeout(resolve, 1000));
      },
    });

    // Processar publicações agendadas a cada 1 minuto
    this.addTask({
      id: "process-scheduled",
      name: "Processar Publicações Agendadas",
      interval: 60 * 1000,
      isRunning: false,
      execute: async () => {
        console.log("[Worker] Processando publicações agendadas...");
        await new Promise((resolve) => setTimeout(resolve, 500));
      },
    });

    // Coletar métricas de analytics a cada 1 hora
    this.addTask({
      id: "collect-analytics",
      name: "Coletar Métricas de Analytics",
      interval: 60 * 60 * 1000,
      isRunning: false,
      execute: async () => {
        console.log("[Worker] Coletando métricas de analytics...");
        await new Promise((resolve) => setTimeout(resolve, 2000));
        this.addRecommendation({
          id: `rec-${Date.now()}`,
          type: "performance",
          title: "Desempenho em Alta",
          description: "Suas vendas aumentaram 25% esta semana",
          priority: "high",
          data: { growth: 25, period: "week" },
          createdAt: new Date(),
        });
      },
    });

    // Limpar webhooks antigos a cada 24 horas
    this.addTask({
      id: "cleanup-webhooks",
      name: "Limpar Webhooks Antigos",
      interval: 24 * 60 * 60 * 1000,
      isRunning: false,
      execute: async () => {
        console.log("[Worker] Limpando webhooks antigos...");
        await new Promise((resolve) => setTimeout(resolve, 1000));
      },
    });

    // Análise de recomendações a cada 30 minutos
    this.addTask({
      id: "analyze-recommendations",
      name: "Analisar Recomendações",
      interval: 30 * 60 * 1000,
      isRunning: false,
      execute: async () => {
        console.log("[Worker] Analisando recomendações...");
        await new Promise((resolve) => setTimeout(resolve, 1500));
        this.addRecommendation({
          id: `rec-${Date.now()}`,
          type: "new_product",
          title: "Novo Produto Recomendado",
          description: "Baseado em tendências, este produto pode vender bem",
          priority: "medium",
          data: { category: "eletrônicos", trend: "alta demanda" },
          createdAt: new Date(),
        });
      },
    });
  }

  /**
   * Adicionar tarefa ao worker
   */
  addTask(task: WorkerTask) {
    this.tasks.set(task.id, task);
    console.log(`[Worker] Tarefa adicionada: ${task.name}`);
  }

  /**
   * Remover tarefa do worker
   */
  removeTask(taskId: string) {
    this.tasks.delete(taskId);
    console.log(`[Worker] Tarefa removida: ${taskId}`);
  }

  /**
   * Iniciar worker
   */
  start() {
    if (this.isRunning) {
      console.log("[Worker] Worker já está rodando");
      return;
    }

    this.isRunning = true;
    console.log("[Worker] Worker iniciado - Rodando 24h");

    // Agendar todas as tarefas
    this.tasks.forEach((task) => {
      this.scheduleTask(task);
    });

    this.emit("started");
  }

  /**
   * Parar worker
   */
  stop() {
    if (!this.isRunning) {
      console.log("[Worker] Worker já está parado");
      return;
    }

    this.isRunning = false;
    this.timers.forEach((timer) => clearTimeout(timer));
    this.timers = [];

    console.log("[Worker] Worker parado");
    this.emit("stopped");
  }

  /**
   * Agendar execução de tarefa
   */
  private scheduleTask(task: WorkerTask) {
    const executeTask = async () => {
      if (!this.isRunning) return;

      try {
        task.isRunning = true;
        task.lastRun = new Date();
        task.nextRun = new Date(Date.now() + task.interval);

        console.log(`[Worker] Executando: ${task.name}`);
        await task.execute();

        this.emit("task-completed", { taskId: task.id, taskName: task.name });
      } catch (error) {
        console.error(`[Worker] Erro na tarefa ${task.name}:`, error);
        this.emit("task-error", { taskId: task.id, error });
      } finally {
        task.isRunning = false;

        // Reagendar tarefa
        if (this.isRunning) {
          const timer = setTimeout(executeTask, task.interval);
          this.timers.push(timer);
        }
      }
    };

    // Executar imediatamente e depois agendar
    executeTask();
  }

  /**
   * Adicionar recomendação
   */
  addRecommendation(recommendation: WorkerRecommendation) {
    this.recommendations.push(recommendation);
    console.log(`[Worker] Recomendação adicionada: ${recommendation.title}`);
    this.emit("recommendation", recommendation);
  }

  /**
   * Obter recomendações não lidas
   */
  getRecommendations(limit: number = 10): WorkerRecommendation[] {
    return this.recommendations
      .filter((r) => !r.dismissed)
      .sort((a, b) => {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      })
      .slice(0, limit);
  }

  /**
   * Descartar recomendação
   */
  dismissRecommendation(recommendationId: string) {
    const rec = this.recommendations.find((r) => r.id === recommendationId);
    if (rec) {
      rec.dismissed = true;
      this.emit("recommendation-dismissed", { recommendationId });
    }
  }

  /**
   * Obter status do worker
   */
  getStatus() {
    return {
      isRunning: this.isRunning,
      taskCount: this.tasks.size,
      tasks: Array.from(this.tasks).map(([, t]) => ({
        id: t.id,
        name: t.name,
        interval: t.interval,
        lastRun: t.lastRun,
        nextRun: t.nextRun,
        isRunning: t.isRunning,
      })),
      recommendations: this.getRecommendations(),
      recommendationCount: this.recommendations.length,
    };
  }

  /**
   * Executar tarefa manualmente
   */
  async executeTaskNow(taskId: string) {
    const task = this.tasks.get(taskId);
    if (!task) {
      throw new Error(`Tarefa não encontrada: ${taskId}`);
    }

    try {
      task.isRunning = true;
      task.lastRun = new Date();
      console.log(`[Worker] Executando manualmente: ${task.name}`);
      await task.execute();
      this.emit("task-completed", { taskId: task.id, taskName: task.name });
    } finally {
      task.isRunning = false;
    }
  }

  /**
   * Obter histórico de recomendações
   */
  getRecommendationHistory(limit: number = 50): WorkerRecommendation[] {
    return this.recommendations.slice(-limit);
  }

  /**
   * Limpar recomendações antigas
   */
  clearOldRecommendations(hoursOld: number = 24) {
    const cutoffTime = new Date(Date.now() - hoursOld * 60 * 60 * 1000);
    const before = this.recommendations.length;
    this.recommendations = this.recommendations.filter((r) => r.createdAt > cutoffTime);
    const removed = before - this.recommendations.length;
    console.log(`[Worker] ${removed} recomendações antigas removidas`);
  }
}

// Instância global do worker
export const autonomousWorker = new AutonomousWorker();
