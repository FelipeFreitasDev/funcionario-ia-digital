/**
 * Recommendation Notification - Pop-up não-bloqueante com recomendações
 */

import { useState, useEffect } from "react";
import { X, AlertCircle, Lightbulb, TrendingUp, ShoppingCart, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export interface Recommendation {
  id: string;
  type: "price_optimization" | "new_product" | "description_improvement" | "publish_time" | "inventory" | "performance";
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  action?: string;
  data?: Record<string, any>;
  createdAt: Date;
}

interface RecommendationNotificationProps {
  recommendation: Recommendation;
  onDismiss: (id: string) => void;
  onAction?: (recommendation: Recommendation) => void;
}

const getIcon = (type: string) => {
  switch (type) {
    case "price_optimization":
      return <TrendingUp className="w-5 h-5" />;
    case "new_product":
      return <ShoppingCart className="w-5 h-5" />;
    case "publish_time":
      return <Clock className="w-5 h-5" />;
    case "performance":
      return <Lightbulb className="w-5 h-5" />;
    default:
      return <AlertCircle className="w-5 h-5" />;
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "bg-red-500/10 border-red-500/20";
    case "medium":
      return "bg-yellow-500/10 border-yellow-500/20";
    case "low":
      return "bg-blue-500/10 border-blue-500/20";
    default:
      return "bg-gray-500/10 border-gray-500/20";
  }
};

const getPriorityBadgeColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "bg-red-500 text-white";
    case "medium":
      return "bg-yellow-500 text-white";
    case "low":
      return "bg-blue-500 text-white";
    default:
      return "bg-gray-500 text-white";
  }
};

export function RecommendationNotification({
  recommendation,
  onDismiss,
  onAction,
}: RecommendationNotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Auto-dismiss após 8 segundos
    const timer = setTimeout(() => {
      setIsVisible(false);
      onDismiss(recommendation.id);
    }, 8000);

    return () => clearTimeout(timer);
  }, [recommendation.id, onDismiss]);

  if (!isVisible) return null;

  return (
    <Card
      className={`fixed bottom-6 right-6 w-96 p-4 border-l-4 ${getPriorityColor(recommendation.priority)} shadow-lg animate-in slide-in-from-bottom-5 duration-300 z-50`}
    >
      <div className="flex gap-3">
        {/* Ícone */}
        <div className={`flex-shrink-0 mt-1 p-2 rounded-lg ${getPriorityBadgeColor(recommendation.priority)}`}>
          {getIcon(recommendation.type)}
        </div>

        {/* Conteúdo */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="font-semibold text-foreground text-sm">{recommendation.title}</p>
              <p className="text-muted-foreground text-xs mt-1 line-clamp-2">{recommendation.description}</p>
            </div>

            {/* Botão de fechar */}
            <button
              onClick={() => {
                setIsVisible(false);
                onDismiss(recommendation.id);
              }}
              className="flex-shrink-0 ml-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Botões de ação */}
          {recommendation.action && (
            <div className="flex gap-2 mt-3">
              <Button
                size="sm"
                variant="default"
                onClick={() => {
                  onAction?.(recommendation);
                  setIsVisible(false);
                  onDismiss(recommendation.id);
                }}
                className="text-xs"
              >
                {recommendation.action}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setIsVisible(false);
                  onDismiss(recommendation.id);
                }}
                className="text-xs"
              >
                Descartar
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

/**
 * Notification Queue - Gerencia múltiplas notificações
 */
interface NotificationQueueProps {
  recommendations: Recommendation[];
  onDismiss: (id: string) => void;
  onAction?: (recommendation: Recommendation) => void;
}

export function RecommendationNotificationQueue({
  recommendations,
  onDismiss,
  onAction,
}: NotificationQueueProps) {
  return (
    <div className="fixed bottom-6 right-6 space-y-3 z-50 pointer-events-none">
      {recommendations.slice(0, 3).map((rec, index) => (
        <div key={rec.id} style={{ pointerEvents: "auto", marginBottom: `${index * 10}px` }}>
          <RecommendationNotification
            recommendation={rec}
            onDismiss={onDismiss}
            onAction={onAction}
          />
        </div>
      ))}
    </div>
  );
}
