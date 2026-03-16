import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle, LogOut, RefreshCw, Zap } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

export default function MultiTenantDashboard() {
  const { user, logout } = useAuth();
  const [syncStatus, setSyncStatus] = useState<Record<string, any>>({});
  const [isSyncing, setIsSyncing] = useState(false);

  // Queries
  const connectedPlatformsQuery = trpc.platforms.getConnectedPlatforms.useQuery();
  const syncStatusQuery = trpc.platforms.getSyncStatus.useQuery();
  const syncMutation = trpc.platforms.syncPlatformData.useMutation();

  useEffect(() => {
    if (syncStatusQuery.data?.data) {
      setSyncStatus(syncStatusQuery.data.data);
    }
  }, [syncStatusQuery.data]);

  const handleSync = async (platform: "shopee" | "mercadolivre" | "amazon") => {
    setIsSyncing(true);
    try {
      await syncMutation.mutateAsync({ platform });
      // Refetch sync status
      await syncStatusQuery.refetch();
    } catch (error) {
      console.error("Erro ao sincronizar:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  const connectedPlatforms = connectedPlatformsQuery.data?.data || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Dashboard Multi-Tenant</h1>
            <p className="text-slate-300">Gerenciando dados isolados por usuário</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-slate-400">Usuário</p>
              <p className="text-lg font-semibold text-white">{user?.name}</p>
            </div>
            <Button
              onClick={() => logout()}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>

        {/* User Info Card */}
        <Card className="bg-slate-800 border-slate-700 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-slate-400 mb-1">Email</p>
              <p className="text-white font-semibold">{user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400 mb-1">ID do Usuário</p>
              <p className="text-white font-semibold">{user?.id}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400 mb-1">Plataformas Conectadas</p>
              <p className="text-2xl font-bold text-cyan-400">{connectedPlatforms.length}</p>
            </div>
          </div>
        </Card>

        {/* Connected Platforms */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Suas Plataformas Conectadas</h2>

          {connectedPlatforms.length === 0 ? (
            <Card className="bg-slate-800 border-slate-700 p-8 text-center">
              <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-300 mb-4">Nenhuma plataforma conectada</p>
              <Button
                onClick={() => (window.location.href = "/onboarding")}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
              >
                Conectar Plataforma
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {connectedPlatforms.map((platform: any) => {
                const status = syncStatus[platform.platform];
                return (
                  <Card key={platform.platform} className="bg-slate-800 border-slate-700 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-white capitalize">{platform.platform}</h3>
                      <div className="w-3 h-3 bg-green-500 rounded-full" />
                    </div>

                    <div className="space-y-3 mb-4">
                      <div>
                        <p className="text-xs text-slate-400">Usuário da Plataforma</p>
                        <p className="text-white font-semibold">{platform.username}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Conectado em</p>
                        <p className="text-slate-300">
                          {new Date(platform.connectedAt).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                      {platform.lastSyncAt && (
                        <div>
                          <p className="text-xs text-slate-400">Última Sincronização</p>
                          <p className="text-slate-300">
                            {new Date(platform.lastSyncAt).toLocaleString("pt-BR")}
                          </p>
                        </div>
                      )}
                    </div>

                    <Button
                      onClick={() => handleSync(platform.platform)}
                      disabled={isSyncing}
                      className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
                    >
                      <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? "animate-spin" : ""}`} />
                      {isSyncing ? "Sincronizando..." : "Sincronizar Agora"}
                    </Button>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Data Isolation Info */}
        <Card className="bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border-cyan-700/50 p-6">
          <div className="flex items-start gap-4">
            <Zap className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Isolamento de Dados Multi-Tenant</h3>
              <p className="text-slate-300 mb-2">
                Cada usuário tem seus próprios dados completamente isolados:
              </p>
              <ul className="text-slate-300 space-y-1 text-sm">
                <li>✓ Credenciais de plataforma armazenadas por usuário</li>
                <li>✓ Pedidos e produtos sincronizados apenas para suas contas</li>
                <li>✓ Analytics e relatórios personalizados por usuário</li>
                <li>✓ Notificações e alertas isolados por usuário</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
