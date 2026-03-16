import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Loader2, ShoppingCart } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

export default function Onboarding() {
  const { user } = useAuth();
  const [selectedPlatform, setSelectedPlatform] = useState<"shopee" | "mercadolivre" | "amazon" | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // Query to check connected platforms
  const getConnectedQuery = trpc.platforms.getConnectedPlatforms.useQuery();

  const platforms = [
    {
      id: "shopee",
      name: "Shopee",
      description: "Maior marketplace do sudeste asiático",
      icon: "🛍️",
      color: "from-red-500 to-orange-500",
    },
    {
      id: "mercadolivre",
      name: "Mercado Livre",
      description: "Maior marketplace da América Latina",
      icon: "💰",
      color: "from-yellow-400 to-yellow-600",
    },
    {
      id: "amazon",
      name: "Amazon",
      description: "Maior e-commerce do mundo",
      icon: "📦",
      color: "from-orange-400 to-orange-600",
    },
  ];

  const handleConnectPlatform = async (platform: "shopee" | "mercadolivre" | "amazon") => {
    setIsConnecting(true);
    setSelectedPlatform(platform);

    try {
      // Use direct fetch for OAuth URL
      const response = await fetch("/api/trpc/platforms.getAuthorizationUrl?input=" + JSON.stringify({ platform }));
      const result = await response.json();
      if (result.success && result.data?.authUrl) {
        // Redirect to OAuth authorization URL
        window.location.href = result.data.authUrl;
      }
    } catch (error) {
      console.error("Erro ao conectar plataforma:", error);
      setIsConnecting(false);
    }
  };

  const connectedPlatforms = getConnectedQuery.data?.data || [];
  const isConnected = (platform: string) =>
    connectedPlatforms.some((p: any) => p.platform === platform);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">Bem-vindo ao Funcionário Digital!</h1>
          <p className="text-slate-300 text-lg">
            Conecte suas plataformas de e-commerce para começar a automatizar suas vendas
          </p>
        </div>

        {/* Connection Status */}
        {user && (
          <Card className="mb-8 bg-slate-800 border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white mb-1">Usuário: {user.name}</h2>
                <p className="text-slate-400">Email: {user.email}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-400 mb-1">Plataformas Conectadas</p>
                <p className="text-3xl font-bold text-cyan-400">{connectedPlatforms.length}/3</p>
              </div>
            </div>
          </Card>
        )}

        {/* Platforms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {platforms.map((platform) => {
            const connected = isConnected(platform.id);
            return (
              <Card
                key={platform.id}
                className={`bg-slate-800 border-slate-700 overflow-hidden transition-all hover:border-slate-600 ${
                  connected ? "ring-2 ring-green-500" : ""
                }`}
              >
                <div className={`bg-gradient-to-r ${platform.color} p-6 text-center`}>
                  <div className="text-5xl mb-2">{platform.icon}</div>
                  <h3 className="text-2xl font-bold text-white">{platform.name}</h3>
                </div>

                <div className="p-6">
                  <p className="text-slate-300 mb-6">{platform.description}</p>

                  {connected ? (
                    <div className="flex items-center gap-2 text-green-400 mb-4">
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="font-semibold">Conectado</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-slate-400 mb-4">
                      <AlertCircle className="w-5 h-5" />
                      <span className="text-sm">Não conectado</span>
                    </div>
                  )}

                  <Button
                    onClick={() => handleConnectPlatform(platform.id as any)}
                    disabled={isConnecting && selectedPlatform === platform.id}
                    className={`w-full ${
                      connected
                        ? "bg-slate-700 hover:bg-slate-600 text-slate-300"
                        : "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
                    }`}
                  >
                    {isConnecting && selectedPlatform === platform.id ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Conectando...
                      </>
                    ) : connected ? (
                      "Reconectar"
                    ) : (
                      "Conectar Agora"
                    )}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Benefits */}
        <Card className="bg-slate-800 border-slate-700 p-8">
          <h2 className="text-2xl font-bold text-white mb-6">O que você consegue fazer:</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "📊 Sincronizar pedidos automaticamente",
              "💰 Otimizar preços em tempo real",
              "🎨 Gerar criativos com IA",
              "📅 Agendar publicações",
              "📈 Acompanhar analytics",
              "🔔 Receber notificações de vendas",
            ].map((benefit, i) => (
              <div key={i} className="flex items-center gap-3 text-slate-300">
                <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                {benefit}
              </div>
            ))}
          </div>
        </Card>

        {/* Next Steps */}
        {connectedPlatforms.length > 0 && (
          <div className="mt-8 text-center">
            <Button
              onClick={() => (window.location.href = "/dashboard")}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-3 text-lg"
            >
              Ir para Dashboard
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
