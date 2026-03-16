import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Check, Lock } from "lucide-react";
import { useLocation } from "wouter";

const PLANS = [
  {
    name: "Starter",
    price: 99,
    description: "Perfeito para iniciantes e pequenas lojas",
    features: [
      { text: "1 plataforma e-commerce", included: true },
      { text: "Todas as 6 redes sociais", included: true },
      { text: "100 gerações de IA/mês", included: true },
      { text: "50 publicações agendadas", included: true },
      { text: "1 conta por rede social", included: true },
      { text: "Analytics básico", included: true },
      { text: "Suporte por email", included: true },
      { text: "Múltiplas contas por rede", included: false },
      { text: "API customizada", included: false },
      { text: "Suporte 24/7", included: false },
    ],
    cta: "Começar com Starter",
    highlighted: false,
    stripeLink: "https://buy.stripe.com/4gM3cvd5Z30w04qfhH6Na00",
  },
  {
    name: "Professional",
    price: 299,
    description: "Ideal para agências e médios vendedores",
    features: [
      { text: "3 plataformas e-commerce", included: true },
      { text: "Todas as 6 redes sociais", included: true },
      { text: "500 gerações de IA/mês", included: true },
      { text: "200 publicações agendadas", included: true },
      { text: "3 contas por rede social", included: true },
      { text: "Analytics avançado", included: true },
      { text: "Suporte por chat prioritário", included: true },
      { text: "Múltiplas contas por rede", included: true },
      { text: "API customizada", included: false },
      { text: "Suporte 24/7", included: false },
    ],
    cta: "Começar com Professional",
    highlighted: true,
    stripeLink: "https://buy.stripe.com/3cI00j4ztdFabN82uV6Na01",
  },
  {
    name: "Enterprise",
    price: 999,
    description: "Para grandes agências e operações em escala",
    features: [
      { text: "Plataformas e-commerce ilimitadas", included: true },
      { text: "Todas as 6 redes sociais", included: true },
      { text: "Gerações de IA ilimitadas", included: true },
      { text: "Publicações agendadas ilimitadas", included: true },
      { text: "Contas ilimitadas por rede", included: true },
      { text: "Analytics em tempo real", included: true },
      { text: "Suporte 24/7 + Slack dedicado", included: true },
      { text: "Múltiplas contas por rede", included: true },
      { text: "API customizada", included: true },
      { text: "Suporte 24/7", included: true },
    ],
    cta: "Contatar para Enterprise",
    highlighted: false,
    stripeLink: "https://buy.stripe.com/28EdR99TN1WseZk0mN6Na02",
  },
];

export default function SubscriptionPlans() {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">Funcionário Digital</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-300">Olá, {user?.name || "Usuário"}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="border-slate-600 text-slate-300 hover:bg-slate-800"
            >
              Sair
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 mb-6">
            <Lock className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-cyan-400 font-medium">Acesso Restrito</span>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">
            Escolha Seu Plano
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Desbloqueie o acesso ao Dashboard e comece a automatizar seu negócio agora mesmo.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
          {PLANS.map((plan) => (
            <Card
              key={plan.name}
              className={`relative flex flex-col bg-slate-800/50 border-slate-700 overflow-hidden transition-all duration-300 hover:border-slate-600 ${
                plan.highlighted ? "md:scale-105 ring-2 ring-cyan-500" : ""
              }`}
            >
              {plan.highlighted && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-bold py-1 text-center">
                  MAIS POPULAR
                </div>
              )}

              <div className={`p-6 ${plan.highlighted ? "pt-12" : ""}`}>
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-slate-400 text-sm mb-4">{plan.description}</p>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white">R$ {plan.price}</span>
                    <span className="text-slate-400">/mês</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">Faturamento mensal. Cancele a qualquer momento.</p>
                </div>

                <a href={plan.stripeLink}>
                  <Button
                    className={`w-full mb-6 ${
                      plan.highlighted
                        ? "bg-gradient-to-r from-cyan-500 to-blue-500 hover:opacity-90 text-white"
                        : "bg-slate-700 hover:bg-slate-600 text-white"
                    }`}
                  >
                    {plan.cta}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </a>

                <div className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <Check
                        className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                          feature.included ? "text-cyan-400" : "text-slate-600"
                        }`}
                      />
                      <span
                        className={`text-sm ${
                          feature.included ? "text-slate-300" : "text-slate-500 line-through"
                        }`}
                      >
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Info Box */}
        <div className="max-w-2xl mx-auto bg-blue-500/10 border border-blue-500/30 rounded-lg p-6 text-center">
          <p className="text-slate-300">
            Após escolher um plano e completar o pagamento, você terá acesso imediato ao Dashboard.
          </p>
          <p className="text-slate-400 text-sm mt-2">
            Todos os planos incluem garantia de 30 dias ou seu dinheiro de volta.
          </p>
        </div>
      </div>
    </div>
  );
}
