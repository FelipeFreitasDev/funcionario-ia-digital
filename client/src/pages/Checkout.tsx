import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Zap, Shield, Cpu, Clock, Users, TrendingUp, ArrowRight, AlertCircle, X } from "lucide-react";
import { redirectToKiwifyCheckout, KIWIFY_CONFIG } from "@/config/kiwify";

/**
 * Checkout Page: Página de Vendas Mobile-First Responsiva
 * Design: Futuristic Minimalist com urgência e valor
 * Preço: R$ 299,90 (Desconto de 3.499,90)
 * Otimizado para: Mobile (320px+), Tablet (768px+), Desktop (1024px+)
 */

export default function Checkout() {
  const [showWarning, setShowWarning] = useState(true);

  const handleKiwifyCheckout = () => {
    redirectToKiwifyCheckout();
  };

  const features = [
    { icon: Cpu, text: "100% Offline" },
    { icon: Zap, text: "Processamento Ultra-Rápido" },
    { icon: Shield, text: "Criptografia AES-256" },
    { icon: Clock, text: "Português-BR Nativo" },
    { icon: Users, text: "Aprende com Você" },
    { icon: TrendingUp, text: "6 Áreas de Automação" },
  ];

  const testimonials = [
    {
      name: "Carlos Silva",
      role: "Empreendedor",
      text: "Economizei R$ 15.000/mês em ferramentas.",
      rating: 5,
    },
    {
      name: "Marina Costa",
      role: "Gestora E-commerce",
      text: "Negócio cresceu 300% em 3 meses.",
      rating: 5,
    },
    {
      name: "João Pereira",
      role: "Dev Web",
      text: "Nunca vi algo tão poderoso offline.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container flex items-center justify-between py-3 px-4 sm:py-4">
          <a href="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
              <Zap className="w-4 h-4 sm:w-6 sm:h-6 text-background" />
            </div>
            <span className="font-bold text-sm sm:text-xl hidden xs:inline">Funcionário Digital</span>
          </a>
          <a href="/" className="text-xs sm:text-sm hover:text-primary transition">Voltar</a>
        </div>
      </nav>

      <div className="pt-16 sm:pt-24 pb-8 sm:pb-12">
        {/* Urgency Banner */}
        {showWarning && (
          <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border-b border-red-500/30 backdrop-blur-sm sticky top-16 z-40">
            <div className="container px-4 py-2 sm:py-3 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 flex-shrink-0" />
                <p className="text-xs sm:text-sm font-semibold truncate">
                  ⏰ Promoção: R$ 299,90 (era R$ 3.499,90) - 24h!
                </p>
              </div>
              <button onClick={() => setShowWarning(false)} className="text-xs hover:opacity-70 flex-shrink-0">✕</button>
            </div>
          </div>
        )}

        <div className="container px-4 sm:px-6">
          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 py-8 sm:py-12">
            {/* Left: Sales Copy */}
            <div className="space-y-6 sm:space-y-8 order-2 lg:order-1">
              {/* Badge */}
              <div className="inline-block px-3 py-1 rounded-full bg-primary/20 border border-primary/30">
                <span className="text-xs sm:text-sm font-semibold text-primary">🚀 Lançamento Especial</span>
              </div>

              {/* Headline */}
              <div className="space-y-3 sm:space-y-4">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                  Seu <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Funcionário Digital</span> 24/7
                </h1>
                <p className="text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed">
                  Uma IA autônoma que trabalha offline, sem custos recorrentes, executando desde tarefas administrativas até operações complexas.
                </p>
              </div>

              {/* Price Section - Mobile Optimized */}
              <div className="space-y-4 p-4 sm:p-6 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 to-secondary/10">
                <div className="space-y-2">
                  <p className="text-xs sm:text-sm text-muted-foreground">Preço Original</p>
                  <p className="text-2xl sm:text-3xl font-bold line-through text-muted-foreground">R$ {(KIWIFY_CONFIG.ORIGINAL_PRICE_CENTS / 100).toFixed(2).replace('.', ',')}</p>
                </div>
                <div className="space-y-2 pt-4 border-t border-border">
                  <p className="text-xs sm:text-sm text-primary font-semibold">🎁 Preço Especial (24h)</p>
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-4xl sm:text-5xl font-bold text-primary">R$ {(KIWIFY_CONFIG.PRICE_CENTS / 100).toFixed(2).replace('.', ',')}</span>
                    <span className="text-base sm:text-lg text-red-500 font-bold">-{KIWIFY_CONFIG.DISCOUNT_PERCENTAGE}%</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-2">Você economiza:</p>
                  <p className="text-2xl sm:text-3xl font-bold text-green-500">R$ {((KIWIFY_CONFIG.ORIGINAL_PRICE_CENTS - KIWIFY_CONFIG.PRICE_CENTS) / 100).toFixed(2).replace('.', ',')}</p>
                </div>
              </div>

              {/* CTA Button - Mobile Optimized */}
              <Button
                size="lg"
                onClick={handleKiwifyCheckout}
                className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-background font-bold text-base sm:text-lg py-6 sm:py-7 gap-2 h-auto"
              >
                🔓 Desbloquear Acesso Agora <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>

              {/* Trust Badges - Mobile Optimized */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-4">
                <div className="text-center p-2 sm:p-3 rounded-lg bg-card/50 border border-border/50">
                  <p className="text-xl sm:text-2xl font-bold text-primary">1000+</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Usuários</p>
                </div>
                <div className="text-center p-2 sm:p-3 rounded-lg bg-card/50 border border-border/50">
                  <p className="text-xl sm:text-2xl font-bold text-secondary">4.9★</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Avaliação</p>
                </div>
                <div className="text-center p-2 sm:p-3 rounded-lg bg-card/50 border border-border/50">
                  <p className="text-xl sm:text-2xl font-bold text-primary">100%</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Offline</p>
                </div>
              </div>

              {/* Money Back Guarantee */}
              <div className="p-3 sm:p-4 rounded-lg border border-green-500/30 bg-green-500/5">
                <p className="text-xs sm:text-sm text-green-500 font-semibold">✓ Garantia de 30 dias ou seu dinheiro de volta</p>
                <p className="text-xs text-muted-foreground mt-1">Sem perguntas, sem complicações.</p>
              </div>
            </div>

            {/* Right: Features & Social Proof */}
            <div className="space-y-6 sm:space-y-8 order-1 lg:order-2">
              {/* Features List - Mobile Optimized */}
              <div className="space-y-3 sm:space-y-4">
                <h2 className="text-xl sm:text-2xl font-bold">O que você recebe:</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  {features.map((feature, idx) => {
                    const Icon = feature.icon;
                    return (
                      <div key={idx} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg hover:bg-card/50 transition">
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                        <p className="text-xs sm:text-sm leading-tight">{feature.text}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Skills Included */}
              <div className="space-y-3 sm:space-y-4 p-4 sm:p-6 rounded-lg border border-border/50 bg-card/50">
                <h3 className="font-bold text-base sm:text-lg">6 Áreas de Especialização:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  {[
                    "📧 Administração",
                    "📱 Marketing Digital",
                    "🛒 E-commerce",
                    "💻 Desenvolvimento",
                    "✍️ Criação de Conteúdo",
                    "🔍 Pesquisa & IA",
                  ].map((skill, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm">
                      <Check className="w-3 h-3 sm:w-4 sm:h-4 text-primary flex-shrink-0" />
                      <span>{skill}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Testimonials - Mobile Optimized */}
              <div className="space-y-3 sm:space-y-4">
                <h3 className="font-bold text-base sm:text-lg">O que dizem nossos usuários:</h3>
                <div className="space-y-3">
                  {testimonials.map((testimonial, idx) => (
                    <Card key={idx} className="p-3 sm:p-4 border-border/50">
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <span key={i} className="text-yellow-500 text-sm">★</span>
                        ))}
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground mb-2">"{testimonial.text}"</p>
                      <div>
                        <p className="text-xs sm:text-sm font-semibold">{testimonial.name}</p>
                        <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section - Mobile Optimized */}
          <div className="mt-12 sm:mt-16 py-8 sm:py-12 border-t border-border">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center">Perguntas Frequentes</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
              {[
                {
                  q: "Como funciona o download?",
                  a: "Após o pagamento, você recebe um link exclusivo com o executável.",
                },
                {
                  q: "Funciona 100% offline?",
                  a: "Sim! Todos os modelos rodam localmente. Desconecte da internet e continue usando.",
                },
                {
                  q: "Quais são os requisitos?",
                  a: "Mínimo: Intel i5, 16GB RAM, 100GB SSD. Recomendado: i7, 32GB, GPU NVIDIA.",
                },
                {
                  q: "Há custos recorrentes?",
                  a: "Não! Você paga uma única vez. Sem assinaturas, sem limites de uso.",
                },
                {
                  q: "Posso usar em múltiplos PCs?",
                  a: "Sim! Sua licença permite instalação em até 3 computadores.",
                },
                {
                  q: "E se eu não gostar?",
                  a: "Garantia de 30 dias. Se não ficar satisfeito, devolvemos 100%.",
                },
              ].map((faq, idx) => (
                <div key={idx} className="space-y-2">
                  <h4 className="font-semibold text-sm sm:text-base text-primary">{faq.q}</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Final CTA */}
          <div className="mt-8 sm:mt-12 p-6 sm:p-8 lg:p-12 rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 to-secondary/10 text-center space-y-4 sm:space-y-6">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Não deixe passar!</h2>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">
              Desconto de 91% válido por apenas 24 horas. Após isso, o preço volta para R$ 3.499,90.
            </p>
            <Button
              size="lg"
              onClick={handleKiwifyCheckout}
              className="w-full sm:w-auto bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-background font-bold text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 gap-2 h-auto"
            >
              ⚡ Garantir Meu Acesso <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Pagamento seguro via Kiwify • Acesso instantâneo
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-6 sm:py-8 bg-card/50 mt-12 sm:mt-16">
        <div className="container px-4 text-center text-xs sm:text-sm text-muted-foreground space-y-2">
          <p>&copy; 2026 Funcionário Digital. Todos os direitos reservados.</p>
          <p>Desenvolvido com IA e ❤️ | <a href="#" className="hover:text-foreground">Privacidade</a> • <a href="#" className="hover:text-foreground">Termos</a></p>
        </div>
      </footer>
    </div>
  );
}
