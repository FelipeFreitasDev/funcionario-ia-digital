import { useState, useMemo } from "react";
import { Search, Copy, Check, ChevronDown, ChevronUp, ExternalLink, AlertCircle, CheckCircle2, Clock, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Section {
  id: string;
  title: string;
  category: string;
  content: React.ReactNode | null;
  difficulty: "easy" | "medium" | "hard";
  time: string;
}

export default function DeploymentGuide() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const CodeBlock = ({ code, language = "bash", id }: { code: string; language?: string; id: string }) => (
    <div className="relative bg-slate-900 rounded-lg overflow-hidden my-4">
      <div className="flex justify-between items-center px-4 py-2 bg-slate-800 border-b border-slate-700">
        <span className="text-xs text-slate-400">{language}</span>
        <button
          onClick={() => copyToClipboard(code, id)}
          className="flex items-center gap-2 px-3 py-1 rounded bg-slate-700 hover:bg-slate-600 transition text-sm text-slate-300"
        >
          {copiedCode === id ? (
            <>
              <Check className="w-4 h-4" />
              Copiado!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copiar
            </>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm text-slate-100">
        <code>{code}</code>
      </pre>
    </div>
  );

  const sections: Section[] = [
    {
      id: "overview",
      title: "Visão Geral",
      category: "Introdução",
      difficulty: "easy",
      time: "5 min",
      content: (
        <div className="space-y-4">
          <p className="text-slate-300">
            O <strong>Funcionário Digital de IA</strong> é uma aplicação SaaS completa construída com tecnologias modernas e prontas para produção.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
              <h4 className="font-semibold text-cyan-400 mb-2">Frontend</h4>
              <ul className="text-sm text-slate-300 space-y-1">
                <li>• React 19</li>
                <li>• Tailwind CSS 4</li>
                <li>• TypeScript</li>
              </ul>
            </div>
            <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
              <h4 className="font-semibold text-cyan-400 mb-2">Backend</h4>
              <ul className="text-sm text-slate-300 space-y-1">
                <li>• Express 4</li>
                <li>• tRPC 11</li>
                <li>• Node.js</li>
              </ul>
            </div>
            <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
              <h4 className="font-semibold text-cyan-400 mb-2">Dados</h4>
              <ul className="text-sm text-slate-300 space-y-1">
                <li>• MySQL/TiDB</li>
                <li>• Drizzle ORM</li>
                <li>• Migrações automáticas</li>
              </ul>
            </div>
            <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
              <h4 className="font-semibold text-cyan-400 mb-2">Integrações</h4>
              <ul className="text-sm text-slate-300 space-y-1">
                <li>• Stripe (Pagamentos)</li>
                <li>• Manus OAuth</li>
                <li>• Webhooks</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "prerequisites",
      title: "Pré-requisitos",
      category: "Preparação",
      difficulty: "easy",
      time: "10 min",
      content: (
        <div className="space-y-4">
          <p className="text-slate-300">Antes de começar, você precisará ter:</p>
          <div className="space-y-3">
            {[
              { name: "Conta Manus", desc: "Plataforma de hospedagem", link: "https://manus.im" },
              { name: "Conta Stripe", desc: "Processamento de pagamentos", link: "https://stripe.com" },
              { name: "Domínio", desc: "Opcional, mas recomendado", link: null },
              { name: "Git", desc: "Controle de versão", link: "https://git-scm.com" },
              { name: "Node.js 22+", desc: "Runtime JavaScript", link: "https://nodejs.org" },
              { name: "pnpm", desc: "Gerenciador de pacotes", link: "https://pnpm.io" },
            ].map((req, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 bg-slate-800 rounded-lg border border-slate-700">
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="font-semibold text-slate-100">{req.name}</div>
                  <div className="text-sm text-slate-400">{req.desc}</div>
                </div>
                {req.link && (
                  <a
                    href={req.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 transition"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "stripe-setup",
      title: "Configurar Stripe",
      category: "Configuração",
      difficulty: "medium",
      time: "20 min",
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-semibold text-cyan-400 mb-3">1. Criar Conta Stripe</h4>
            <ol className="space-y-2 text-slate-300 list-decimal list-inside">
              <li>Acesse <a href="https://stripe.com" className="text-cyan-400 hover:underline">stripe.com</a></li>
              <li>Clique em <strong>Sign up</strong></li>
              <li>Complete o registro e verifique seu email</li>
              <li>Complete o perfil da conta</li>
            </ol>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-cyan-400 mb-3">2. Obter Chaves de API</h4>
            <ol className="space-y-2 text-slate-300 list-decimal list-inside mb-4">
              <li>No painel do Stripe, vá para <strong>Developers → API keys</strong></li>
              <li>Certifique-se de estar em <strong>Live mode</strong></li>
              <li>Copie as chaves</li>
            </ol>
            <CodeBlock
              code={`STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLIC_KEY=pk_live_...`}
              language="env"
              id="stripe-keys"
            />
          </div>

          <div>
            <h4 className="text-lg font-semibold text-cyan-400 mb-3">3. Registrar Webhook</h4>
            <ol className="space-y-2 text-slate-300 list-decimal list-inside mb-4">
              <li>Vá para <strong>Developers → Webhooks</strong></li>
              <li>Clique em <strong>Add endpoint</strong></li>
              <li>Cole a URL: <code className="bg-slate-800 px-2 py-1 rounded text-cyan-300">https://seu-dominio.com/api/webhooks/stripe</code></li>
              <li>Selecione os eventos</li>
              <li>Copie o <strong>Signing secret</strong></li>
            </ol>
            <CodeBlock
              code={`STRIPE_WEBHOOK_SECRET=whsec_...`}
              language="env"
              id="webhook-secret"
            />
          </div>
        </div>
      ),
    },
    {
      id: "env-setup",
      title: "Variáveis de Ambiente",
      category: "Configuração",
      difficulty: "easy",
      time: "10 min",
      content: (
        <div className="space-y-4">
          <div className="bg-blue-900 border border-blue-700 p-4 rounded-lg flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0" />
            <p className="text-sm text-blue-100">
              O Manus Platform gerencia automaticamente a maioria das variáveis. Você só precisa configurar as do Stripe.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-cyan-400 mb-3">Variáveis que Você Configura:</h4>
            <CodeBlock
              code={`STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PUBLIC_KEY=pk_live_...`}
              language="env"
              id="user-env"
            />
          </div>

          <div>
            <h4 className="font-semibold text-cyan-400 mb-3">Variáveis Gerenciadas pelo Manus:</h4>
            <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
              <ul className="text-sm text-slate-300 space-y-2">
                <li><strong>DATABASE_URL</strong> - Conexão MySQL/TiDB</li>
                <li><strong>JWT_SECRET</strong> - Secret para tokens</li>
                <li><strong>VITE_APP_ID</strong> - ID da aplicação OAuth</li>
                <li><strong>OAUTH_SERVER_URL</strong> - URL do servidor OAuth</li>
                <li><strong>BUILT_IN_FORGE_API_KEY</strong> - Chave da API Forge</li>
              </ul>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-cyan-400 mb-3">Como Configurar no Manus:</h4>
            <ol className="space-y-2 text-slate-300 list-decimal list-inside">
              <li>Acesse o painel do projeto</li>
              <li>Vá para <strong>Settings → Secrets</strong></li>
              <li>Clique em <strong>Add Secret</strong></li>
              <li>Configure cada variável</li>
            </ol>
          </div>
        </div>
      ),
    },
    {
      id: "database-setup",
      title: "Banco de Dados",
      category: "Configuração",
      difficulty: "medium",
      time: "15 min",
      content: (
        <div className="space-y-4">
          <p className="text-slate-300">
            O Manus Platform fornece automaticamente um banco de dados MySQL/TiDB. Você só precisa aplicar as migrações.
          </p>

          <div>
            <h4 className="font-semibold text-cyan-400 mb-3">Aplicar Migrações</h4>
            <CodeBlock
              code={`pnpm db:push`}
              language="bash"
              id="db-push"
            />
            <p className="text-sm text-slate-400 mt-2">
              Este comando gera e aplica todas as migrações do banco de dados.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-cyan-400 mb-3">Verificar Tabelas</h4>
            <CodeBlock
              code={`mysql -u $DB_USER -p$DB_PASSWORD -h $DB_HOST $DB_NAME -e "SHOW TABLES;"`}
              language="bash"
              id="show-tables"
            />
          </div>

          <div>
            <h4 className="font-semibold text-cyan-400 mb-3">Fazer Backup</h4>
            <CodeBlock
              code={`mysqldump -u $DB_USER -p$DB_PASSWORD -h $DB_HOST $DB_NAME > backup.sql`}
              language="bash"
              id="backup-db"
            />
          </div>
        </div>
      ),
    },
    {
      id: "deployment",
      title: "Implantar no Manus",
      category: "Implantação",
      difficulty: "easy",
      time: "15 min",
      content: (
        <div className="space-y-4">
          <div className="bg-green-900 border border-green-700 p-4 rounded-lg flex gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
            <p className="text-sm text-green-100">
              Antes de implantar, certifique-se de que todas as variáveis de ambiente estão configuradas.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-cyan-400 mb-3">Passo 1: Criar Checkpoint</h4>
            <ol className="space-y-2 text-slate-300 list-decimal list-inside mb-4">
              <li>No painel do projeto, clique em <strong>Create Checkpoint</strong></li>
              <li>Adicione uma descrição</li>
              <li>Clique em <strong>Save</strong></li>
            </ol>
          </div>

          <div>
            <h4 className="font-semibold text-cyan-400 mb-3">Passo 2: Publicar</h4>
            <ol className="space-y-2 text-slate-300 list-decimal list-inside mb-4">
              <li>Clique no botão <strong>Publish</strong></li>
              <li>Selecione o checkpoint</li>
              <li>Escolha o domínio</li>
              <li>Clique em <strong>Deploy</strong></li>
            </ol>
            <p className="text-sm text-slate-400">
              ⏱️ Tempo de implantação: 5-15 minutos
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-cyan-400 mb-3">Passo 3: Verificar</h4>
            <ul className="space-y-2 text-slate-300 list-disc list-inside">
              <li>Acesse a URL da aplicação</li>
              <li>Verifique se a página carrega</li>
              <li>Teste o login</li>
              <li>Revise os logs</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: "domain-setup",
      title: "Configurar Domínio",
      category: "Implantação",
      difficulty: "medium",
      time: "20 min",
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-cyan-400 mb-3">Opção 1: Usar Domínio Manus (Recomendado)</h4>
            <p className="text-slate-300 mb-3">
              Sua aplicação está disponível em:
            </p>
            <CodeBlock
              code={`https://seu-projeto.manus.space`}
              language="text"
              id="manus-domain"
            />
            <p className="text-sm text-slate-400">
              ✓ SSL/TLS automático<br/>
              ✓ Sem configuração necessária<br/>
              ✓ Pronto para produção
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-cyan-400 mb-3">Opção 2: Usar Domínio Personalizado</h4>
            <ol className="space-y-2 text-slate-300 list-decimal list-inside">
              <li>Registre um domínio em qualquer registrador</li>
              <li>No Manus, vá para <strong>Settings → Domains</strong></li>
              <li>Clique em <strong>Add Domain</strong></li>
              <li>Siga as instruções para atualizar DNS</li>
              <li>SSL/TLS é configurado automaticamente</li>
            </ol>
          </div>
        </div>
      ),
    },
    {
      id: "testing",
      title: "Testar Implantação",
      category: "Validação",
      difficulty: "medium",
      time: "15 min",
      content: (
        <div className="space-y-4">
          <div className="bg-yellow-900 border border-yellow-700 p-4 rounded-lg flex gap-3">
            <Clock className="w-5 h-5 text-yellow-400 flex-shrink-0" />
            <p className="text-sm text-yellow-100">
              Execute estes testes após a implantação para garantir que tudo está funcionando.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-cyan-400 mb-3">✓ Teste 1: Página Inicial</h4>
            <CodeBlock
              code={`curl https://seu-dominio.com
# Deve retornar HTML da página`}
              language="bash"
              id="test-home"
            />
          </div>

          <div>
            <h4 className="font-semibold text-cyan-400 mb-3">✓ Teste 2: Login</h4>
            <ol className="space-y-2 text-slate-300 list-decimal list-inside">
              <li>Acesse a aplicação</li>
              <li>Clique em "Login"</li>
              <li>Faça login com Manus OAuth</li>
              <li>Verifique se redirecionou corretamente</li>
            </ol>
          </div>

          <div>
            <h4 className="font-semibold text-cyan-400 mb-3">✓ Teste 3: Checkout</h4>
            <ol className="space-y-2 text-slate-300 list-decimal list-inside">
              <li>Acesse a página de planos</li>
              <li>Clique em "Comprar" para um plano</li>
              <li>Verifique se Stripe Checkout abre</li>
              <li>Use cartão de teste: 4242 4242 4242 4242</li>
            </ol>
          </div>

          <div>
            <h4 className="font-semibold text-cyan-400 mb-3">✓ Teste 4: Webhook</h4>
            <CodeBlock
              code={`curl -X POST https://seu-dominio.com/api/webhooks/stripe
# Deve retornar 400 (payload inválido), não 404`}
              language="bash"
              id="test-webhook"
            />
          </div>
        </div>
      ),
    },
    {
      id: "monitoring",
      title: "Monitoramento",
      category: "Operação",
      difficulty: "medium",
      time: "10 min",
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-cyan-400 mb-3">Verificar Saúde da Aplicação</h4>
            <ol className="space-y-2 text-slate-300 list-decimal list-inside">
              <li>Acesse o painel do Manus</li>
              <li>Vá para <strong>Dashboard</strong></li>
              <li>Verifique:
                <ul className="ml-6 mt-2 space-y-1">
                  <li>• Dev Server Status: "running"</li>
                  <li>• Build Errors: "No errors"</li>
                  <li>• Dependencies: "OK"</li>
                </ul>
              </li>
            </ol>
          </div>

          <div>
            <h4 className="font-semibold text-cyan-400 mb-3">Visualizar Logs</h4>
            <CodeBlock
              code={`# Logs do servidor
tail -f .manus-logs/devserver.log

# Logs do cliente
tail -f .manus-logs/browserConsole.log

# Requisições de rede
tail -f .manus-logs/networkRequests.log`}
              language="bash"
              id="view-logs"
            />
          </div>

          <div>
            <h4 className="font-semibold text-cyan-400 mb-3">Monitorar Webhooks do Stripe</h4>
            <ol className="space-y-2 text-slate-300 list-decimal list-inside">
              <li>No Stripe, vá para <strong>Developers → Webhooks</strong></li>
              <li>Clique no seu endpoint</li>
              <li>Verifique <strong>Recent Deliveries</strong></li>
              <li>Status deve ser 200 (sucesso)</li>
            </ol>
          </div>
        </div>
      ),
    },
    {
      id: "troubleshooting",
      title: "Troubleshooting",
      category: "Suporte",
      difficulty: "hard",
      time: "Variável",
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-cyan-400 mb-3">❌ Erro: "Build failed"</h4>
            <CodeBlock
              code={`# Verificar erros TypeScript
pnpm tsc --noEmit

# Limpar cache e reinstalar
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Tentar build novamente
pnpm build`}
              language="bash"
              id="fix-build"
            />
          </div>

          <div>
            <h4 className="font-semibold text-cyan-400 mb-3">❌ Erro: "Webhook not received"</h4>
            <CodeBlock
              code={`# Verificar URL do webhook
curl https://seu-dominio.com/api/webhooks/stripe
# Deve retornar 405, não 404

# Testar webhook localmente
stripe listen --forward-to localhost:3000/api/webhooks/stripe
stripe trigger checkout.session.completed`}
              language="bash"
              id="fix-webhook"
            />
          </div>

          <div>
            <h4 className="font-semibold text-cyan-400 mb-3">❌ Erro: "Database connection failed"</h4>
            <CodeBlock
              code={`# Verificar DATABASE_URL
echo $DATABASE_URL

# Testar conexão
mysql -u $DB_USER -p$DB_PASSWORD -h $DB_HOST -e "SELECT 1"

# Aplicar migrações
pnpm db:push`}
              language="bash"
              id="fix-database"
            />
          </div>

          <div className="bg-blue-900 border border-blue-700 p-4 rounded-lg">
            <p className="text-sm text-blue-100">
              Para mais problemas, consulte o <strong>TROUBLESHOOTING_GUIDE.md</strong> completo.
            </p>
          </div>
        </div>
      ),
    },
  ];

  const filteredSections = useMemo(() => {
    if (!searchQuery) return sections;
    const query = searchQuery.toLowerCase();
    return sections.filter(
      (section) =>
        section.title.toLowerCase().includes(query) ||
        (section.content && section.content.toString().toLowerCase().includes(query))
    );
  }, [searchQuery]);

  const categories = Array.from(new Set(sections.map((s) => s.category)));

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "text-green-400";
      case "medium":
        return "text-yellow-400";
      case "hard":
        return "text-red-400";
      default:
        return "text-slate-400";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-6">
          <h1 className="text-3xl font-bold text-white mb-2">📚 Guia de Implantação</h1>
          <p className="text-slate-400">Funcionário Digital de IA - Passo a passo completo para produção</p>
        </div>
      </div>

      {/* Search */}
      <div className="container py-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
          <Input
            placeholder="Buscar na documentação..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-slate-800 border-slate-700 text-white placeholder-slate-500"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="container pb-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-6 bg-slate-800 border border-slate-700">
            {categories.map((cat) => (
              <TabsTrigger
                key={cat}
                value={cat.toLowerCase().replace(" ", "-")}
                className="text-xs md:text-sm"
              >
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent
              key={category}
              value={category.toLowerCase().replace(" ", "-")}
              className="space-y-4 mt-6"
            >
              {filteredSections
                .filter((s) => s.category === category)
                .map((section) => (
                  <Card
                    key={section.id}
                    className="bg-slate-800 border-slate-700 cursor-pointer hover:border-slate-600 transition"
                    onClick={() =>
                      setExpandedSection(expandedSection === section.id ? null : section.id)
                    }
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-semibold text-white">{section.title}</h3>
                            <span className={`text-xs px-2 py-1 rounded ${getDifficultyColor(section.difficulty)} bg-slate-700`}>
                              {section.difficulty.charAt(0).toUpperCase() + section.difficulty.slice(1)}
                            </span>
                            <span className="text-xs text-slate-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {section.time}
                            </span>
                          </div>
                        </div>
                        {expandedSection === section.id ? (
                          <ChevronUp className="w-5 h-5 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-slate-400" />
                        )}
                      </div>

                      {expandedSection === section.id && section.content && (
                        <div className="mt-4 pt-4 border-t border-slate-700 text-slate-300">
                          {section.content}
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-800 bg-slate-900/50 py-8">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-semibold text-white mb-3">📖 Documentação</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <a href="#" className="hover:text-cyan-400 transition">
                    Guia Completo
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-400 transition">
                    Scripts de Automação
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-400 transition">
                    Troubleshooting
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">🔗 Recursos</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <a href="https://docs.manus.im" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition">
                    Docs Manus
                  </a>
                </li>
                <li>
                  <a href="https://docs.stripe.com" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition">
                    Docs Stripe
                  </a>
                </li>
                <li>
                  <a href="https://help.manus.im" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition">
                    Suporte
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">💡 Dicas</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>✓ Sempre use chaves de produção (sk_live_)</li>
                <li>✓ Faça backup antes de cada deploy</li>
                <li>✓ Monitore logs regularmente</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 mt-8 pt-8 text-center text-sm text-slate-500">
            <p>© 2026 Funcionário Digital de IA - Guia de Implantação v1.0</p>
          </div>
        </div>
      </div>
    </div>
  );
}
