import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Zap, Shield, Brain, Cpu, Workflow, BarChart3 } from "lucide-react";
import { SpecificationModal } from "@/components/SpecificationModal";

/**
 * Design: Futuristic Minimalist with Dynamic Gradients
 * Color Palette: Deep Black (#0a0e27) + Electric Blue (#00d9ff) + Vibrant Purple (#8b5cf6)
 * Typography: Space Grotesk (Display) + Inter (Body)
 * Layout: Asymmetric sections with diagonal cuts and animated gradients
 */

export default function Home() {
  // The userAuth hooks provides authentication state
  // To implement login/logout functionality, simply call logout() or redirect to getLoginUrl()
  let { user, loading, error, isAuthenticated, logout } = useAuth();

  const [specModalOpen, setSpecModalOpen] = useState(false);

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
              <a href="#architecture" className="text-sm hover:text-primary transition">Arquitetura</a>
              <a href="#roadmap" className="text-sm hover:text-primary transition">Roadmap</a>
              <a href="/checkout">
                <Button size="sm" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-background font-bold">
                  🚀 Comprar Agora
                </Button>
              </a>
            </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-secondary/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        </div>

        <div className="container grid grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <div className="space-y-6">
            <div className="space-y-3">
              <h1 className="text-5xl font-bold leading-tight">
                Seu <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Funcionário Digital</span> Autônomo
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Uma IA 100% offline, sem custos recorrentes, que aprende com você e executa desde tarefas administrativas até operações complexas de e-commerce, marketing e desenvolvimento web.
              </p>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <a href="/checkout" className="flex-1">
                <Button size="lg" className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-background gap-2 font-bold">
                  🔓 Desbloquear Acesso (R$ 299,90) <ArrowRight className="w-4 h-4" />
                </Button>
              </a>
              <Button size="lg" variant="outline" className="border-primary/30 hover:bg-primary/10" onClick={() => setSpecModalOpen(true)}>
                Ver Especificação
              </Button>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-border">
              <div>
                <div className="text-2xl font-bold text-primary">100%</div>
                <div className="text-sm text-muted-foreground">Offline</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-secondary">$0</div>
                <div className="text-sm text-muted-foreground">Custos Recorrentes</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">∞</div>
                <div className="text-sm text-muted-foreground">Sem Limites</div>
              </div>
            </div>
          </div>

          {/* Right: Hero Image */}
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
        {/* Diagonal cut SVG */}
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

          {/* Skills Grid */}
          <div className="grid grid-cols-2 gap-6">
            {[
              { icon: Cpu, title: "Administração", desc: "E-mail, calendário, documentos, transcrição e tarefas" },
              { icon: Zap, title: "Marketing Digital", desc: "Redes sociais, SEO, campanhas e análise de métricas" },
              { icon: BarChart3, title: "E-commerce", desc: "Pesquisa de produtos, análise de nicho e precificação" },
              { icon: Brain, title: "Desenvolvimento", desc: "Geração de código, landing pages e deploy automático" },
              { icon: Workflow, title: "Criação de Conteúdo", desc: "Textos, imagens, vídeos e podcasts" },
              { icon: Shield, title: "Pesquisa & Inteligência", desc: "Web scraping, análise de dados e monitoramento" },
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

      {/* Architecture Section */}
      <section id="architecture" className="py-20 border-t border-border">
        <div className="container">
          <div className="space-y-4 mb-16">
            <h2 className="text-4xl font-bold">Arquitetura Inteligente</h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Sistema modular com orquestração autônoma, memória de longo prazo e personalização profunda.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-12 items-center">
            {/* Architecture Image */}
            <div className="relative h-96 rounded-2xl overflow-hidden border border-border/50">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663438547756/SdYSRiFyv5LnWNYthZFfV8/automation-flow-VK3FesSSau8wsSFGStV3zF.webp"
                alt="Architecture"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Architecture Details */}
            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-2xl font-bold">Orquestração Autônoma</h3>
                <p className="text-muted-foreground">
                  O assistente decompõe objetivos complexos em subtarefas, executa de forma paralela e valida cada etapa antes de prosseguir.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-2xl font-bold">Memória de Longo Prazo</h3>
                <p className="text-muted-foreground">
                  ChromaDB + SQLite armazenam preferências, histórico e padrões de uso, permitindo aprendizado contínuo.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-2xl font-bold">Personalização Profunda</h3>
                <p className="text-muted-foreground">
                  Sistema de perfis (Trabalho, Pessoal, Criativo) que se adapta ao seu estilo de comunicação e preferências.
                </p>
              </div>

              <a href="/checkout" className="w-full">
                <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-background gap-2 w-full font-bold">
                  🔓 Desbloquear Acesso (R$ 299,90) <ArrowRight className="w-4 h-4" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-20 border-t border-border relative overflow-hidden">
        <svg className="absolute bottom-0 left-0 w-full h-24 -mb-1" viewBox="0 0 1200 100" preserveAspectRatio="none">
          <polygon points="0,50 1200,100 1200,100 0,0" fill="#1a1f3a" opacity="0.5" />
        </svg>

        <div className="container">
          <div className="grid grid-cols-2 gap-12 items-center">
            {/* Security Image */}
            <div className="relative h-96 rounded-2xl overflow-hidden border border-border/50">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663438547756/SdYSRiFyv5LnWNYthZFfV8/offline-security-dPivbUtxigBeSvHuk7UDM6.webp"
                alt="Security"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Security Details */}
            <div className="space-y-6">
              <div className="space-y-3">
                <h2 className="text-4xl font-bold">Privacidade & Segurança</h2>
                <p className="text-lg text-muted-foreground">
                  Design "Offline-First" garante que seus dados nunca deixem seu computador.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <Shield className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Criptografia AES-256</h4>
                    <p className="text-sm text-muted-foreground">Dados sensíveis protegidos em vault local</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Shield className="w-6 h-6 text-secondary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Isolamento de Processos</h4>
                    <p className="text-sm text-muted-foreground">Automação web em ambientes Docker controlados</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Shield className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Auditoria Completa</h4>
                    <p className="text-sm text-muted-foreground">Registro de todas as interações para rastreabilidade</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section id="roadmap" className="py-20 border-t border-border">
        <div className="container">
          <div className="space-y-4 mb-16">
            <h2 className="text-4xl font-bold">Roadmap de Desenvolvimento</h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Desenvolvimento estruturado em 4 fases, do MVP funcional ao sistema avançado completo.
            </p>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {[
              { phase: "Fase 1", title: "MVP Funcional", duration: "4-6 sem", color: "from-primary" },
              { phase: "Fase 2", title: "Skills Produtividade", duration: "6-8 sem", color: "from-primary to-secondary" },
              { phase: "Fase 3", title: "Agente Autônomo", duration: "8-10 sem", color: "from-secondary" },
              { phase: "Fase 4", title: "Personalização", duration: "4-6 sem", color: "from-secondary to-primary" },
            ].map((item, idx) => (
              <Card key={idx} className="p-6 border-border/50 relative overflow-hidden group hover:border-primary/50 transition-all">
                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-5 group-hover:opacity-10 transition-all`}></div>
                <div className="relative">
                  <div className="text-sm font-semibold text-primary mb-2">{item.phase}</div>
                  <h3 className="text-lg font-bold mb-3">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.duration}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-border">
        <div className="container">
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-2xl p-12 text-center space-y-6">
            <h2 className="text-4xl font-bold">Pronto para Começar?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Acesse a especificação técnica completa, com arquitetura detalhada, exemplos de código e roadmap de implementação.
            </p>
            <div className="flex items-center justify-center gap-4">
              <a href="/checkout">
                <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-background gap-2 font-bold">
                  🚀 Comprar Agora (R$ 299,90) <ArrowRight className="w-4 h-4" />
                </Button>
              </a>
              <Button size="lg" variant="outline" className="border-primary/30 hover:bg-primary/10">
                Contato
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-card/50">
        <div className="container">
          <div className="grid grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition">Features</a></li>
                <li><a href="#" className="hover:text-foreground transition">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground transition">Roadmap</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Documentação</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition">Guia de Início</a></li>
                <li><a href="#" className="hover:text-foreground transition">API Docs</a></li>
                <li><a href="#" className="hover:text-foreground transition">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Comunidade</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition">Discord</a></li>
                <li><a href="#" className="hover:text-foreground transition">GitHub</a></li>
                <li><a href="#" className="hover:text-foreground transition">Twitter</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition">Privacidade</a></li>
                <li><a href="#" className="hover:text-foreground transition">Termos</a></li>
                <li><a href="#" className="hover:text-foreground transition">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 flex items-center justify-between text-sm text-muted-foreground">
            <p>&copy; 2026 Funcionário Digital. Todos os direitos reservados.</p>
            <p>Desenvolvido com IA e ❤️</p>
          </div>
        </div>
      </footer>

      {/* Specification Modal */}
      <SpecificationModal open={specModalOpen} onOpenChange={setSpecModalOpen} />
    </div>
  );
}
