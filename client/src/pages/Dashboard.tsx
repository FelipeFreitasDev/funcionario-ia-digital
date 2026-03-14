import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Brain, Zap, Shield, Cpu, Database, GitBranch, ArrowRight } from "lucide-react";

/**
 * Dashboard: Visualização Interativa da Arquitetura do Assistente
 * Permite explorar cada componente e entender o fluxo de funcionamento
 */

export default function Dashboard() {
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);

  const components = [
    {
      id: "llm",
      name: "Core LLM (Ollama)",
      icon: Brain,
      color: "from-primary",
      description: "Motor de raciocínio central",
      details: "Executa modelos quantizados (Llama 3.1, Phi-4, Mistral) localmente sem dependência de APIs externas.",
      specs: ["Llama 3.1 8B/70B", "Phi-4 14B", "Mistral Nemo 12B", "Quantização Q4_K_M"],
    },
    {
      id: "stt",
      name: "Reconhecimento de Voz (STT)",
      icon: Zap,
      color: "from-secondary",
      description: "Conversão de áudio em texto",
      details: "Faster-Whisper otimizado para português brasileiro com latência ultra-baixa.",
      specs: ["Faster-Whisper", "Modelo large-v3", "Português BR", "<500ms latência"],
    },
    {
      id: "tts",
      name: "Síntese de Voz (TTS)",
      icon: Zap,
      color: "from-primary to-secondary",
      description: "Conversão de texto em áudio",
      details: "Piper TTS com vozes brasileiras ou Kokoro-82M para qualidade humana.",
      specs: ["Piper TTS", "Vozes PT-BR", "Kokoro-82M", "Latência ultra-baixa"],
    },
    {
      id: "orchestration",
      name: "Orquestração (LangGraph)",
      icon: GitBranch,
      color: "from-secondary to-primary",
      description: "Planejamento e execução autônoma",
      details: "Decompõe objetivos complexos em subtarefas, executa em paralelo e valida cada etapa.",
      specs: ["LangGraph", "Agentes Multi-tool", "Ciclos de feedback", "Autocorreção"],
    },
    {
      id: "memory",
      name: "Memória (SQLite + ChromaDB)",
      icon: Database,
      color: "from-primary",
      description: "Armazenamento e recuperação",
      details: "SQLite para dados estruturados e ChromaDB para RAG (Retrieval-Augmented Generation).",
      specs: ["SQLite", "ChromaDB Vetorial", "RAG Local", "Memória 30+ dias"],
    },
    {
      id: "security",
      name: "Segurança & Privacidade",
      icon: Shield,
      color: "from-secondary",
      description: "Proteção de dados",
      details: "Criptografia AES-256, isolamento de processos via Docker e auditoria completa.",
      specs: ["AES-256", "Docker Isolation", "Vault Local", "Auditoria"],
    },
  ];

  const skills = [
    { name: "Administração", items: ["E-mail", "Calendário", "Documentos", "Transcrição"] },
    { name: "Marketing", items: ["Redes Sociais", "SEO", "Campanhas", "Métricas"] },
    { name: "E-commerce", items: ["Pesquisa", "Análise de Nicho", "Precificação", "Atendimento"] },
    { name: "Desenvolvimento", items: ["Geração de Código", "Landing Pages", "APIs", "Deploy"] },
    { name: "Conteúdo", items: ["Textos", "Imagens", "Vídeos", "Podcasts"] },
    { name: "Pesquisa", items: ["Web Scraping", "Análise de Dados", "Monitoramento", "Tradução"] },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Brain className="w-6 h-6 text-background" />
            </div>
            <span className="font-bold text-xl">Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="/" className="text-sm hover:text-primary transition">Voltar</a>
            <Button size="sm" className="bg-primary hover:bg-primary/90 text-background">
              Documentação
            </Button>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-12">
        <div className="container">
          {/* Header */}
          <div className="space-y-4 mb-12">
            <h1 className="text-4xl font-bold">Arquitetura do Sistema</h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Explore cada componente do assistente de IA autônomo e entenda como eles trabalham juntos.
            </p>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="architecture" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="architecture">Arquitetura</TabsTrigger>
              <TabsTrigger value="components">Componentes</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
            </TabsList>

            {/* Architecture Tab */}
            <TabsContent value="architecture" className="space-y-6">
              <Card className="p-8 border-border/50">
                <h2 className="text-2xl font-bold mb-6">Fluxo de Funcionamento</h2>
                <div className="space-y-6">
                  {/* Flow Diagram */}
                  <div className="bg-card rounded-lg p-6 border border-border/50">
                    <img
                      src="https://d2xsxph8kpxj0f.cloudfront.net/310519663438547756/SdYSRiFyv5LnWNYthZFfV8/automation-flow-VK3FesSSau8wsSFGStV3zF.webp"
                      alt="Automation Flow"
                      className="w-full rounded-lg"
                    />
                  </div>

                  {/* Flow Description */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                      <h3 className="font-semibold text-primary mb-2">1. Entrada</h3>
                      <p className="text-sm text-muted-foreground">Comando de voz ou texto é recebido e processado.</p>
                    </div>
                    <div className="p-4 rounded-lg bg-secondary/10 border border-secondary/20">
                      <h3 className="font-semibold text-secondary mb-2">2. Orquestração</h3>
                      <p className="text-sm text-muted-foreground">LangGraph decompõe em subtarefas e roteia para skills.</p>
                    </div>
                    <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                      <h3 className="font-semibold text-primary mb-2">3. Execução</h3>
                      <p className="text-sm text-muted-foreground">Skills executam em paralelo com validação de cada etapa.</p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-8 border-border/50">
                <h2 className="text-2xl font-bold mb-6">Camadas do Sistema</h2>
                <div className="space-y-4">
                  {[
                    { layer: "Interface", desc: "Dashboard Web + Voz (Piper TTS)" },
                    { layer: "API Gateway", desc: "FastAPI + WebSockets para comunicação em tempo real" },
                    { layer: "Orquestração", desc: "LangGraph para planejamento e execução autônoma" },
                    { layer: "Skills", desc: "Módulos especializados (Admin, Marketing, Dev, etc)" },
                    { layer: "Motores", desc: "Ollama (LLM), Whisper (STT), Playwright (Web)" },
                    { layer: "Memória", desc: "SQLite + ChromaDB para persistência de dados" },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-4 rounded-lg border border-border/50 hover:border-primary/50 transition-all">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                        <span className="font-bold text-background">{idx + 1}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold">{item.layer}</h4>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            {/* Components Tab */}
            <TabsContent value="components" className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                {components.map((comp) => {
                  const Icon = comp.icon;
                  const isSelected = selectedComponent === comp.id;

                  return (
                    <Card
                      key={comp.id}
                      className={`p-6 border-border/50 cursor-pointer transition-all ${
                        isSelected ? "border-primary ring-2 ring-primary/50" : "hover:border-primary/50"
                      }`}
                      onClick={() => setSelectedComponent(isSelected ? null : comp.id)}
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <div className={`p-3 rounded-lg bg-gradient-to-br ${comp.color} opacity-20`}>
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{comp.name}</h3>
                          <p className="text-sm text-muted-foreground">{comp.description}</p>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="space-y-3 pt-4 border-t border-border">
                          <p className="text-sm text-foreground">{comp.details}</p>
                          <div className="flex flex-wrap gap-2">
                            {comp.specs.map((spec, idx) => (
                              <span key={idx} className="px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium">
                                {spec}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            {/* Skills Tab */}
            <TabsContent value="skills" className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                {skills.map((skill, idx) => (
                  <Card key={idx} className="p-6 border-border/50 hover:border-primary/50 transition-all">
                    <h3 className="text-lg font-bold mb-4 text-primary">{skill.name}</h3>
                    <ul className="space-y-2">
                      {skill.items.map((item, itemIdx) => (
                        <li key={itemIdx} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 rounded-full bg-secondary"></div>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* CTA Section */}
          <div className="mt-12 p-8 rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 to-secondary/10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Pronto para Implementar?</h2>
                <p className="text-muted-foreground">Acesse a especificação técnica completa com exemplos de código e roadmap detalhado.</p>
              </div>
              <Button className="bg-primary hover:bg-primary/90 text-background gap-2">
                Baixar Especificação <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
