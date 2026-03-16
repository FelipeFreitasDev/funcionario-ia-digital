import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export default function VerifyEmail() {
  const [location] = useLocation();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Simular verificação de email
    const timer = setTimeout(() => {
      const params = new URLSearchParams(location.split("?")[1]);
      const token = params.get("token");

      if (token) {
        setStatus("success");
        setMessage("Email verificado com sucesso! Sua conta está ativa.");
      } else {
        setStatus("error");
        setMessage("Token de verificação inválido ou expirado.");
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [location]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Verificação de Email</CardTitle>
          <CardDescription>Confirmando seu endereço de email...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {status === "loading" && (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
              <p className="text-sm text-muted-foreground">Verificando seu email...</p>
            </div>
          )}

          {status === "success" && (
            <div className="flex flex-col items-center gap-4">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
              <div className="text-center">
                <h3 className="font-semibold mb-2">Email Verificado!</h3>
                <p className="text-sm text-muted-foreground mb-6">{message}</p>
              </div>
              <div className="space-y-2 w-full">
                <Button className="w-full" onClick={() => window.location.href = "/integration-setup"}>
                  Configurar Integrações
                </Button>
                <Button variant="outline" className="w-full" onClick={() => window.location.href = "/dashboard"}>
                  Ir para Dashboard
                </Button>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-col items-center gap-4">
              <AlertCircle className="w-12 h-12 text-red-600" />
              <div className="text-center">
                <h3 className="font-semibold mb-2">Erro na Verificação</h3>
                <p className="text-sm text-muted-foreground mb-6">{message}</p>
              </div>
              <div className="space-y-2 w-full">
                <Button 
                  className="w-full" 
                  onClick={() => window.location.href = "/"}
                >
                  Voltar para Home
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    // Reenviar email de verificação
                    alert("Email de verificação reenviado!");
                  }}
                >
                  Reenviar Email
                </Button>
              </div>
            </div>
          )}

          {/* INFO BOX */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900">
            <p className="font-semibold mb-2">O que fazer agora?</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Configure suas credenciais de Stripe e SendGrid</li>
              <li>Conecte suas contas de e-commerce (Shopee, Mercado Livre, Amazon)</li>
              <li>Comece a usar o Funcionário Digital</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
