import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, Download, Mail, Clock, Copy, AlertCircle, Zap, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import InstallationGuide from "@/components/InstallationGuide";
import SupportModal from "@/components/SupportModal";

/**
 * Success Page: Página de Sucesso após Pagamento
 * Captura parâmetros da Kiwify e oferece download
 * URL esperada: /success?transaction_id=xxx&email=xxx&status=approved
 */

export default function Success() {
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState<{
    transactionId: string;
    email: string;
    status: string;
  } | null>(null);
  const [downloadLink, setDownloadLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [supportModalOpen, setSupportModalOpen] = useState(false);

  useEffect(() => {
    // Capturar parâmetros da URL
    const params = new URLSearchParams(window.location.search);
    const transactionId = params.get("transaction_id") || params.get("id") || "DEMO-" + Date.now();
    const email = params.get("email") || "seu-email@exemplo.com";
    const status = params.get("status") || "approved";

    // Simular dados de pagamento
    const data = {
      transactionId,
      email,
      status,
    };

    setPaymentData(data);

    // Simular geração de link de download
    setTimeout(() => {
      const mockDownloadLink = `https://downloads.funcionariodigital.com/funcionario-digital-v1.0-${transactionId}.exe`;
      setDownloadLink(mockDownloadLink);
      setLoading(false);
    }, 1500);

    // Countdown para redirecionamento
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          // Redirecionar para download após 5 segundos
          // window.location.href = "/download";
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleCopyEmail = () => {
    if (paymentData?.email) {
      navigator.clipboard.writeText(paymentData.email);
      setCopied(true);
      toast.success("Email copiado!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (downloadLink) {
      const link = document.createElement("a");
      link.href = downloadLink;
      link.download = "funcionario-digital-v1.0.exe";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Download iniciado!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto"></div>
          <p className="text-sm sm:text-base text-muted-foreground">Processando seu pagamento...</p>
        </div>
      </div>
    );
  }

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

      <div className="pt-20 sm:pt-32 pb-8 sm:pb-12 px-4">
        <div className="container max-w-2xl mx-auto space-y-6 sm:space-y-8">
          {/* Success Banner */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-green-500/20 border border-green-500/30">
              <CheckCircle className="w-8 h-8 sm:w-12 sm:h-12 text-green-500 animate-pulse" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold">Pagamento Confirmado! 🎉</h1>
            <p className="text-base sm:text-lg text-muted-foreground">
              Obrigado por adquirir o Funcionário Digital. Seu acesso foi ativado com sucesso!
            </p>
          </div>

          {/* Payment Details Card */}
          <Card className="p-6 sm:p-8 border-border/50 space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold">Detalhes da Compra</h2>

              {/* Transaction ID */}
              <div className="p-4 rounded-lg bg-card/50 border border-border/50 space-y-2">
                <p className="text-xs sm:text-sm text-muted-foreground">ID da Transação</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-mono text-sm sm:text-base break-all text-primary font-bold">
                    {paymentData?.transactionId}
                  </p>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(paymentData?.transactionId || "");
                      toast.success("ID copiado!");
                    }}
                    className="p-2 hover:bg-card rounded transition"
                  >
                    <Copy className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              </div>

              {/* Email */}
              <div className="p-4 rounded-lg bg-card/50 border border-border/50 space-y-2">
                <p className="text-xs sm:text-sm text-muted-foreground">Email de Confirmação</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm sm:text-base break-all">{paymentData?.email}</p>
                  <button
                    onClick={handleCopyEmail}
                    className="p-2 hover:bg-card rounded transition"
                  >
                    <Copy className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              </div>

              {/* Status */}
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 space-y-2">
                <p className="text-xs sm:text-sm text-muted-foreground">Status</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <p className="text-sm sm:text-base font-semibold text-green-500">
                    {paymentData?.status === "approved" ? "✓ Pagamento Aprovado" : "Processando..."}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Download Section */}
          <Card className="p-6 sm:p-8 border-border/50 space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold">Seu Download Está Pronto</h2>

            {downloadLink ? (
              <div className="space-y-4">
                <div className="p-4 sm:p-6 rounded-lg border border-primary/30 bg-primary/5 space-y-3">
                  <h3 className="font-bold flex items-center gap-2 text-sm sm:text-base">
                    <Download className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                    Funcionário Digital v1.0
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Executável completo com todos os modelos de IA pré-instalados
                  </p>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-xs text-muted-foreground">
                    <span>📦 Tamanho: 2.5 GB</span>
                    <span>⏱️ Tempo: ~5 min (100Mbps)</span>
                  </div>
                </div>

                <Button
                  size="lg"
                  onClick={handleDownload}
                  className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-background font-bold text-base sm:text-lg py-5 sm:py-6 gap-2 h-auto"
                >
                  <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                  Baixar Agora (2.5 GB)
                </Button>

                <div className="p-3 sm:p-4 rounded-lg bg-card border border-border/50">
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    💡 <strong>Dica:</strong> Use gerenciador de downloads para pausar/retomar.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-lg bg-card/50 border border-border/50 text-center space-y-3">
                <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto"></div>
                <p className="text-sm text-muted-foreground">Gerando link de download...</p>
              </div>
            )}
          </Card>

          {/* Email Confirmation */}
          <Card className="p-6 sm:p-8 border-border/50 bg-blue-500/5 border-blue-500/30 space-y-4">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 flex-shrink-0 mt-1" />
              <div className="space-y-2 flex-1 min-w-0">
                <h3 className="font-bold text-sm sm:text-base">Confirmação por Email</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Um email com o link de download foi enviado para <strong className="break-all">{paymentData?.email}</strong>
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Se não receber em 5 minutos, verifique a pasta de spam.
                </p>
              </div>
            </div>
          </Card>

          {/* Installation Guide - Interactive */}
          <Card className="p-6 sm:p-8 border-border/50">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6">Guia de Instalação Interativo</h2>
            <InstallationGuide />
          </Card>

          {/* FAQ Section */}
          <Card className="p-6 sm:p-8 border-border/50 space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold">Perguntas Frequentes</h2>
            <div className="space-y-4">
              {[
                {
                  q: "Quanto tempo leva para instalar?",
                  a: "A primeira instalação leva 30-45 minutos (depende da sua conexão). Após isso, é instantâneo.",
                },
                {
                  q: "Preciso de internet para usar?",
                  a: "Sim, apenas para a instalação inicial. Depois funciona 100% offline.",
                },
                {
                  q: "Posso usar em múltiplos computadores?",
                  a: "Sim! Sua licença permite instalação em até 3 computadores.",
                },
                {
                  q: "E se der erro na instalação?",
                  a: "Consulte a seção de Troubleshooting ou entre em contato com suporte.",
                },
                {
                  q: "Posso desinstalar depois?",
                  a: "Sim, você pode desinstalar a qualquer momento sem perder seus dados.",
                },
                {
                  q: "Qual é o tamanho do arquivo?",
                  a: "O arquivo tem 2.5 GB. Certifique-se de ter espaço em disco disponível.",
                },
              ].map((faq, idx) => (
                <details key={idx} className="group cursor-pointer">
                  <summary className="flex items-center gap-3 font-semibold text-sm sm:text-base p-3 rounded-lg hover:bg-card/50 transition">
                    <span className="text-primary">+</span>
                    {faq.q}
                  </summary>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-2 ml-6 pb-3">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </Card>

          {/* Support & Resources */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a href="https://docs.funcionariodigital.com" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="w-full border-primary/30 hover:bg-primary/10 h-auto py-3 sm:py-4 text-sm sm:text-base">
                📖 Documentação Completa
              </Button>
            </a>
            <Button
              onClick={() => setSupportModalOpen(true)}
              variant="outline"
              className="w-full border-primary/30 hover:bg-primary/10 h-auto py-3 sm:py-4 text-sm sm:text-base gap-2"
            >
              <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              Reportar Problema
            </Button>
          </div>

          {/* Satisfaction Guarantee */}
          <Card className="p-4 sm:p-6 border-border/50 bg-green-500/5 border-green-500/30">
            <p className="text-xs sm:text-sm text-green-500 font-semibold">
              ✓ Garantia de 30 dias ou seu dinheiro de volta
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Se não ficar satisfeito, devolvemos 100% sem perguntas.
            </p>
          </Card>

          {/* Auto-redirect Info */}
          <div className="p-4 rounded-lg bg-card/50 border border-border/50 text-center">
            <p className="text-xs sm:text-sm text-muted-foreground">
              Você será redirecionado para a página de download em {countdown}s...
            </p>
          </div>
        </div>
      </div>

      {/* Support Modal */}
      <SupportModal
        isOpen={supportModalOpen}
        onClose={() => setSupportModalOpen(false)}
        email={paymentData?.email}
      />

      {/* Footer */}
      <footer className="border-t border-border py-6 sm:py-8 bg-card/50 mt-12 sm:mt-16">
        <div className="container px-4 text-center text-xs sm:text-sm text-muted-foreground">
          <p>&copy; 2026 Funcionário Digital. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
