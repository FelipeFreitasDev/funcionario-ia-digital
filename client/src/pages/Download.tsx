import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download as DownloadIcon, Lock, CheckCircle, AlertCircle, Zap } from "lucide-react";

/**
 * Download Page: Página de Download Gated (Requer Pagamento)
 * Simula verificação de pagamento e oferece download do executável
 */

export default function Download() {
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    // Simula verificação de pagamento via URL params ou localStorage
    const params = new URLSearchParams(window.location.search);
    const transactionId = params.get("transaction_id");
    const email = params.get("email");

    if (transactionId && email) {
      // Em produção, verificar com Kiwify API
      setUserEmail(email);
      setPaymentVerified(true);
    }

    setLoading(false);
  }, []);

  const handleDownload = () => {
    // Simula download do executável
    const link = document.createElement("a");
    link.href = "https://example.com/funcionario-digital-v1.0.exe"; // Substituir com URL real
    link.download = "funcionario-digital-v1.0.exe";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Verificando pagamento...</p>
        </div>
      </div>
    );
  }

  if (!paymentVerified) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
          <div className="container flex items-center justify-between py-4">
            <a href="/" className="flex items-center gap-2 hover:opacity-80 transition">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Zap className="w-6 h-6 text-background" />
              </div>
              <span className="font-bold text-xl">Funcionário Digital</span>
            </a>
          </div>
        </nav>

        <div className="pt-32 pb-12">
          <div className="container max-w-2xl mx-auto">
            <Card className="p-12 border-border/50 text-center space-y-6">
              <Lock className="w-16 h-16 text-red-500 mx-auto" />
              <h1 className="text-3xl font-bold">Acesso Bloqueado</h1>
              <p className="text-lg text-muted-foreground">
                Para acessar o download do Funcionário Digital, você precisa completar o pagamento.
              </p>

              <div className="space-y-4 pt-6">
                {!showForm ? (
                  <Button
                    size="lg"
                    onClick={() => setShowForm(true)}
                    className="w-full bg-primary hover:bg-primary/90 text-background"
                  >
                    Tenho um código de acesso
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <input
                      type="email"
                      placeholder="Seu email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-card border border-border text-foreground"
                    />
                    <input
                      type="text"
                      placeholder="Código de acesso (da Kiwify)"
                      className="w-full px-4 py-2 rounded-lg bg-card border border-border text-foreground"
                    />
                    <Button
                      size="lg"
                      onClick={() => setPaymentVerified(true)}
                      className="w-full bg-primary hover:bg-primary/90 text-background"
                    >
                      Verificar Acesso
                    </Button>
                  </div>
                )}

                <a href="/checkout">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full border-primary/30 hover:bg-primary/10"
                  >
                    Voltar para Compra
                  </Button>
                </a>
              </div>

              <div className="pt-6 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Após completar o pagamento na Kiwify, você receberá um email com o link de download.
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
        <div className="container flex items-center justify-between py-4">
          <a href="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Zap className="w-6 h-6 text-background" />
            </div>
            <span className="font-bold text-xl">Funcionário Digital</span>
          </a>
          <a href="/" className="text-sm hover:text-primary transition">Voltar</a>
        </div>
      </nav>

      <div className="pt-32 pb-12">
        <div className="container max-w-2xl mx-auto">
          {/* Success Message */}
          <Card className="p-12 border-border/50 space-y-6 mb-8">
            <div className="flex items-center justify-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <h1 className="text-3xl font-bold">Pagamento Confirmado! ✓</h1>
            </div>
            <p className="text-lg text-muted-foreground text-center">
              Bem-vindo ao Funcionário Digital! Seu acesso foi ativado com sucesso.
            </p>
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
              <p className="text-sm text-green-500">
                <strong>Email de confirmação:</strong> {userEmail}
              </p>
            </div>
          </Card>

          {/* Download Section */}
          <Card className="p-12 border-border/50 space-y-6">
            <h2 className="text-2xl font-bold">Seu Download Está Pronto</h2>

            <div className="space-y-4">
              <div className="p-6 rounded-lg border border-primary/30 bg-primary/5 space-y-3">
                <h3 className="font-bold flex items-center gap-2">
                  <DownloadIcon className="w-5 h-5 text-primary" />
                  Funccionário Digital v1.0 (Windows/Mac/Linux)
                </h3>
                <p className="text-sm text-muted-foreground">
                  Executável completo com todos os modelos de IA pré-instalados
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>📦 Tamanho: 2.5 GB</span>
                  <span>⏱️ Tempo: ~5 min (conexão 100Mbps)</span>
                </div>
              </div>

              <Button
                size="lg"
                onClick={handleDownload}
                className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-background font-bold text-lg py-6"
              >
                <DownloadIcon className="w-5 h-5 mr-2" />
                Baixar Agora (2.5 GB)
              </Button>

              <div className="p-4 rounded-lg bg-card border border-border/50">
                <p className="text-sm text-muted-foreground">
                  💡 <strong>Dica:</strong> Use um gerenciador de downloads para pausar/retomar se necessário.
                </p>
              </div>
            </div>

            {/* Installation Guide */}
            <div className="space-y-4 pt-6 border-t border-border">
              <h3 className="font-bold text-lg">Próximos Passos:</h3>
              <ol className="space-y-3">
                {[
                  "Baixe o executável (2.5 GB)",
                  "Extraia o arquivo em uma pasta de sua escolha",
                  "Execute 'funcionario-digital.exe' (ou .app/.bin)",
                  "Siga o assistente de configuração inicial",
                  "Pronto! Seu assistente está funcionando offline",
                ].map((step, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                      {idx + 1}
                    </span>
                    <span className="text-sm">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Support */}
            <div className="space-y-4 pt-6 border-t border-border">
              <h3 className="font-bold text-lg">Precisa de Ajuda?</h3>
              <div className="grid grid-cols-2 gap-4">
                <a href="#" className="block">
                  <Button variant="outline" className="w-full border-primary/30 hover:bg-primary/10">
                    📖 Ver Documentação
                  </Button>
                </a>
                <a href="#" className="block">
                  <Button variant="outline" className="w-full border-primary/30 hover:bg-primary/10">
                    💬 Suporte via Email
                  </Button>
                </a>
              </div>
            </div>

            {/* Additional Resources */}
            <div className="space-y-4 pt-6 border-t border-border">
              <h3 className="font-bold text-lg">Recursos Inclusos:</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  "✓ Guia de Instalação",
                  "✓ Exemplos de Uso",
                  "✓ Modelos de IA Pré-configurados",
                  "✓ Acesso a Atualizações",
                  "✓ Comunidade Discord",
                  "✓ Suporte Técnico",
                ].map((resource, idx) => (
                  <div key={idx} className="text-sm text-muted-foreground">
                    {resource}
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Satisfaction Guarantee */}
          <Card className="p-6 border-border/50 mt-8 bg-green-500/5 border-green-500/30">
            <p className="text-sm text-green-500 font-semibold">
              ✓ Garantia de 30 dias ou seu dinheiro de volta
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Se por qualquer motivo não ficar satisfeito, devolvemos 100% do seu dinheiro sem perguntas.
            </p>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-8 bg-card/50 mt-16">
        <div className="container text-center text-sm text-muted-foreground">
          <p>&copy; 2026 Funcionário Digital. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
