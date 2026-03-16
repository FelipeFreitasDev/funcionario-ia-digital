import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Minimize2, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  id: string;
  type: "user" | "bot";
  text: string;
  timestamp: Date;
}

const FAQ_RESPONSES: Record<string, string> = {
  webhook: "Para configurar webhooks no Stripe, vá para Developers → Webhooks e clique em 'Add endpoint'. Cole a URL https://seu-dominio.com/api/webhooks/stripe e selecione os eventos desejados.",
  deploy: "Para fazer deploy, crie um checkpoint no Manus, clique em Publish e selecione o domínio. O processo leva 5-15 minutos.",
  stripe: "Você precisa de uma conta Stripe com chaves de produção (sk_live_* e pk_live_*). Configure as variáveis STRIPE_SECRET_KEY e STRIPE_WEBHOOK_SECRET no Manus.",
  database: "O banco de dados é gerenciado automaticamente pelo Manus. Execute 'pnpm db:push' para aplicar as migrações.",
  login: "Se o login não funciona, verifique se as variáveis OAuth estão configuradas corretamente no Manus Settings → Secrets.",
  checkout: "Para testar checkout, use o cartão de teste 4242 4242 4242 4242 com qualquer data futura e CVC.",
  logs: "Os logs estão em .manus-logs/. Use 'tail -f .manus-logs/devserver.log' para monitorar em tempo real.",
  backup: "Para fazer backup do banco de dados, execute: mysqldump -u $DB_USER -p$DB_PASSWORD -h $DB_HOST $DB_NAME > backup.sql",
  ssl: "SSL/TLS é configurado automaticamente pelo Manus para todos os domínios.",
  performance: "Para melhorar performance, verifique os logs, otimize queries do banco de dados e implemente cache.",
};

const KEYWORDS = {
  webhook: ["webhook", "webhooks", "endpoint", "eventos"],
  deploy: ["deploy", "publicar", "implantação", "publish"],
  stripe: ["stripe", "chaves", "api", "sk_live", "pk_live"],
  database: ["banco", "database", "migrações", "db:push"],
  login: ["login", "oauth", "autenticação", "auth"],
  checkout: ["checkout", "pagamento", "compra", "cartão"],
  logs: ["logs", "log", "erro", "error", "debug"],
  backup: ["backup", "restaurar", "restore"],
  ssl: ["ssl", "tls", "https", "certificado"],
  performance: ["performance", "lento", "slow", "otimização"],
};

function findAnswer(query: string): string | null {
  const lowerQuery = query.toLowerCase();
  for (const [key, keywords] of Object.entries(KEYWORDS)) {
    if (keywords.some((keyword) => lowerQuery.includes(keyword))) {
      return FAQ_RESPONSES[key];
    }
  }
  return null;
}

export function SupportChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      text: "Olá! 👋 Bem-vindo ao suporte de implantação. Como posso ajudar você hoje?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      text: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Simular resposta do bot
    setTimeout(() => {
      const answer =
        findAnswer(inputValue) ||
        "Desculpe, não consegui encontrar uma resposta para sua pergunta. Tente perguntar sobre: webhook, deploy, stripe, banco de dados, login, checkout, logs, backup, ssl ou performance.";

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        text: answer,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsLoading(false);
    }, 500);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center z-40"
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </button>
    );
  }

  return (
    <div
      className={`fixed bottom-6 right-6 w-96 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl z-50 transition-all ${
        isMinimized ? "h-14" : "h-96"
      } flex flex-col`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-4 rounded-t-lg flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-white">Suporte de Implantação</h3>
          <p className="text-xs text-cyan-100">Respostas instantâneas 24/7</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-white hover:bg-white/20 p-1 rounded transition"
          >
            {isMinimized ? (
              <Maximize2 className="w-4 h-4" />
            ) : (
              <Minimize2 className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white hover:bg-white/20 p-1 rounded transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    message.type === "user"
                      ? "bg-cyan-600 text-white rounded-br-none"
                      : "bg-slate-800 text-slate-100 rounded-bl-none border border-slate-700"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {message.timestamp.toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-800 text-slate-100 px-4 py-2 rounded-lg border border-slate-700 rounded-bl-none">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-slate-700 p-4 flex gap-2">
            <Input
              placeholder="Digite sua pergunta..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !isLoading) {
                  handleSendMessage();
                }
              }}
              className="bg-slate-800 border-slate-700 text-white placeholder-slate-500"
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || !inputValue.trim()}
              className="bg-cyan-600 hover:bg-cyan-700 text-white"
              size="sm"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>

          {/* Quick Tips */}
          <div className="border-t border-slate-700 p-3 bg-slate-800/50 text-xs text-slate-400">
            💡 Pergunte sobre: webhook, deploy, stripe, database, login, checkout, logs, backup, ssl, performance
          </div>
        </>
      )}
    </div>
  );
}
