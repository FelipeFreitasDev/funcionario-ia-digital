import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  MessageCircle,
  Mic,
  Zap,
  BookOpen,
  Play,
  Copy,
  Download,
} from "lucide-react";

interface Example {
  id: string;
  title: string;
  description: string;
  input: string;
  category: "text" | "voice" | "automation";
}

const EXAMPLES: Example[] = [
  {
    id: "email-1",
    title: "Email Profissional",
    description: "Gerar email para cliente",
    input: "Crie um email profissional para apresentar uma proposta de projeto",
    category: "text",
  },
  {
    id: "post-1",
    title: "Post Instagram",
    description: "Criar post para redes sociais",
    input: "Crie um post atrativo para Instagram sobre novo produto com emojis",
    category: "text",
  },
  {
    id: "report-1",
    title: "Relatório de Vendas",
    description: "Gerar relatório mensal",
    input: "Faça um relatório de vendas do mês de março com análise de tendências",
    category: "text",
  },
  {
    id: "voice-1",
    title: "Reconhecimento de Voz",
    description: "Testar STT",
    input: "Ok assistente, qual é a previsão do tempo para amanhã?",
    category: "voice",
  },
  {
    id: "voice-2",
    title: "Comando de Voz",
    description: "Criar lembretes",
    input: "Ok assistente, me lembre de ligar para o cliente às 15h",
    category: "voice",
  },
  {
    id: "auto-1",
    title: "Email Diário",
    description: "Agendar envio automático",
    input: "Agende um email de resumo diário para 9h da manhã",
    category: "automation",
  },
  {
    id: "auto-2",
    title: "Post Agendado",
    description: "Publicar automaticamente",
    input: "Poste automaticamente no Instagram toda segunda-feira às 10h",
    category: "automation",
  },
];

export default function Sandbox() {
  const [activeTab, setActiveTab] = useState("text");
  const [selectedExample, setSelectedExample] = useState<Example | null>(null);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);

  const handleRunExample = async (example: Example) => {
    setSelectedExample(example);
    setInput(example.input);
    setIsLoading(true);

    // Simular processamento
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Gerar resposta simulada baseada no tipo
    let response = "";
    if (example.category === "text") {
      if (example.id === "email-1") {
        response = `Assunto: Proposta de Projeto

Prezado(a) [Cliente],

Espero que esteja bem. Gostaria de apresentar uma proposta para seu projeto.

Temos experiência em [área] e acreditamos que podemos entregar excelentes resultados.

Segue em anexo a proposta detalhada com cronograma e orçamento.

Fico à disposição para discutir os detalhes.

Atenciosamente,
[Seu Nome]`;
      } else if (example.id === "post-1") {
        response = `🚀 Novo Produto Lançado! 🎉

Estamos felizes em apresentar nosso mais novo produto! 🌟

✨ Características:
• Inovador e moderno
• Fácil de usar
• Preço acessível

🛍️ Disponível agora na nossa loja!

Não perca! Link na bio 👆

#novo #produto #lançamento #inovação #qualidade`;
      } else if (example.id === "report-1") {
        response = `RELATÓRIO DE VENDAS - MARÇO 2026

RESUMO EXECUTIVO
Total de vendas: R$ 125.450
Crescimento: +15% vs fevereiro
Clientes novos: 23

ANÁLISE POR CATEGORIA
1. Produtos: R$ 85.300 (68%)
2. Serviços: R$ 40.150 (32%)

TENDÊNCIAS
• Crescimento em mobile: +25%
• Redução em vendas presenciais: -5%
• Aumento em assinaturas: +18%

RECOMENDAÇÕES
1. Aumentar investimento em marketing digital
2. Expandir linha de serviços
3. Otimizar processo de vendas online`;
      }
    } else if (example.category === "voice") {
      if (example.id === "voice-1") {
        response = `[Reconhecimento de Voz Ativado]

Transcrição: "Ok assistente, qual é a previsão do tempo para amanhã?"

Resposta em Voz:
"A previsão para amanhã é de céu parcialmente nublado, com temperatura máxima de 28 graus e mínima de 22 graus. Há 30% de chance de chuva à noite. Recomendo levar um guarda-chuva."

[Áudio processado com sucesso]`;
      } else if (example.id === "voice-2") {
        response = `[Reconhecimento de Voz Ativado]

Transcrição: "Ok assistente, me lembre de ligar para o cliente às 15h"

Resposta em Voz:
"Lembrete criado com sucesso! Você receberá uma notificação às 15h para ligar para o cliente."

[Lembrete agendado para hoje às 15:00]`;
      }
    } else if (example.category === "automation") {
      if (example.id === "auto-1") {
        response = `[Automação Criada com Sucesso]

Nome: Email de Resumo Diário
Horário: 09:00 (todos os dias)
Status: ✅ Ativo

Próxima execução: Amanhã às 09:00

O email será enviado automaticamente com:
- Resumo de tarefas do dia
- Lembretes importantes
- Métricas de desempenho

Você pode editar ou desativar a qualquer momento.`;
      } else if (example.id === "auto-2") {
        response = `[Automação Criada com Sucesso]

Nome: Post Instagram Automático
Frequência: Toda segunda-feira
Horário: 10:00
Status: ✅ Ativo

Próxima publicação: Segunda-feira às 10:00

Conteúdo programado:
- Tipo: Carrossel (5 imagens)
- Hashtags: #novo #produto #semana
- Descrição: Customizável

Total de posts agendados: 4`;
      }
    }

    setOutput(response);
    setIsLoading(false);
  };

  const handleCustomInput = async () => {
    if (!input.trim()) return;

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Resposta genérica para entrada customizada
    setOutput(`
[Processando sua solicitação...]

Sua entrada: "${input}"

Resposta simulada:
O Funcionário Digital processou sua solicitação e gerou uma resposta personalizada.

Na versão instalada, você teria:
✅ Resposta completa e contextualizada
✅ Múltiplas opções de formatação
✅ Integração com seus sistemas
✅ Histórico de interações

Para usar todas as funcionalidades, instale o Funcionário Digital!
    `);
    setIsLoading(false);
  };

  const handleCopyOutput = () => {
    navigator.clipboard.writeText(output);
    alert("Copiado para a área de transferência!");
  };

  const filteredExamples = EXAMPLES.filter((ex) => ex.category === activeTab);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-900/50 backdrop-blur">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">🤖 Sandbox Online</h1>
              <p className="text-slate-400 mt-2">
                Teste o Funcionário Digital sem instalação
              </p>
            </div>
            <a href="/checkout">
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90">
                <Download className="w-4 h-4 mr-2" />
                Instalar Agora
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* Tutorial Banner */}
      {showTutorial && (
        <div className="bg-blue-900/30 border-b border-blue-700/50 backdrop-blur">
          <div className="container py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-blue-400" />
              <p className="text-sm text-blue-200">
                💡 Dica: Selecione um exemplo abaixo para ver o Funcionário Digital em ação!
              </p>
            </div>
            <button
              onClick={() => setShowTutorial(false)}
              className="text-blue-400 hover:text-blue-300"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar - Exemplos */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-800 border-slate-700 p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                Exemplos
              </h2>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-slate-700">
                  <TabsTrigger value="text" className="text-xs">
                    <MessageCircle className="w-4 h-4" />
                  </TabsTrigger>
                  <TabsTrigger value="voice" className="text-xs">
                    <Mic className="w-4 h-4" />
                  </TabsTrigger>
                  <TabsTrigger value="automation" className="text-xs">
                    <Zap className="w-4 h-4" />
                  </TabsTrigger>
                </TabsList>

                {["text", "voice", "automation"].map((category) => (
                  <TabsContent key={category} value={category} className="space-y-3 mt-4">
                    {filteredExamples.map((example) => (
                      <button
                        key={example.id}
                        onClick={() => handleRunExample(example)}
                        className={`w-full text-left p-3 rounded-lg transition-all ${
                          selectedExample?.id === example.id
                            ? "bg-blue-600 border-blue-400"
                            : "bg-slate-700 border-slate-600 hover:bg-slate-600"
                        } border`}
                      >
                        <div className="font-medium text-sm">{example.title}</div>
                        <div className="text-xs text-slate-300 mt-1">
                          {example.description}
                        </div>
                      </button>
                    ))}
                  </TabsContent>
                ))}
              </Tabs>
            </Card>
          </div>

          {/* Main Area - Simulador */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-800 border-slate-700 p-6">
              <h2 className="text-xl font-bold mb-4">Simulador Interativo</h2>

              {/* Input */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Sua entrada:
                  </label>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Digite seu comando ou selecione um exemplo..."
                    className="w-full h-24 bg-slate-700 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleCustomInput}
                    disabled={isLoading || !input.trim()}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    {isLoading ? "Processando..." : "Executar"}
                  </Button>
                </div>
              </div>

              {/* Output */}
              {output && (
                <div className="mt-8 space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium">Resultado:</label>
                    <button
                      onClick={handleCopyOutput}
                      className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300"
                    >
                      <Copy className="w-4 h-4" />
                      Copiar
                    </button>
                  </div>
                  <div className="bg-slate-700 border border-slate-600 rounded-lg p-4 h-48 overflow-y-auto">
                    <pre className="text-sm text-slate-200 whitespace-pre-wrap font-mono">
                      {output}
                    </pre>
                  </div>
                </div>
              )}

              {/* Info Box */}
              <div className="mt-8 p-4 bg-slate-700/50 border border-slate-600 rounded-lg">
                <p className="text-sm text-slate-300">
                  ℹ️ <strong>Nota:</strong> Este é um simulador. Para usar todas as funcionalidades
                  completas (integração com APIs, automações reais, modelos avançados), instale o
                  Funcionário Digital.
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8">Funcionalidades Disponíveis</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: "📝",
                title: "Geração de Texto",
                desc: "Emails, posts, relatórios e muito mais",
              },
              {
                icon: "🎤",
                title: "Reconhecimento de Voz",
                desc: "Comandos por voz em português brasileiro",
              },
              {
                icon: "⚙️",
                title: "Automações",
                desc: "Agende tarefas recorrentes automaticamente",
              },
              {
                icon: "🔗",
                title: "Integrações",
                desc: "Conecte com Gmail, Instagram, Facebook e mais",
              },
              {
                icon: "🧠",
                title: "Aprendizado",
                desc: "Adapta-se ao seu estilo de trabalho",
              },
              {
                icon: "🔒",
                title: "Privacidade",
                desc: "100% offline, seus dados sempre protegidos",
              },
            ].map((feature, idx) => (
              <Card key={idx} className="bg-slate-800 border-slate-700 p-6">
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-400">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Pronto para começar?</h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Instale o Funcionário Digital agora e tenha acesso a todas as funcionalidades completas,
            modelos avançados e integrações profissionais.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href="/checkout">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-slate-100">
                <Download className="w-5 h-5 mr-2" />
                Instalar Agora (R$ 299,90)
              </Button>
            </a>
            <a href="/dashboard">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Ver Arquitetura
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
