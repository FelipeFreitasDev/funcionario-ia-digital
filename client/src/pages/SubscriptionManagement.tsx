import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowUp,
  ArrowDown,
  X,
  Check,
  AlertCircle,
  Calendar,
  CreditCard,
  LogOut,
} from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: 99,
    description: "Perfeito para iniciantes",
    features: [
      "1 plataforma e-commerce",
      "Todas as 6 redes sociais",
      "100 gerações de IA/mês",
      "50 publicações agendadas",
    ],
  },
  {
    id: "professional",
    name: "Professional",
    price: 299,
    description: "Ideal para agências",
    features: [
      "3 plataformas e-commerce",
      "Todas as 6 redes sociais",
      "500 gerações de IA/mês",
      "200 publicações agendadas",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 999,
    description: "Para grandes operações",
    features: [
      "Plataformas ilimitadas",
      "Todas as 6 redes sociais",
      "Gerações ilimitadas",
      "Publicações ilimitadas",
    ],
  },
];

export default function SubscriptionManagement() {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const currentPlan = PLANS.find((p) => p.id === user?.currentPlanId);
  const nextBillingDate = user?.nextBillingDate
    ? new Date(user.nextBillingDate).toLocaleDateString("pt-BR")
    : "N/A";

  const handleUpgrade = (planId: string) => {
    if (planId === user?.currentPlanId) return;
    alert(`Redirecionando para upgrade do plano...`);
  };

  const handleDowngrade = (planId: string) => {
    if (planId === user?.currentPlanId) return;
    alert(`Redirecionando para downgrade do plano...`);
  };

  const handleCancelSubscription = async () => {
    try {
      alert("Assinatura cancelada com sucesso!");
      setShowCancelModal(false);
      navigate("/");
    } catch (error) {
      alert("Erro ao cancelar assinatura");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Gerenciar Assinatura</h1>
          <Button
            variant="outline"
            size="sm"
            onClick={logout}
            className="border-slate-600 text-slate-300 hover:bg-slate-800"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Current Subscription */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">
            Sua Assinatura Atual
          </h2>
          {currentPlan ? (
            <Card className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-cyan-500/30 p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-3xl font-bold text-white mb-2">
                    {currentPlan.name}
                  </h3>
                  <p className="text-slate-300 mb-6">{currentPlan.description}</p>
                  <div className="space-y-2 mb-6">
                    {currentPlan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Check className="w-5 h-5 text-cyan-400" />
                        <span className="text-slate-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                    <div className="flex items-center gap-2 mb-2">
                      <CreditCard className="w-5 h-5 text-cyan-400" />
                      <span className="text-slate-400 text-sm">Valor Mensal</span>
                    </div>
                    <p className="text-3xl font-bold text-white">
                      R$ {currentPlan.price}
                    </p>
                  </div>

                  <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-5 h-5 text-cyan-400" />
                      <span className="text-slate-400 text-sm">
                        Próxima Renovação
                      </span>
                    </div>
                    <p className="text-lg font-semibold text-white">
                      {nextBillingDate}
                    </p>
                  </div>

                  <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-5 h-5 text-cyan-400" />
                      <span className="text-slate-400 text-sm">Status</span>
                    </div>
                    <p className="text-lg font-semibold text-green-400">
                      {user?.subscriptionStatus === "active"
                        ? "Ativo"
                        : "Inativo"}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="bg-slate-800/50 border-slate-700 p-8 text-center">
              <p className="text-slate-300 mb-4">
                Você não possui uma assinatura ativa
              </p>
              <Button
                onClick={() => navigate("/subscription-plans")}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:opacity-90 text-white"
              >
                Ver Planos
              </Button>
            </Card>
          )}
        </div>

        {/* Change Plan */}
        {currentPlan && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">
              Mudar de Plano
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {PLANS.map((plan) => {
                const isCurrent = plan.id === user?.currentPlanId;
                const isUpgrade = PLANS.indexOf(plan) > PLANS.indexOf(currentPlan);

                return (
                  <Card
                    key={plan.id}
                    className={`bg-slate-800/50 border-slate-700 p-6 ${
                      isCurrent ? "ring-2 ring-cyan-500" : ""
                    }`}
                  >
                    <h3 className="text-xl font-bold text-white mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-slate-400 text-sm mb-4">
                      {plan.description}
                    </p>
                    <p className="text-2xl font-bold text-white mb-6">
                      R$ {plan.price}
                    </p>

                    {isCurrent ? (
                      <Button
                        disabled
                        className="w-full bg-slate-700 text-slate-400"
                      >
                        Plano Atual
                      </Button>
                    ) : isUpgrade ? (
                      <Button
                        onClick={() => handleUpgrade(plan.id)}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:opacity-90 text-white"
                      >
                        <ArrowUp className="w-4 h-4 mr-2" />
                        Fazer Upgrade
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleDowngrade(plan.id)}
                        className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:opacity-90 text-white"
                      >
                        <ArrowDown className="w-4 h-4 mr-2" />
                        Fazer Downgrade
                      </Button>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Danger Zone */}
        {currentPlan && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Zona de Risco</h2>
            <Card className="bg-red-900/20 border-red-500/30 p-8">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold text-red-400 mb-2">
                    Cancelar Assinatura
                  </h3>
                  <p className="text-slate-300">
                    Você perderá acesso ao Dashboard e a todos os recursos.
                  </p>
                </div>
                <Button
                  onClick={() => setShowCancelModal(true)}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancelar Assinatura
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="bg-slate-800 border-slate-700 max-w-md w-full p-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              Cancelar Assinatura?
            </h3>
            <p className="text-slate-300 mb-6">
              Tem certeza que deseja cancelar? Você perderá acesso imediato ao
              Dashboard.
            </p>

            <div className="mb-6">
              <label className="block text-sm text-slate-300 mb-2">
                Por que está cancelando? (opcional)
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Sua opinião nos ajuda a melhorar..."
                className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                rows={3}
              />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setShowCancelModal(false)}
                variant="outline"
                className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                Manter Assinatura
              </Button>
              <Button
                onClick={handleCancelSubscription}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                Cancelar Mesmo Assim
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
