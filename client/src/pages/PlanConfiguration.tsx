import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  BarChart3,
  Zap,
  Users,
  Share2,
  Lock,
  Settings,
  AlertCircle,
} from "lucide-react";

interface PlanLimits {
  ecommercePlatforms: number;
  socialMediaAccounts: number;
  aiGenerations: number;
  scheduledPosts: number;
  teamMembers: number;
  apiCalls: number;
}

const planLimits: Record<string, PlanLimits> = {
  starter: {
    ecommercePlatforms: 1,
    socialMediaAccounts: 2,
    aiGenerations: 100,
    scheduledPosts: 50,
    teamMembers: 1,
    apiCalls: 10000,
  },
  professional: {
    ecommercePlatforms: 3,
    socialMediaAccounts: 4,
    aiGenerations: 500,
    scheduledPosts: 200,
    teamMembers: 5,
    apiCalls: 50000,
  },
  enterprise: {
    ecommercePlatforms: 999,
    socialMediaAccounts: 999,
    aiGenerations: 999999,
    scheduledPosts: 999999,
    teamMembers: 999,
    apiCalls: 999999,
  },
};

export default function PlanConfiguration() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 max-w-md">
          <h2 className="text-2xl font-bold mb-4">Acesso Restrito</h2>
          <p className="text-muted-foreground mb-6">
            Você precisa estar autenticado para acessar esta página.
          </p>
          <Button className="w-full">Fazer Login</Button>
        </Card>
      </div>
    );
  }

  const userPlan = ("professional") as keyof typeof planLimits; // Default to professional for demo
  const limits = planLimits[userPlan] || planLimits.starter;

  const planNames: Record<string, string> = {
    starter: "Starter",
    professional: "Professional",
    enterprise: "Enterprise",
  };

  const planPrices: Record<string, string> = {
    starter: "R$ 99/mês",
    professional: "R$ 299/mês",
    enterprise: "Customizado",
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Configuração do Plano</h1>
          <p className="text-muted-foreground">
            Visualize seus limites de uso e atualize seu plano conforme necessário
          </p>
        </div>

        {/* Current Plan Card */}
        <Card className="mb-12 p-8 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">
                {planNames[userPlan]}
              </h2>
              <p className="text-lg text-muted-foreground">
                {planPrices[userPlan]}
              </p>
            </div>
            <div className="text-right">
              <Button variant="outline" size="lg">
                <Settings className="mr-2 w-4 h-4" />
                Gerenciar Plano
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-background p-4 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">
                Próxima Renovação
              </p>
              <p className="text-lg font-bold">
                {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(
                  "pt-BR"
                )}
              </p>
            </div>
            <div className="bg-background p-4 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Status</p>
              <p className="text-lg font-bold text-green-600">Ativo</p>
            </div>
            <div className="bg-background p-4 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Suporte</p>
              <p className="text-lg font-bold">
                {userPlan === "enterprise" ? "24/7" : "Email"}
              </p>
            </div>
            <div className="bg-background p-4 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Faturamento</p>
              <p className="text-lg font-bold">Mensal</p>
            </div>
          </div>
        </Card>

        {/* Usage Limits */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold mb-6">Seus Limites de Uso</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* E-commerce Platforms */}
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <BarChart3 className="w-6 h-6 text-primary mr-3" />
                <h4 className="font-bold">Plataformas de E-commerce</h4>
              </div>
              <div className="mb-4">
                <p className="text-3xl font-bold">
                  {limits.ecommercePlatforms}
                </p>
                <p className="text-sm text-muted-foreground">
                  {limits.ecommercePlatforms === 999
                    ? "Ilimitado"
                    : `de ${limits.ecommercePlatforms}`}
                </p>
              </div>
              <div className="bg-secondary/20 rounded-full h-2">
                <div
                  className="bg-secondary h-2 rounded-full"
                  style={{
                    width: `${Math.min(
                      (limits.ecommercePlatforms / 3) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Shopee, Mercado Livre, Amazon
              </p>
            </Card>

            {/* Social Media Accounts */}
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <Share2 className="w-6 h-6 text-primary mr-3" />
                <h4 className="font-bold">Contas de Redes Sociais</h4>
              </div>
              <div className="mb-4">
                <p className="text-3xl font-bold">
                  {limits.socialMediaAccounts}
                </p>
                <p className="text-sm text-muted-foreground">
                  {limits.socialMediaAccounts === 999
                    ? "Ilimitado"
                    : `contas conectadas`}
                </p>
              </div>
              <div className="bg-secondary/20 rounded-full h-2">
                <div
                  className="bg-secondary h-2 rounded-full"
                  style={{
                    width: `${Math.min(
                      (limits.socialMediaAccounts / 6) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Instagram, TikTok, Facebook, etc
              </p>
            </Card>

            {/* AI Generations */}
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <Zap className="w-6 h-6 text-primary mr-3" />
                <h4 className="font-bold">Gerações de IA/Mês</h4>
              </div>
              <div className="mb-4">
                <p className="text-3xl font-bold">
                  {limits.aiGenerations === 999999
                    ? "∞"
                    : limits.aiGenerations.toLocaleString("pt-BR")}
                </p>
                <p className="text-sm text-muted-foreground">
                  imagens e vídeos
                </p>
              </div>
              <div className="bg-secondary/20 rounded-full h-2">
                <div
                  className="bg-secondary h-2 rounded-full"
                  style={{
                    width: `${Math.min(
                      (limits.aiGenerations / 500) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Imagens, vídeos, criativos
              </p>
            </Card>

            {/* Scheduled Posts */}
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <Lock className="w-6 h-6 text-primary mr-3" />
                <h4 className="font-bold">Publicações Agendadas</h4>
              </div>
              <div className="mb-4">
                <p className="text-3xl font-bold">
                  {limits.scheduledPosts === 999999
                    ? "∞"
                    : limits.scheduledPosts.toLocaleString("pt-BR")}
                </p>
                <p className="text-sm text-muted-foreground">
                  por mês
                </p>
              </div>
              <div className="bg-secondary/20 rounded-full h-2">
                <div
                  className="bg-secondary h-2 rounded-full"
                  style={{
                    width: `${Math.min(
                      (limits.scheduledPosts / 200) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Posts automáticos
              </p>
            </Card>

            {/* Team Members */}
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <Users className="w-6 h-6 text-primary mr-3" />
                <h4 className="font-bold">Membros da Equipe</h4>
              </div>
              <div className="mb-4">
                <p className="text-3xl font-bold">
                  {limits.teamMembers === 999 ? "∞" : limits.teamMembers}
                </p>
                <p className="text-sm text-muted-foreground">
                  usuários
                </p>
              </div>
              <div className="bg-secondary/20 rounded-full h-2">
                <div
                  className="bg-secondary h-2 rounded-full"
                  style={{
                    width: `${Math.min(
                      (limits.teamMembers / 5) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Acesso colaborativo
              </p>
            </Card>

            {/* API Calls */}
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <AlertCircle className="w-6 h-6 text-primary mr-3" />
                <h4 className="font-bold">Chamadas de API/Mês</h4>
              </div>
              <div className="mb-4">
                <p className="text-3xl font-bold">
                  {limits.apiCalls === 999999
                    ? "∞"
                    : limits.apiCalls.toLocaleString("pt-BR")}
                </p>
                <p className="text-sm text-muted-foreground">
                  requisições
                </p>
              </div>
              <div className="bg-secondary/20 rounded-full h-2">
                <div
                  className="bg-secondary h-2 rounded-full"
                  style={{
                    width: `${Math.min(
                      (limits.apiCalls / 50000) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Integrações
              </p>
            </Card>
          </div>
        </div>

        {/* Upgrade Options */}
        {userPlan !== "enterprise" && (
          <Card className="p-8 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
            <h3 className="text-2xl font-bold mb-4">Quer Mais Recursos?</h3>
            <p className="text-muted-foreground mb-6">
              Atualize seu plano para desbloquear mais recursos e limites
              maiores.
            </p>
            <div className="flex gap-4">
              {userPlan === "starter" && (
                <Button size="lg" className="bg-gradient-to-r from-primary to-secondary">
                  Atualizar para Professional
                </Button>
              )}
              <Button size="lg" variant="outline">
                Ver Plano Enterprise
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
