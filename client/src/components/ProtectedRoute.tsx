import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { getLoginUrl } from "@/const";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Lock } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requirePayment?: boolean;
  fallback?: React.ReactNode;
}

/**
 * ProtectedRoute: Componente que protege rotas
 * - Se requirePayment=true: Bloqueia até que o usuário tenha pagamento confirmado
 * - Se requirePayment=false: Apenas requer autenticação
 */
export function ProtectedRoute({
  children,
  requirePayment = false,
  fallback,
}: ProtectedRouteProps) {
  const { user, loading, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  // Verificar se o usuário tem pagamento confirmado
  const hasActiveSubscription =
    user && 
    user.subscriptionStatus === "active" &&
    user.currentPlanId;

  useEffect(() => {
    if (loading) return;

    // Se requer pagamento e não tem
    if (requirePayment && !hasActiveSubscription) {
      navigate("/subscription-plans");
      return;
    }

    // Se requer autenticação e não está autenticado
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }
  }, [loading, isAuthenticated, hasActiveSubscription, requirePayment, navigate]);

  // Enquanto carrega
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-300">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se requer pagamento e não tem
  if (requirePayment && !hasActiveSubscription) {
    return (
      fallback || (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 flex items-center justify-center p-4">
          <Card className="bg-slate-800 border-slate-700 max-w-md w-full p-8">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center">
                <Lock className="w-8 h-8 text-red-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Acesso Restrito</h2>
              <p className="text-slate-300">
                Este recurso está disponível apenas para usuários com assinatura ativa.
              </p>
              <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4 w-full text-left">
                <div className="flex gap-2 items-start">
                  <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-slate-300">
                    <p className="font-semibold mb-1">Seu status atual:</p>
                    <p>Sem assinatura ativa</p>
                  </div>
                </div>
              </div>
              <Button
                onClick={() => navigate("/checkout")}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:opacity-90 text-white font-semibold"
              >
                Ver Planos e Assinar
              </Button>
            </div>
          </Card>
        </div>
      )
    );
  }

  // Se requer autenticação e não está autenticado
  if (!isAuthenticated) {
    return null; // O hook useAuth vai redirecionar
  }

  // Tudo OK, renderizar conteúdo
  return <>{children}</>;
}
