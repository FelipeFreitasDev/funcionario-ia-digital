import { useEffect, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, ArrowRight, Mail } from "lucide-react";
import { useLocation } from "wouter";

export default function CheckoutSuccess() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    // Get session ID from URL
    const params = new URLSearchParams(window.location.search);
    const id = params.get("session_id");
    setSessionId(id);
  }, []);

  // If already authenticated, redirect to onboarding
  useEffect(() => {
    if (isAuthenticated && user) {
      setLocation("/onboarding");
    }
  }, [isAuthenticated, user, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Processando seu pagamento...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-background" />
            </div>
            <span className="font-bold text-xl">Funcionário Digital</span>
          </div>
        </div>
      </nav>

      {/* Success Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-secondary/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        </div>

        <div className="container max-w-2xl">
          <div className="text-center space-y-8">
            {/* Success Icon */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-full blur-xl opacity-50 animate-pulse"></div>
                <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <CheckCircle className="w-12 h-12 text-background" />
                </div>
              </div>
            </div>

            {/* Success Message */}
            <div className="space-y-4">
              <h1 className="text-4xl font-bold">
                Parabéns! 🎉
              </h1>
              <p className="text-xl text-muted-foreground">
                Seu pagamento foi processado com sucesso!
              </p>
            </div>

            {/* Info Card */}
            <Card className="p-8 border-border/50 space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <Mail className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div className="text-left">
                    <h3 className="font-semibold mb-1">Confirme seu Email</h3>
                    <p className="text-sm text-muted-foreground">
                      Enviamos um link de confirmação para seu email. Clique nele para ativar sua conta.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Não recebeu o email?</strong> Verifique a pasta de spam ou clique em "Reenviar Email" abaixo.
                  </p>
                </div>
              </div>

              {/* Session ID (for debugging) */}
              {sessionId && (
                <div className="p-4 bg-muted/50 border border-border rounded-lg">
                  <p className="text-xs text-muted-foreground font-mono break-all">
                    ID da Sessão: {sessionId}
                  </p>
                </div>
              )}
            </Card>

            {/* Next Steps */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Próximos Passos</h2>
              <div className="grid grid-cols-3 gap-4">
                <Card className="p-6 border-border/50">
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-bold">
                      1
                    </div>
                    <h3 className="font-semibold">Confirme Email</h3>
                    <p className="text-sm text-muted-foreground">
                      Clique no link enviado para seu email
                    </p>
                  </div>
                </Card>

                <Card className="p-6 border-border/50">
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-bold">
                      2
                    </div>
                    <h3 className="font-semibold">Crie Sua Senha</h3>
                    <p className="text-sm text-muted-foreground">
                      Defina uma senha segura para sua conta
                    </p>
                  </div>
                </Card>

                <Card className="p-6 border-border/50">
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-bold">
                      3
                    </div>
                    <h3 className="font-semibold">Conecte Plataformas</h3>
                    <p className="text-sm text-muted-foreground">
                      Autorize Shopee, ML e Amazon
                    </p>
                  </div>
                </Card>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center justify-center gap-4 pt-8">
              {isAuthenticated ? (
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-background gap-2 font-bold"
                  onClick={() => setLocation("/onboarding")}
                >
                  Ir para Onboarding <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <>
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-background gap-2 font-bold"
                    onClick={() => setLocation("/")}
                  >
                    Voltar para Home <ArrowRight className="w-4 h-4" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-primary/30 hover:bg-primary/10"
                    onClick={() => setLocation("/")}
                  >
                    Reenviar Email
                  </Button>
                </>
              )}
            </div>

            {/* Help Text */}
            <div className="pt-8 border-t border-border">
              <p className="text-sm text-muted-foreground mb-4">
                Precisa de ajuda? Entre em contato com nosso suporte
              </p>
              <a href="mailto:support@funcionariodigital.com" className="text-primary hover:text-primary/80 font-semibold">
                support@funcionariodigital.com
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2026 Funcionário Digital. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
