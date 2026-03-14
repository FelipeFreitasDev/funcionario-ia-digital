import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronRight, Download, Zap, Settings, Play, CheckCircle, AlertCircle } from "lucide-react";

/**
 * Installation Guide: Guia Interativo de Instalação
 * Componente reutilizável com animações CSS e navegação entre passos
 */

interface InstallationStep {
  id: number;
  title: string;
  description: string;
  details: string[];
  icon: React.ReactNode;
  tips?: string[];
  warnings?: string[];
}

export default function InstallationGuide() {
  const [activeStep, setActiveStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const steps: InstallationStep[] = [
    {
      id: 1,
      title: "Baixar o Arquivo",
      description: "Faça o download do executável completo",
      details: [
        "Clique no botão 'Baixar Agora' acima",
        "O arquivo tem 2.5 GB, pode levar alguns minutos",
        "Salve em uma pasta de fácil acesso",
        "Não interrompa o download",
      ],
      icon: <Download className="w-6 h-6" />,
      tips: [
        "Use um gerenciador de downloads para pausar/retomar se necessário",
        "Verifique se tem espaço em disco antes de baixar",
      ],
    },
    {
      id: 2,
      title: "Extrair o Arquivo",
      description: "Descompacte o arquivo ZIP baixado",
      details: [
        "Localize o arquivo 'funcionario-digital-v1.0.zip'",
        "Clique com botão direito → 'Extrair Tudo' (Windows) ou 'Extrair' (Mac/Linux)",
        "Escolha uma pasta para extrair (recomendado: C:\\Program Files ou /Applications)",
        "Aguarde a extração completar (pode levar 2-3 minutos)",
      ],
      icon: <Zap className="w-6 h-6" />,
      warnings: [
        "Não delete o arquivo ZIP até confirmar que tudo foi extraído corretamente",
        "Certifique-se de ter permissões de administrador",
      ],
    },
    {
      id: 3,
      title: "Executar o Instalador",
      description: "Inicie o assistente de instalação",
      details: [
        "Abra a pasta extraída",
        "Procure por 'funcionario-digital.exe' (Windows), 'funcionario-digital.app' (Mac) ou 'funcionario-digital' (Linux)",
        "Clique duas vezes para executar",
        "Clique em 'Sim' se aparecer aviso de segurança",
      ],
      icon: <Play className="w-6 h-6" />,
      tips: [
        "Se receber aviso 'Arquivo não reconhecido', clique em 'Executar mesmo assim'",
        "Pode levar alguns segundos para iniciar",
      ],
      warnings: [
        "Desative temporariamente seu antivírus se bloquear a execução",
      ],
    },
    {
      id: 4,
      title: "Seguir o Assistente de Configuração",
      description: "Configure seu Funcionário Digital",
      details: [
        "Aceite os Termos de Licença",
        "Escolha a pasta de instalação (padrão recomendado)",
        "Selecione os modelos de IA desejados",
        "Configure seu perfil de usuário (nome, email, preferências)",
        "Clique em 'Instalar' e aguarde",
      ],
      icon: <Settings className="w-6 h-6" />,
      tips: [
        "A primeira instalação pode levar 30-45 minutos (depende da conexão)",
        "Você pode pausar e retomar depois se necessário",
        "Deixe o computador ligado durante a instalação",
      ],
      warnings: [
        "Não feche o instalador durante o processo",
        "Não desconecte da internet durante o download dos modelos",
      ],
    },
    {
      id: 5,
      title: "Usar Seu Assistente",
      description: "Comece a usar o Funcionário Digital",
      details: [
        "Após a instalação, clique em 'Iniciar' no assistente",
        "Acesse a interface em http://localhost:3000",
        "Faça login com suas credenciais",
        "Configure suas preferências e skills",
        "Comece a automatizar suas tarefas!",
      ],
      icon: <CheckCircle className="w-6 h-6" />,
      tips: [
        "Explore o tutorial interativo dentro da aplicação",
        "Consulte a documentação para recursos avançados",
        "Junte-se à comunidade Discord para dicas e suporte",
      ],
    },
  ];

  const handleStepClick = (stepId: number) => {
    setActiveStep(stepId);
  };

  const handleMarkComplete = (stepId: number) => {
    if (completedSteps.includes(stepId)) {
      setCompletedSteps(completedSteps.filter((id) => id !== stepId));
    } else {
      setCompletedSteps([...completedSteps, stepId]);
    }
  };

  const currentStep = steps.find((s) => s.id === activeStep);
  const progressPercentage = (completedSteps.length / steps.length) * 100;

  return (
    <div className="w-full space-y-6">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm sm:text-base">Seu Progresso</h3>
          <span className="text-xs sm:text-sm text-muted-foreground">
            {completedSteps.length} de {steps.length} concluído
          </span>
        </div>
        <div className="w-full h-2 rounded-full bg-card border border-border/50 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Steps Navigation */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
        {steps.map((step) => (
          <button
            key={step.id}
            onClick={() => handleStepClick(step.id)}
            className={`relative p-3 sm:p-4 rounded-lg border transition-all duration-300 group ${
              activeStep === step.id
                ? "border-primary bg-primary/10"
                : completedSteps.includes(step.id)
                ? "border-green-500/30 bg-green-500/5"
                : "border-border/50 bg-card/50 hover:border-primary/50"
            }`}
          >
            <div className="flex flex-col items-center gap-1 sm:gap-2">
              <div
                className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all ${
                  activeStep === step.id
                    ? "bg-primary text-background"
                    : completedSteps.includes(step.id)
                    ? "bg-green-500 text-background"
                    : "bg-card border border-border text-foreground"
                }`}
              >
                {completedSteps.includes(step.id) ? (
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <span className="text-xs sm:text-sm font-bold">{step.id}</span>
                )}
              </div>
              <span className="text-xs text-center leading-tight line-clamp-2">
                {step.title.split(" ")[0]}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Step Content */}
      {currentStep && (
        <Card className="p-6 sm:p-8 border-border/50 space-y-6 animate-in fade-in duration-300">
          {/* Header */}
          <div className="space-y-3">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-background flex-shrink-0">
                {currentStep.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl sm:text-3xl font-bold">
                  Passo {currentStep.id}: {currentStep.title}
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground mt-1">
                  {currentStep.description}
                </p>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-3">
            <h3 className="font-bold text-base sm:text-lg">Como fazer:</h3>
            <ol className="space-y-2 sm:space-y-3">
              {currentStep.details.map((detail, idx) => (
                <li key={idx} className="flex gap-3 sm:gap-4">
                  <span className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs sm:text-sm font-bold text-primary">
                    {idx + 1}
                  </span>
                  <span className="text-sm sm:text-base text-muted-foreground pt-0.5">
                    {detail}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          {/* Tips */}
          {currentStep.tips && currentStep.tips.length > 0 && (
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30 space-y-2">
              <p className="text-xs sm:text-sm font-semibold text-blue-500 flex items-center gap-2">
                <Zap className="w-4 h-4" /> Dicas Úteis
              </p>
              <ul className="space-y-1">
                {currentStep.tips.map((tip, idx) => (
                  <li key={idx} className="text-xs sm:text-sm text-blue-500/80">
                    • {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Warnings */}
          {currentStep.warnings && currentStep.warnings.length > 0 && (
            <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/30 space-y-2">
              <p className="text-xs sm:text-sm font-semibold text-orange-500 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> Atenção
              </p>
              <ul className="space-y-1">
                {currentStep.warnings.map((warning, idx) => (
                  <li key={idx} className="text-xs sm:text-sm text-orange-500/80">
                    • {warning}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
            <Button
              variant="outline"
              onClick={() => {
                if (activeStep > 1) {
                  handleStepClick(activeStep - 1);
                }
              }}
              disabled={activeStep === 1}
              className="flex-1 border-primary/30 hover:bg-primary/10 disabled:opacity-50"
            >
              ← Anterior
            </Button>

            <Button
              onClick={() => handleMarkComplete(activeStep)}
              variant={completedSteps.includes(activeStep) ? "default" : "outline"}
              className={`flex-1 ${
                completedSteps.includes(activeStep)
                  ? "bg-green-500 hover:bg-green-600 text-background"
                  : "border-primary/30 hover:bg-primary/10"
              }`}
            >
              {completedSteps.includes(activeStep) ? "✓ Concluído" : "Marcar como Concluído"}
            </Button>

            <Button
              onClick={() => {
                if (activeStep < steps.length) {
                  handleStepClick(activeStep + 1);
                }
              }}
              disabled={activeStep === steps.length}
              className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-background disabled:opacity-50 gap-2"
            >
              Próximo <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      )}

      {/* Completion Message */}
      {completedSteps.length === steps.length && (
        <Card className="p-6 sm:p-8 border-green-500/30 bg-green-500/5 text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 sm:w-12 sm:h-12 text-green-500" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-bold text-green-500">
              Parabéns! 🎉
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground">
              Você completou todos os passos de instalação. Seu Funcionário Digital está pronto para usar!
            </p>
          </div>
          <a href="http://localhost:3000" target="_blank" rel="noopener noreferrer">
            <Button className="bg-green-500 hover:bg-green-600 text-background gap-2">
              Acessar Agora <ChevronRight className="w-4 h-4" />
            </Button>
          </a>
        </Card>
      )}
    </div>
  );
}
