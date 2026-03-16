import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Zap, Shield, Brain, Cpu, Workflow, BarChart3, Check, X } from "lucide-react";
import { SpecificationModal } from "@/components/SpecificationModal";

/**
 * Design: Futuristic Minimalist with Dynamic Gradients
 * Color Palette: Deep Black (#0a0e27) + Electric Blue (#00d9ff) + Vibrant Purple (#8b5cf6)
 * Typography: Space Grotesk (Display) + Inter (Body)
 * Layout: Asymmetric sections with diagonal cuts and animated gradients
 */

const PRICING_PLANS = [
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
    stripeLink: "https://buy.stripe.com/starter", // Você vai substituir com seu link real
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
    stripeLink: "https://buy.stripe.com/professional",
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
    stripeLink: "https://buy.stripe.com/enterprise",
  },
];

const TESTIMONIALS = [
  {
    name: "Marina Silva",
    role: "Proprietária de Loja E-commerce",
    text: "O Funcionário Digital aumentou minha produtividade em 300%. Agora publico em 3 plataformas simultaneamente sem esforço.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marina",
  },
  {
    name: "Carlos Mendes",
    role: "Gerente de Marketing Digital",
    text: "Economizei R$ 5.000/mês em agência. O sistema faz o trabalho de 2 pessoas sozinho.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos",
  },
  {
    name: "Ana Costa",
    role: "Empreendedora Digital",
    text: "Finalmente tenho tempo para estratégia enquanto o Funcionário Digital cuida da execução.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana",
  },
];

const FAQ = [
  {
    question: "Posso testar antes de pagar?",
    answer: "Sim! Oferecemos 7 dias de teste gratuito com acesso completo ao plano Starter.",
  },
  {
    question: "Posso cancelar a qualquer momento?",
    answer: "Claro! Você pode cancelar sua assinatura a qualquer momento, sem multa ou compromisso.",
  },
  {
    question: "Qual é a diferença entre os planos?",
    answer: "A principal diferença é o número de plataformas e-commerce conectadas, gerações de IA/mês e contas por rede social. Todos os planos incluem acesso a todas as 6 redes sociais.",
  },
  {
    question: "Vocês oferecem suporte?",
    answer: "Sim! Starter tem suporte por email, Professional tem chat prioritário, e Enterprise tem suporte 24/7 com Slack dedicado.",
  },
  {
    question: "Posso fazer upgrade ou downgrade?",
    answer: "Sim! Você pode mudar de plano a qualquer momento. A mudança é processada imediatamente.",
  },
  {
    question: "Quais plataformas de e-commerce são suportadas?",
    answer: "Shopee, Mercado Livre, Amazon, Loja Integrada, WooCommerce e mais. Enterprise suporta integrações customizadas.",
  },
];

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();
  const [specModalOpen, setSpecModalOpen] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Brain className="w-6 h-6 text-background" />
            </div>
            <span className="font-bold text-xl">Funcionário Digital</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#features" className="text-sm hover:text-primary transition">Skills</a>
            <a href="#pricing" className="text-sm hover:text-primary transition">Planos</a>
            <a href="#faq" className="text-sm hover:text-primary transition">FAQ</a>
            {isAuthenticated ? (
              <a href="/dashboard">
                <Button size="sm" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-background font-bold">
                  Dashboard
                </Button>
              </a>
            ) : (
              <a href="#pricing">
                <Button size="sm" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-background font-bold">
                  🚀 Começar Agora
                </Button>
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-secondary/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        </div>

        <div className="container grid grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="space-y-3">
              <h1 className="text-5xl font-bold leading-tight">
                Seu <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Funcionário Digital</span> Autônomo
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Uma IA inteligente que trabalha 24h automatizando e-commerce, marketing digital e redes sociais. Sem limites de uso, sem custos ocultos.
              </p>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <a href="#pricing" className="flex-1">
                <Button size="lg" className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-background gap-2 font-bold">
                  🚀 Ver Planos <ArrowRight className="w-4 h-4" />
                </Button>
              </a>
              <Button size="lg" variant="outline" className="border-primary/30 hover:bg-primary/10" onClick={() => setSpecModalOpen(true)}>
                Ver Especificação
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-border">
              <div>
                <div className="text-2xl font-bold text-primary">24/7</div>
                <div className="text-sm text-muted-foreground">Trabalho Autônomo</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-secondary">3</div>
                <div className="text-sm text-muted-foreground">Planos Flexíveis</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">6</div>
                <div className="text-sm text-muted-foreground">Redes Sociais</div>
              </div>
            </div>
          </div>

          <div className="relative h-96 rounded-2xl overflow-hidden border border-border/50">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663438547756/SdYSRiFyv5LnWNYthZFfV8/hero-ai-assistant-jyDJu77L7DwuAzc7BbznmA.webp"
              alt="AI Assistant"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 border-t border-border relative overflow-hidden">
        <svg className="absolute top-0 left-0 w-full h-24 -mt-1" viewBox="0 0 1200 100" preserveAspectRatio="none">
          <polygon points="0,0 1200,0 1200,100 0,50" fill="#1a1f3a" opacity="0.5" />
        </svg>

        <div className="container pt-12">
          <div className="space-y-4 mb-16">
            <h2 className="text-4xl font-bold">Skills Especializadas</h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Um assistente completo com capacidades em múltiplas áreas, funcionando como um verdadeiro funcionário digital.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {[
              { icon: Cpu, title: "E-commerce", desc: "Pesquisa de produtos, análise de nicho, precificação e publicação automática" },
              { icon: Zap, title: "Marketing Digital", desc: "Redes sociais, SEO, campanhas e análise de métricas em tempo real" },
              { icon: BarChart3, title: "Analytics", desc: "Dashboard de vendas, ROI por plataforma e tendências de mercado" },
              { icon: Brain, title: "Criação de Conteúdo", desc: "Geração de imagens, vídeos e textos com IA" },
              { icon: Workflow, title: "Automação", desc: "Agendamento, sincronização e publicação em múltiplas plataformas" },
              { icon: Shield, title: "Segurança", desc: "Isolamento de dados por usuário, criptografia e auditoria completa" },
            ].map((skill, idx) => (
              <Card key={idx} className="p-6 border-border/50 hover:border-primary/50 transition-all group cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 group-hover:from-primary/30 group-hover:to-secondary/30 transition-all">
                    <skill.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">{skill.title}</h3>
                    <p className="text-sm text-muted-foreground">{skill.desc}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 border-t border-border relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        </div>

        <div className="container">
          <div className="space-y-4 mb-16 text-center">
            <h2 className="text-4xl font-bold">Planos Simples e Transparentes</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Escolha o plano perfeito para seu negócio. Sem cobranças ocultas, cancele quando quiser.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-8">
            {PRICING_PLANS.map((plan, idx) => (
              <Card
                key={idx}
                className={`relative p-8 transition-all ${
                  plan.highlighted
                    ? "border-primary/50 shadow-lg shadow-primary/20 scale-105"
                    : "border-border/50 hover:border-primary/30"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <span className="bg-gradient-to-r from-primary to-secondary text-background text-xs font-bold px-4 py-1 rounded-full">
                      MAIS POPULAR
                    </span>
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold">R$ {plan.price}</span>
                      <span className="text-muted-foreground">/mês</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Faturamento mensal. Cancele a qualquer momento.</p>
                  </div>

                  <a href={plan.stripeLink} target="_blank" rel="noopener noreferrer" className="w-full">
                    <Button
                      size="lg"
                      className={`w-full font-bold ${
                        plan.highlighted
                          ? "bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-background"
                          : "border border-primary/30 hover:bg-primary/10"
                      }`}
                      variant={plan.highlighted ? "default" : "outline"}
                    >
                      {plan.cta}
                    </Button>
                  </a>

                  <div className="space-y-3 pt-6 border-t border-border">
                    {plan.features.map((feature, fidx) => (
                      <div key={fidx} className="flex items-start gap-3">
                        {feature.included ? (
                          <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        ) : (
                          <X className="w-5 h-5 text-muted-foreground/50 flex-shrink-0 mt-0.5" />
                        )}
                        <span className={feature.included ? "text-sm" : "text-sm text-muted-foreground/50"}>
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-12 p-6 bg-primary/5 border border-primary/20 rounded-lg text-center">
            <p className="text-muted-foreground mb-4">
              Precisa de uma solução customizada? Entre em contato conosco para um plano Enterprise personalizado.
            </p>
            <Button variant="outline" className="border-primary/30 hover:bg-primary/10">
              Falar com Vendas
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 border-t border-border">
        <div className="container">
          <div className="space-y-4 mb-16 text-center">
            <h2 className="text-4xl font-bold">O que Nossos Clientes Dizem</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Veja como o Funcionário Digital transformou negócios reais.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-8">
            {TESTIMONIALS.map((testimonial, idx) => (
              <Card key={idx} className="p-6 border-border/50 hover:border-primary/30 transition-all">
                <div className="space-y-4">
                  <p className="text-muted-foreground italic">"{testimonial.text}"</p>
                  <div className="flex items-center gap-4 pt-4 border-t border-border">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 border-t border-border">
        <div className="container max-w-3xl">
          <div className="space-y-4 mb-16 text-center">
            <h2 className="text-4xl font-bold">Perguntas Frequentes</h2>
            <p className="text-lg text-muted-foreground">
              Respostas para as dúvidas mais comuns sobre o Funcionário Digital.
            </p>
          </div>

          <div className="space-y-4">
            {FAQ.map((item, idx) => (
              <Card
                key={idx}
                className="p-6 border-border/50 cursor-pointer hover:border-primary/30 transition-all"
                onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">{item.question}</h3>
                  <span className={`text-primary transition-transform ${expandedFaq === idx ? "rotate-180" : ""}`}>
                    ▼
                  </span>
                </div>
                {expandedFaq === idx && (
                  <p className="text-muted-foreground mt-4">{item.answer}</p>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final Section */}
      <section className="py-20 border-t border-border relative overflow-hidden">
        <svg className="absolute bottom-0 left-0 w-full h-24 -mb-1" viewBox="0 0 1200 100" preserveAspectRatio="none">
          <polygon points="0,50 1200,100 1200,100 0,0" fill="#1a1f3a" opacity="0.5" />
        </svg>

        <div className="container text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold">Pronto para Transformar Seu Negócio?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comece agora com o Funcionário Digital. Teste grátis por 7 dias, sem cartão de crédito.
            </p>
          </div>

          <div className="flex items-center justify-center gap-4">
            <a href="#pricing">
              <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-background gap-2 font-bold">
                🚀 Começar Agora <ArrowRight className="w-4 h-4" />
              </Button>
            </a>
            <Button size="lg" variant="outline" className="border-primary/30 hover:bg-primary/10">
              Agendar Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2026 Funcionário Digital. Todos os direitos reservados.</p>
        </div>
      </footer>

      <SpecificationModal open={specModalOpen} onOpenChange={setSpecModalOpen} />
    </div>
  );
}
