import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Zap, CheckCircle2, ArrowRight } from "lucide-react";

export default function Home() {
  const loginUrl = getLoginUrl();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Navigation */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Funcionário Digital</h1>
          </div>
          <Button
            onClick={() => window.location.href = loginUrl}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:opacity-90 text-white"
          >
            Acessar SaaS
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-5xl sm:text-6xl font-bold text-white mb-6">
            Seu Assistente de IA Pessoal
          </h2>
          <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
            Automatize tarefas, crie conteúdo e potencialize sua produtividade com inteligência artificial de ponta.
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => window.location.href = loginUrl}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:opacity-90 text-white px-8 py-3 text-lg"
            >
              Acessar SaaS
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-800 px-8 py-3 text-lg"
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Ver Planos
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h3 className="text-3xl font-bold text-white text-center mb-12">Funcionalidades Principais</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "IA Generativa", desc: "Crie conteúdo profissional em segundos" },
            { title: "Automação", desc: "Automatize tarefas repetitivas" },
            { title: "Analytics", desc: "Acompanhe seu desempenho em tempo real" },
          ].map((feature, i) => (
            <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <CheckCircle2 className="w-8 h-8 text-cyan-500 mb-4" />
              <h4 className="text-lg font-semibold text-white mb-2">{feature.title}</h4>
              <p className="text-slate-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h3 className="text-3xl font-bold text-white text-center mb-12">Planos de Preço</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: "Starter", price: "R$ 99", features: ["100 gerações/mês", "Suporte básico"] },
            { name: "Professional", price: "R$ 299", features: ["1000 gerações/mês", "Suporte prioritário"], popular: true },
            { name: "Enterprise", price: "R$ 999", features: ["Ilimitadas", "Suporte 24/7"] },
          ].map((plan, i) => (
            <div
              key={i}
              className={`rounded-lg p-8 ${
                plan.popular
                  ? "bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-2 border-cyan-500"
                  : "bg-slate-800/50 border border-slate-700"
              }`}
            >
              {plan.popular && (
                <div className="text-cyan-400 text-sm font-semibold mb-4">MAIS POPULAR</div>
              )}
              <h4 className="text-2xl font-bold text-white mb-2">{plan.name}</h4>
              <p className="text-4xl font-bold text-white mb-6">{plan.price}</p>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, j) => (
                  <li key={j} className="text-slate-300 flex items-center">
                    <CheckCircle2 className="w-5 h-5 text-cyan-500 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => window.location.href = loginUrl}
                className={`w-full ${
                  plan.popular
                    ? "bg-gradient-to-r from-cyan-500 to-blue-500 hover:opacity-90 text-white"
                    : "bg-slate-700 hover:bg-slate-600 text-white"
                }`}
              >
                Começar Agora
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h3 className="text-3xl font-bold text-white mb-6">Pronto para começar?</h3>
        <p className="text-xl text-slate-400 mb-8">Acesse o SaaS agora e comece a potencializar sua produtividade</p>
        <Button
          onClick={() => window.location.href = loginUrl}
          className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:opacity-90 text-white px-8 py-3 text-lg"
        >
          Acessar SaaS
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-400">
          <p>&copy; 2026 Funcionário Digital. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
