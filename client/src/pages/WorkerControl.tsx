/**
 * Worker Control Dashboard
 * Painel para gerenciar o worker autônomo 24h
 */

import { useState, useEffect } from "react";
import { useWorker } from "@/hooks/useWorker";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  Pause,
  RotateCw,
  Trash2,
  Download,
  Clock,
  CheckCircle,
  AlertCircle,
  Activity,
} from "lucide-react";

export default function WorkerControl() {
  const { startWorker, stopWorker, executeTask } = useWorker();
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [showLogs, setShowLogs] = useState(false);

  // Queries
  const statusQuery = trpc.worker.getStatus.useQuery(undefined, {
    refetchInterval: 5000,
  });

  const statsQuery = trpc.worker.getStats.useQuery(undefined, {
    refetchInterval: 10000,
  });

  const historyQuery = trpc.worker.getRecommendationHistory.useQuery(
    { limit: 100 },
    { refetchInterval: 30000 }
  );

  const status = (statusQuery.data as any)?.data;
  const stats = (statsQuery.data as any)?.data;

  const handleExportLogs = () => {
    const logs = JSON.stringify(status?.tasks || [], null, 2);
    const blob = new Blob([logs], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `worker-logs-${new Date().toISOString()}.json`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Painel de Controle do Worker</h1>
          <p className="text-muted-foreground">Gerencie o assistente autônomo 24h</p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="text-2xl font-bold text-foreground mt-2">
                  {status?.isRunning ? "🟢 Ativo" : "🔴 Parado"}
                </p>
              </div>
              <Activity className={`w-8 h-8 ${status?.isRunning ? "text-green-500" : "text-red-500"}`} />
            </div>
          </Card>

          <Card className="p-6">
            <div>
              <p className="text-sm text-muted-foreground">Tarefas</p>
              <p className="text-2xl font-bold text-foreground mt-2">{stats?.taskCount || 0}</p>
            </div>
          </Card>

          <Card className="p-6">
            <div>
              <p className="text-sm text-muted-foreground">Recomendações</p>
              <p className="text-2xl font-bold text-foreground mt-2">{stats?.unreadRecommendations || 0}</p>
            </div>
          </Card>

          <Card className="p-6">
            <div>
              <p className="text-sm text-muted-foreground">Uptime</p>
              <p className="text-2xl font-bold text-foreground mt-2">{stats?.uptime || "N/A"}</p>
            </div>
          </Card>
        </div>

        {/* Control Buttons */}
        <Card className="p-6 mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">Controles</h2>
          <div className="flex gap-3 flex-wrap">
            <Button
              onClick={() => startWorker()}
              disabled={status?.isRunning}
              className="gap-2"
            >
              <Play className="w-4 h-4" />
              Iniciar Worker
            </Button>
            <Button
              onClick={() => stopWorker()}
              disabled={!status?.isRunning}
              variant="destructive"
              className="gap-2"
            >
              <Pause className="w-4 h-4" />
              Parar Worker
            </Button>
            <Button
              onClick={handleExportLogs}
              variant="outline"
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Exportar Logs
            </Button>
            <Button
              onClick={() => setShowLogs(!showLogs)}
              variant="outline"
              className="gap-2"
            >
              {showLogs ? "Ocultar" : "Mostrar"} Logs
            </Button>
          </div>
        </Card>

        {/* Tasks List */}
        <Card className="p-6 mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">Tarefas em Execução</h2>
          <div className="space-y-3">
            {status?.tasks?.map((task: any) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors cursor-pointer"
                onClick={() => setSelectedTask(selectedTask === task.id ? null : task.id)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground">{task.name}</p>
                    <Badge variant={task.isRunning ? "default" : "secondary"}>
                      {task.isRunning ? "Executando" : "Aguardando"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Intervalo: {(task.interval / 60000).toFixed(1)}min
                  </p>
                  {task.lastRun && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Última execução: {new Date(task.lastRun).toLocaleString("pt-BR")}
                    </p>
                  )}
                </div>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    executeTask(task.id);
                  }}
                  size="sm"
                  variant="outline"
                  className="gap-2"
                >
                  <RotateCw className="w-4 h-4" />
                  Executar Agora
                </Button>
              </div>
            ))}
          </div>
        </Card>

        {/* Logs */}
        {showLogs && (
          <Card className="p-6 mb-8">
            <h2 className="text-lg font-semibold text-foreground mb-4">Histórico de Recomendações</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {(historyQuery.data as any)?.data?.map((rec: any, idx: number) => (
                <div key={idx} className="p-3 bg-muted rounded text-sm">
                  <div className="flex items-center gap-2">
                    {rec.priority === "high" && <AlertCircle className="w-4 h-4 text-red-500" />}
                    {rec.priority === "medium" && <Clock className="w-4 h-4 text-yellow-500" />}
                    {rec.priority === "low" && <CheckCircle className="w-4 h-4 text-green-500" />}
                    <span className="font-medium">{rec.title}</span>
                  </div>
                  <p className="text-muted-foreground mt-1">{rec.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(rec.createdAt).toLocaleString("pt-BR")}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Worker Stats */}
        {stats && (
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Estatísticas</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Total de Tarefas</p>
                <p className="text-2xl font-bold text-foreground mt-2">{stats.taskCount}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Recomendações Totais</p>
                <p className="text-2xl font-bold text-foreground mt-2">{stats.totalRecommendations}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Não Lidas</p>
                <p className="text-2xl font-bold text-foreground mt-2">{stats.unreadRecommendations}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Alta Prioridade</p>
                <p className="text-2xl font-bold text-red-500 mt-2">{stats.highPriorityRecommendations}</p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
