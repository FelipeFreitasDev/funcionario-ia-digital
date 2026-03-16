import { useState, useEffect } from "react";
import { CheckCircle2, Circle, RotateCcw, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  category: string;
  completed: boolean;
}

const INITIAL_CHECKLIST: ChecklistItem[] = [
  {
    id: "1",
    title: "Criar conta Manus",
    description: "Registre-se em manus.im e crie uma nova aplicação",
    category: "Preparação",
    completed: false,
  },
  {
    id: "2",
    title: "Criar conta Stripe",
    description: "Configure uma conta Stripe para processar pagamentos",
    category: "Preparação",
    completed: false,
  },
  {
    id: "3",
    title: "Obter chaves de API",
    description: "Copie as chaves sk_live_* e pk_live_* do Stripe",
    category: "Configuração",
    completed: false,
  },
  {
    id: "4",
    title: "Configurar webhook",
    description: "Registre o endpoint /api/webhooks/stripe no Stripe Dashboard",
    category: "Configuração",
    completed: false,
  },
  {
    id: "5",
    title: "Adicionar variáveis de ambiente",
    description: "Configure STRIPE_SECRET_KEY e STRIPE_WEBHOOK_SECRET no Manus",
    category: "Configuração",
    completed: false,
  },
  {
    id: "6",
    title: "Aplicar migrações do BD",
    description: "Execute pnpm db:push para criar as tabelas",
    category: "Banco de Dados",
    completed: false,
  },
  {
    id: "7",
    title: "Fazer backup inicial",
    description: "Crie um backup do banco de dados antes do deploy",
    category: "Banco de Dados",
    completed: false,
  },
  {
    id: "8",
    title: "Testar webhook localmente",
    description: "Use Stripe CLI para simular eventos de checkout",
    category: "Testes",
    completed: false,
  },
  {
    id: "9",
    title: "Criar checkpoint",
    description: "Salve um checkpoint no Manus antes de publicar",
    category: "Implantação",
    completed: false,
  },
  {
    id: "10",
    title: "Publicar aplicação",
    description: "Clique em Publish e aguarde o deploy completar",
    category: "Implantação",
    completed: false,
  },
  {
    id: "11",
    title: "Configurar domínio",
    description: "Configure um domínio personalizado ou use o domínio Manus",
    category: "Implantação",
    completed: false,
  },
  {
    id: "12",
    title: "Testar login",
    description: "Verifique se o OAuth está funcionando corretamente",
    category: "Validação",
    completed: false,
  },
  {
    id: "13",
    title: "Testar checkout",
    description: "Faça um teste de compra com cartão de teste 4242 4242 4242 4242",
    category: "Validação",
    completed: false,
  },
  {
    id: "14",
    title: "Verificar webhooks",
    description: "Confirme que os webhooks estão sendo recebidos corretamente",
    category: "Validação",
    completed: false,
  },
  {
    id: "15",
    title: "Revisar logs",
    description: "Verifique os logs do servidor em .manus-logs/",
    category: "Monitoramento",
    completed: false,
  },
  {
    id: "16",
    title: "Agendar backups",
    description: "Configure backups automáticos do banco de dados",
    category: "Monitoramento",
    completed: false,
  },
];

export function DeploymentChecklist() {
  const [checklist, setChecklist] = useState<ChecklistItem[]>(INITIAL_CHECKLIST);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  // Carregar do localStorage ao montar
  useEffect(() => {
    const saved = localStorage.getItem("deployment-checklist");
    if (saved) {
      try {
        setChecklist(JSON.parse(saved));
      } catch (e) {
        console.error("Erro ao carregar checklist:", e);
      }
    }
  }, []);

  // Salvar no localStorage quando mudar
  useEffect(() => {
    localStorage.setItem("deployment-checklist", JSON.stringify(checklist));
  }, [checklist]);

  const toggleItem = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const resetChecklist = () => {
    if (confirm("Tem certeza que deseja resetar o checklist?")) {
      setChecklist(INITIAL_CHECKLIST);
      localStorage.removeItem("deployment-checklist");
    }
  };

  const downloadChecklist = () => {
    const content = checklist
      .map((item) => `${item.completed ? "✓" : "○"} ${item.title} - ${item.description}`)
      .join("\n");

    const element = document.createElement("a");
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(content));
    element.setAttribute("download", "deployment-checklist.txt");
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const categories = Array.from(new Set(checklist.map((item) => item.category)));
  const completedCount = checklist.filter((item) => item.completed).length;
  const progressPercentage = Math.round((completedCount / checklist.length) * 100);

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <Card className="bg-slate-800 border-slate-700 p-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Progresso do Deploy</h3>
            <span className="text-2xl font-bold text-cyan-400">{progressPercentage}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="text-sm text-slate-400">
            {completedCount} de {checklist.length} itens concluídos
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3 flex-wrap">
        <Button
          onClick={downloadChecklist}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Baixar Checklist
        </Button>
        <Button
          onClick={resetChecklist}
          variant="outline"
          className="flex items-center gap-2 text-red-400 hover:text-red-300"
        >
          <RotateCcw className="w-4 h-4" />
          Resetar
        </Button>
      </div>

      {/* Checklist by Category */}
      <div className="space-y-4">
        {categories.map((category) => {
          const categoryItems = checklist.filter((item) => item.category === category);
          const categoryCompleted = categoryItems.filter((item) => item.completed).length;
          const isExpanded = expandedCategory === category;

          return (
            <Card
              key={category}
              className="bg-slate-800 border-slate-700 cursor-pointer hover:border-slate-600 transition"
              onClick={() =>
                setExpandedCategory(isExpanded ? null : category)
              }
            >
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-white text-lg">{category}</h4>
                    <p className="text-sm text-slate-400">
                      {categoryCompleted} de {categoryItems.length} concluídos
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center">
                      <span className="text-sm font-bold text-cyan-400">
                        {Math.round((categoryCompleted / categoryItems.length) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-slate-700 space-y-3">
                    {categoryItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-start gap-3 p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleItem(item.id);
                        }}
                      >
                        <button className="flex-shrink-0 mt-1">
                          {item.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-green-400" />
                          ) : (
                            <Circle className="w-5 h-5 text-slate-500" />
                          )}
                        </button>
                        <div className="flex-1">
                          <p
                            className={`font-medium ${
                              item.completed
                                ? "text-slate-400 line-through"
                                : "text-slate-100"
                            }`}
                          >
                            {item.title}
                          </p>
                          <p className="text-sm text-slate-400">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Completion Message */}
      {progressPercentage === 100 && (
        <Card className="bg-green-900 border-green-700 p-6">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-8 h-8 text-green-400" />
            <div>
              <h4 className="font-semibold text-green-100">Parabéns! 🎉</h4>
              <p className="text-sm text-green-200">
                Você completou todos os passos de implantação. Sua aplicação está pronta para produção!
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
