import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download as DownloadIcon, Lock, CheckCircle, AlertCircle, Zap } from "lucide-react";

/**
 * Download Page: Página de Download Mobile-First Responsiva
 * Simula verificação de pagamento e oferece download do executável
 */

export default function Download() {
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const transactionId = params.get("transaction_id");
    const email = params.get("email");

    if (transactionId && email) {
      setUserEmail(email);
      setPaymentVerified(true);
    }

    setLoading(false);
  }, []);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "https://example.com/funcionario-digital-v1.0.exe";
    link.download = "funcionario-digital-v1.0.exe";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto"></div>
          <p className="text-sm sm:text-base text-muted-foreground">Verificando pagamento...</p>
        </div>
      </div>
    );
  }

  if (!paymentVerified) {
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
          </div>
        </nav>

        <div className="pt-20 sm:pt-32 pb-8 sm:pb-12 px-4">
          <div className="container max-w-2xl mx-auto">
            <Card className="p-6 sm:p-8 lg:p-12 border-border/50 text-center space-y-6">
              <Lock className="w-12 h-12 sm:w-16 sm:h-16 text-red-500 mx-auto" />
              <h1 className="text-2xl sm:text-3xl font-bold">Acesso Bloqueado</h1>
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">
                Para acessar o download, você precisa completar o pagamento.
              </p>

              <div className="space-y-3 sm:space-y-4 pt-6">
                {!showForm ? (
                  <Button
                    size="lg"
                    onClick={() => setShowForm(true)}
                    className="w-full bg-primary hover:bg-primary/90 text-background h-auto py-3 sm:py-4 text-sm sm:text-base"
                  >
                    Tenho um código de acesso
                  </Button>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    <input
                      type="email"
                      placeholder="Seu email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-card border border-border text-foreground text-sm sm:text-base"
                    />
                    <input
                      type="text"
                      placeholder="Código de acesso"
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-card border border-border text-foreground text-sm sm:text-base"
                    />
                    <Button
                      size="lg"
                      onClick={() => setPaymentVerified(true)}
                      className="w-full bg-primary hover:bg-primary/90 text-background h-auto py-3 sm:py-4 text-sm sm:text-base"
                    >
                      Verificar Acesso
                    </Button>
                  </div>
                )}

                <a href="/checkout" className="block">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full border-primary/30 hover:bg-primary/10 h-auto py-3 sm:py-4 text-sm sm:text-base"
                  >
                    Voltar para Compra
                  </Button>
                </a>
              </div>

              <div className="pt-6 border-t border-border">
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Após completar o pagamento na Kiwify, você receberá um email com o link.
                </p>
              </div>
            </Card>
          </div>
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
          {/* Success Message */}
          <Card className="p-6 sm:p-8 border-border/50 space-y-4 sm:space-y-6">
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-500 flex-shrink-0" />
              <h1 className="text-2xl sm:text-3xl font-bold">Pagamento Confirmado! ✓</h1>
            </div>
            <p className="text-base sm:text-lg text-muted-foreground text-center">
              Bem-vindo ao Funcionário Digital! Seu acesso foi ativado.
            </p>
            <div className="p-3 sm:p-4 rounded-lg bg-green-500/10 border border-green-500/30">
              <p className="text-xs sm:text-sm text-green-500 break-all">
                <strong>Email:</strong> {userEmail}
              </p>
            </div>
          </Card>

          {/* Download Section */}
          <Card className="p-6 sm:p-8 border-border/50 space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold">Seu Download Está Pronto</h2>

            <div className="space-y-4">
              <div className="p-4 sm:p-6 rounded-lg border border-primary/30 bg-primary/5 space-y-3">
                <h3 className="font-bold flex items-center gap-2 text-sm sm:text-base">
                  <DownloadIcon className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
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
                <DownloadIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                Baixar Agora (2.5 GB)
              </Button>

              <div className="p-3 sm:p-4 rounded-lg bg-card border border-border/50">
                <p className="text-xs sm:text-sm text-muted-foreground">
                  💡 <strong>Dica:</strong> Use gerenciador de downloads para pausar/retomar.
                </p>
              </div>
            </div>

            {/* Installation Guide */}
            <div className="space-y-4 pt-6 border-t border-border">
              <h3 className="font-bold text-base sm:text-lg">Próximos Passos:</h3>
              <ol className="space-y-2 sm:space-y-3">
                {[
                  "Baixe o executável (2.5 GB)",
                  "Extraia o arquivo em uma pasta",
                  "Execute o instalador",
                  "Siga o assistente de configuração",
                  "Pronto! Seu assistente está funcionando",
                ].map((step, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm">
                    <span className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Support */}
            <div className="space-y-3 sm:space-y-4 pt-6 border-t border-border">
              <h3 className="font-bold text-base sm:text-lg">Precisa de Ajuda?</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a href="#" className="block">
                  <Button variant="outline" className="w-full border-primary/30 hover:bg-primary/10 h-auto py-2 sm:py-3 text-xs sm:text-sm">
                    📖 Documentação
                  </Button>
                </a>
                <a href="#" className="block">
                  <Button variant="outline" className="w-full border-primary/30 hover:bg-primary/10 h-auto py-2 sm:py-3 text-xs sm:text-sm">
                    💬 Suporte
                  </Button>
                </a>
              </div>
            </div>

            {/* Additional Resources */}
            <div className="space-y-3 sm:space-y-4 pt-6 border-t border-border">
              <h3 className="font-bold text-base sm:text-lg">Recursos Inclusos:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                {[
                  "✓ Guia de Instalação",
                  "✓ Exemplos de Uso",
                  "✓ Modelos de IA",
                  "✓ Atualizações",
                  "✓ Comunidade Discord",
                  "✓ Suporte Técnico",
                ].map((resource, idx) => (
                  <div key={idx} className="text-xs sm:text-sm text-muted-foreground">
                    {resource}
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Satisfaction Guarantee */}
          <Card className="p-4 sm:p-6 border-border/50 bg-green-500/5 border-green-500/30">
            <p className="text-xs sm:text-sm text-green-500 font-semibold">
              ✓ Garantia de 30 dias ou seu dinheiro de volta
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Se não ficar satisfeito, devolvemos 100% sem perguntas.
            </p>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-6 sm:py-8 bg-card/50 mt-12 sm:mt-16">
        <div className="container px-4 text-center text-xs sm:text-sm text-muted-foreground">
          <p>&copy; 2026 Funcionário Digital. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
