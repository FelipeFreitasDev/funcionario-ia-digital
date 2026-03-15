import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, ArrowRight, Mail, Zap, HelpCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useLocation } from "wouter";
import InstallationGuide from "@/components/InstallationGuide";
import SupportModal from "@/components/SupportModal";

/**
 * Success Page: Página de Sucesso após Pagamento
 * Cria conta automaticamente e redireciona ao dashboard
 * URL esperada: /success?transaction_id=xxx&email=xxx&status=approved
 */

export default function Success() {
  const [, navigate] = useLocation();
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState<{
    transactionId: string;
    email: string;
    status: string;
  } | null>(null);
  const [accountCreated, setAccountCreated] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [supportModalOpen, setSupportModalOpen] = useState(false);

  useEffect(() => {
    // Capturar parâmetros da URL
    const params = new URLSearchParams(window.location.search);
    const transactionId = params.get("transaction_id") || params.get("id") || "DEMO-" + Date.now();
    const email = params.get("email") || "seu-email@exemplo.com";
    const status = params.get("status") || "approved";

    // Dados de pagamento
    const data = {
      transactionId,
      email,
      status,
    };

    setPaymentData(data);

    // Criar conta automaticamente
    setTimeout(() => {
      // Simular criação de conta
      const tempPassword = Math.random().toString(36).slice(-8);
      localStorage.setItem("userEmail", email);
      localStorage.setItem("tempPassword", tempPassword);
      localStorage.setItem("transactionId", transactionId);
      
      setAccountCreated(true);
      setLoading(false);
      toast.success("✅ Conta criada com sucesso!");
    }, 2000);
  }, []);

  // Countdown para redirecionamento automático
  useEffect(() => {
    if (!accountCreated) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/dashboard");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [accountCreated, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto" />
          <p className="text-white text-lg">Criando sua conta...</p>
          <p className="text-slate-400 text-sm">Aguarde um momento</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Success Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <CheckCircle className="w-20 h-20 text-green-500 animate-bounce" />
          </div>
          <h1 className="text-4xl font-bold text-white">Parabéns! 🎉</h1>
          <p className="text-xl text-slate-300">
            Seu pagamento foi aprovado e sua conta foi criada com sucesso!
          </p>
        </div>

        {/* Payment Details */}
        {paymentData && (
          <Card className="bg-slate-800 border-slate-700 p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-slate-700">
                <span className="text-slate-400">ID da Transação:</span>
                <span className="text-white font-mono text-sm">{paymentData.transactionId}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-slate-700">
                <span className="text-slate-400">Email:</span>
                <span className="text-white">{paymentData.email}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Status:</span>
                <span className="px-3 py-1 bg-green-600/20 text-green-300 rounded-full text-sm font-semibold">
                  ✓ Aprovado
                </span>
              </div>
            </div>
          </Card>
        )}

        {/* Main CTA */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 border-0 p-8">
          <div className="space-y-4 text-center">
            <Zap className="w-12 h-12 text-white mx-auto" />
            <h2 className="text-2xl font-bold text-white">Pronto para começar?</h2>
            <p className="text-blue-100">
              Sua conta foi criada automaticamente. Clique abaixo para acessar seu Funcionário Digital pessoal!
            </p>
            <Button
              onClick={() => navigate("/dashboard")}
              className="w-full bg-white text-blue-600 hover:bg-blue-50 font-bold text-lg py-6 rounded-lg"
            >
              Acessar Meu Funcionário Digital
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <p className="text-blue-100 text-sm">
              Redirecionando automaticamente em {countdown}s...
            </p>
          </div>
        </Card>

        {/* What's Included */}
        <Card className="bg-slate-800 border-slate-700 p-6">
          <h3 className="text-lg font-bold text-white mb-4">O que você pode fazer agora:</h3>
          <ul className="space-y-3">
            <li className="flex items-center gap-3 text-slate-300">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              Conectar suas redes sociais (Facebook, Instagram, Twitter, etc)
            </li>
            <li className="flex items-center gap-3 text-slate-300">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              Criar e agendar posts automáticos
            </li>
            <li className="flex items-center gap-3 text-slate-300">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              Visualizar analytics em tempo real
            </li>
            <li className="flex items-center gap-3 text-slate-300">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              Usar IA para gerar conteúdo otimizado
            </li>
            <li className="flex items-center gap-3 text-slate-300">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              Gerenciar múltiplas contas de uma vez
            </li>
          </ul>
        </Card>

        {/* Email Confirmation */}
        <Card className="bg-slate-800 border-slate-700 p-6">
          <div className="flex items-start gap-4">
            <Mail className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-white font-semibold mb-2">Verifique seu email</h3>
              <p className="text-slate-400 text-sm">
                Enviamos um email de confirmação para <strong>{paymentData?.email}</strong> com instruções de primeiro acesso e suporte.
              </p>
            </div>
          </div>
        </Card>

        {/* Support */}
        <Card className="bg-slate-800 border-slate-700 p-6">
          <div className="flex items-start gap-4">
            <HelpCircle className="w-6 h-6 text-purple-500 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="text-white font-semibold mb-2">Precisa de ajuda?</h3>
              <p className="text-slate-400 text-sm mb-3">
                Estamos aqui para ajudar! Clique no botão abaixo para abrir um ticket de suporte.
              </p>
              <Button
                onClick={() => setSupportModalOpen(true)}
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                Abrir Ticket de Suporte
              </Button>
            </div>
          </div>
        </Card>

        {/* Installation Guide */}
        <Card className="bg-slate-800 border-slate-700 p-6">
          <h3 className="text-lg font-bold text-white mb-4">Primeiros Passos</h3>
          <InstallationGuide />
        </Card>

        {/* Footer */}
        <div className="text-center text-slate-400 text-sm">
          <p>Seu acesso é válido por 30 dias. Após este período, você pode renovar sua assinatura.</p>
          <p className="mt-2">
            Garantia de 30 dias ou dinheiro de volta. Sem perguntas.
          </p>
        </div>
      </div>

      {/* Support Modal */}
      <SupportModal isOpen={supportModalOpen} onClose={() => setSupportModalOpen(false)} />
    </div>
  );
}
