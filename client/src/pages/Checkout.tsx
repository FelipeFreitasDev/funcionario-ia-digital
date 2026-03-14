import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Zap, Shield, Cpu, Clock, Users, TrendingUp, ArrowRight, AlertCircle } from "lucide-react";

/**
 * Checkout Page: Página de Vendas com Integração Kiwify
 * Design: Futuristic Minimalist com urgência e valor
 * Preço: R$ 299,90 (Desconto de 3.499,90)
 */

export default function Checkout() {
  const [selectedPlan, setSelectedPlan] = useState("lifetime");
  const [showWarning, setShowWarning] = useState(true);

  const handleKiwifyCheckout = () => {
    // Redireciona para Kiwify
    // Substitua com o link real da sua página Kiwify
    window.location.href = "https://kiwify.com.br/seu-link-aqui";
  };

  const features = [
    { icon: Cpu, text: "100% Offline - Nenhuma dependência de APIs externas" },
    { icon: Zap, text: "Processamento em tempo real (<500ms latência)" },
    { icon: Shield, text: "Criptografia AES-256 - Seus dados nunca saem do seu PC" },
    { icon: Clock, text: "Suporte a Português-BR com sotaque regional" },
    { icon: Users, text: "Aprende com você - Personalização profunda" },
    { icon: TrendingUp, text: "Automação de 6 áreas: Admin, Marketing, E-commerce, Dev, Conteúdo, Pesquisa" },
  ];

  const testimonials = [
    {
      name: "Carlos Silva",
      role: "Empreendedor Digital",
      text: "Economizei R$ 15.000/mês em ferramentas de IA. O Funcionário Digital faz tudo que 3 pessoas faziam antes.",
      rating: 5,
    },
    {
      name: "Marina Costa",
      role: "Gestora de E-commerce",
      text: "Meu negócio cresceu 300% em 3 meses. O assistente gerencia tudo automaticamente.",
      rating: 5,
    },
    {
      name: "João Pereira",
      role: "Desenvolvedor Web",
      text: "Nunca vi algo tão poderoso e offline. Recomendo para todo mundo que trabalha com IA.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container flex items-center justify-between py-4">
          <a href="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Zap className="w-6 h-6 text-background" />
            </div>
            <span className="font-bold text-xl">Funcionário Digital</span>
          </a>
          <a href="/" className="text-sm hover:text-primary transition">Voltar</a>
        </div>
      </nav>

      <div className="pt-24 pb-12">
        {/* Urgency Banner */}
        {showWarning && (
          <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 backdrop-blur-sm">
            <div className="container py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-sm font-semibold">
                  ⏰ Promoção Limitada: R$ 299,90 (era R$ 3.499,90) - Apenas 24 horas!
                </p>
              </div>
              <button onClick={() => setShowWarning(false)} className="text-xs hover:opacity-70">✕</button>
            </div>
          </div>
        )}

        <div className="container">
          <div className="grid grid-cols-2 gap-12 items-start py-12">
            {/* Left: Sales Copy */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-block px-3 py-1 rounded-full bg-primary/20 border border-primary/30">
                  <span className="text-sm font-semibold text-primary">🚀 Lançamento Especial</span>
                </div>
                <h1 className="text-5xl font-bold leading-tight">
                  Seu <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Funcionário Digital</span> 24/7
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Uma IA autônoma que trabalha offline, sem custos recorrentes, executando desde tarefas administrativas até operações complexas de e-commerce, marketing e desenvolvimento web.
                </p>
              </div>

              {/* Price Section */}
              <div className="space-y-4 p-6 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 to-secondary/10">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Preço Original</p>
                  <p className="text-3xl font-bold line-through text-muted-foreground">R$ 3.499,90</p>
                </div>
                <div className="space-y-2 pt-4 border-t border-border">
                  <p className="text-sm text-primary font-semibold">🎁 Preço Especial (por 24h)</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-primary">R$ 299,90</span>
                    <span className="text-lg text-red-500 font-bold">-91% OFF</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-2">Você economiza:</p>
                  <p className="text-2xl font-bold text-green-500">R$ 3.200,00</p>
                </div>
              </div>

              {/* CTA Button */}
              <Button
                size="lg"
                onClick={handleKiwifyCheckout}
                className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-background font-bold text-lg py-6 gap-2"
              >
                🔓 Desbloquear Acesso Agora <ArrowRight className="w-5 h-5" />
              </Button>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">1000+</p>
                  <p className="text-xs text-muted-foreground">Usuários Ativos</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-secondary">4.9★</p>
                  <p className="text-xs text-muted-foreground">Avaliação Média</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">100%</p>
                  <p className="text-xs text-muted-foreground">Offline & Seguro</p>
                </div>
              </div>

              {/* Money Back Guarantee */}
              <div className="p-4 rounded-lg border border-green-500/30 bg-green-500/5">
                <p className="text-sm text-green-500 font-semibold">✓ Garantia de 30 dias ou seu dinheiro de volta</p>
                <p className="text-xs text-muted-foreground mt-1">Sem perguntas, sem complicações. Se não gostar, devolvemos 100%.</p>
              </div>
            </div>

            {/* Right: Features & Social Proof */}
            <div className="space-y-8">
              {/* Features List */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">O que você recebe:</h2>
                <div className="space-y-3">
                  {features.map((feature, idx) => {
                    const Icon = feature.icon;
                    return (
                      <div key={idx} className="flex items-start gap-3 p-3 rounded-lg hover:bg-card/50 transition">
                        <Icon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <p className="text-sm leading-relaxed">{feature.text}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Skills Included */}
              <div className="space-y-4 p-6 rounded-lg border border-border/50 bg-card/50">
                <h3 className="font-bold text-lg">6 Áreas de Especialização:</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    "📧 Administração",
                    "📱 Marketing Digital",
                    "🛒 E-commerce",
                    "💻 Desenvolvimento",
                    "✍️ Criação de Conteúdo",
                    "🔍 Pesquisa & IA",
                  ].map((skill, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary" />
                      {skill}
                    </div>
                  ))}
                </div>
              </div>

              {/* Testimonials */}
              <div className="space-y-4">
                <h3 className="font-bold text-lg">O que dizem nossos usuários:</h3>
                <div className="space-y-3">
                  {testimonials.map((testimonial, idx) => (
                    <Card key={idx} className="p-4 border-border/50">
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <span key={i} className="text-yellow-500">★</span>
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">"{testimonial.text}"</p>
                      <div>
                        <p className="text-sm font-semibold">{testimonial.name}</p>
                        <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-16 py-12 border-t border-border">
            <h2 className="text-3xl font-bold mb-8 text-center">Perguntas Frequentes</h2>
            <div className="grid grid-cols-2 gap-6 max-w-4xl mx-auto">
              {[
                {
                  q: "Como funciona o download após o pagamento?",
                  a: "Após confirmar o pagamento na Kiwify, você receberá um link de download exclusivo com o executável do Assistente.",
                },
                {
                  q: "O assistente realmente funciona 100% offline?",
                  a: "Sim! Todos os modelos de IA rodam localmente no seu PC. Você pode desconectar da internet e continuar usando.",
                },
                {
                  q: "Quais são os requisitos de hardware?",
                  a: "Mínimo: Intel i5, 16GB RAM, 100GB SSD. Recomendado: Intel i7, 32GB RAM, GPU NVIDIA RTX 3060.",
                },
                {
                  q: "Há custos recorrentes ou taxas de uso?",
                  a: "Não! Você paga uma única vez e tem acesso ilimitado. Sem assinaturas, sem limites de uso.",
                },
                {
                  q: "Posso usar em múltiplos computadores?",
                  a: "Sim! Sua licença é pessoal e pode ser instalada em até 3 computadores.",
                },
                {
                  q: "E se eu não gostar? Há reembolso?",
                  a: "Sim! Garantia de 30 dias. Se não ficar satisfeito, devolvemos 100% do seu dinheiro.",
                },
              ].map((faq, idx) => (
                <div key={idx} className="space-y-2">
                  <h4 className="font-semibold text-primary">{faq.q}</h4>
                  <p className="text-sm text-muted-foreground">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Final CTA */}
          <div className="mt-16 p-12 rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 to-secondary/10 text-center space-y-6">
            <h2 className="text-4xl font-bold">Não deixe passar esta oportunidade!</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Desconto de 91% válido por apenas 24 horas. Após isso, o preço volta para R$ 3.499,90.
            </p>
            <Button
              size="lg"
              onClick={handleKiwifyCheckout}
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-background font-bold text-lg px-8 py-6 gap-2"
            >
              ⚡ Garantir Meu Acesso Agora <ArrowRight className="w-5 h-5" />
            </Button>
            <p className="text-sm text-muted-foreground">
              Pagamento seguro via Kiwify • Acesso instantâneo após confirmação
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-8 bg-card/50 mt-16">
        <div className="container text-center text-sm text-muted-foreground">
          <p>&copy; 2026 Funcionário Digital. Todos os direitos reservados.</p>
          <p className="mt-2">Desenvolvido com IA e ❤️ | <a href="#" className="hover:text-foreground">Privacidade</a> • <a href="#" className="hover:text-foreground">Termos</a></p>
        </div>
      </footer>
    </div>
  );
}
