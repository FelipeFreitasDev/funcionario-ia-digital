import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle, CheckCircle, Loader2, Send, Upload, X } from "lucide-react";
import { toast } from "sonner";

/**
 * Support Form: Formulário de Suporte para Problemas de Instalação
 * Captura problemas, categoria, email, descrição e permite upload de arquivos
 */

interface SupportFormData {
  name: string;
  email: string;
  category: string;
  subject: string;
  description: string;
  attachments: File[];
}

interface SupportFormProps {
  onClose?: () => void;
  email?: string;
}

export default function SupportForm({ onClose, email: initialEmail }: SupportFormProps) {
  const [formData, setFormData] = useState<SupportFormData>({
    name: "",
    email: initialEmail || "",
    category: "installation",
    subject: "",
    description: "",
    attachments: [],
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = [
    { value: "installation", label: "Problema na Instalação" },
    { value: "performance", label: "Problemas de Performance" },
    { value: "compatibility", label: "Compatibilidade do Sistema" },
    { value: "features", label: "Dúvida sobre Recursos" },
    { value: "offline", label: "Problema Offline" },
    { value: "other", label: "Outro" },
  ];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Nome é obrigatório";
    if (!formData.email.trim()) newErrors.email = "Email é obrigatório";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }
    if (!formData.subject.trim()) newErrors.subject = "Assunto é obrigatório";
    if (!formData.description.trim()) newErrors.description = "Descrição é obrigatória";
    if (formData.description.length < 20) {
      newErrors.description = "Descrição deve ter pelo menos 20 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const totalSize = formData.attachments.reduce((acc, f) => acc + f.size, 0) +
        newFiles.reduce((acc, f) => acc + f.size, 0);

      if (totalSize > 50 * 1024 * 1024) {
        toast.error("Tamanho total dos arquivos não pode exceder 50MB");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        attachments: [...prev.attachments, ...newFiles],
      }));
    }
  };

  const removeAttachment = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Por favor, preencha todos os campos corretamente");
      return;
    }

    setLoading(true);

    try {
      // Simular envio do formulário
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Gerar ID de ticket único
      const newTicketId = `SUPP-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      setTicketId(newTicketId);
      setSubmitted(true);

      toast.success("Ticket de suporte criado com sucesso!");

      // Aqui você integraria com um backend real
      console.log("Formulário enviado:", {
        ...formData,
        ticketId: newTicketId,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      toast.error("Erro ao enviar formulário. Tente novamente.");
      console.error("Erro:", error);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="w-full space-y-6">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-green-500/20 border border-green-500/30">
            <CheckCircle className="w-8 h-8 sm:w-12 sm:h-12 text-green-500" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-bold">Ticket Criado com Sucesso!</h3>
            <p className="text-sm sm:text-base text-muted-foreground">
              Recebemos seu relato e entraremos em contato em breve.
            </p>
          </div>
        </div>

        <Card className="p-6 sm:p-8 border-border/50 space-y-4">
          <div className="space-y-2">
            <p className="text-xs sm:text-sm text-muted-foreground">ID do Ticket</p>
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-mono text-sm sm:text-base font-bold text-primary break-all">
                {ticketId}
              </p>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(ticketId);
                  toast.success("ID copiado!");
                }}
                className="p-2 hover:bg-card rounded transition"
              >
                📋
              </button>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
            <p className="text-xs sm:text-sm text-blue-500">
              <strong>💡 Dica:</strong> Guarde este ID para referência. Você pode acompanhar seu ticket
              em{" "}
              <a
                href="https://suporte.funcionariodigital.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:opacity-80"
              >
                suporte.funcionariodigital.com
              </a>
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-xs sm:text-sm text-muted-foreground">
              Um email de confirmação foi enviado para <strong>{formData.email}</strong>
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Tempo de resposta: <strong>até 24 horas</strong>
            </p>
          </div>
        </Card>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={() => {
              setSubmitted(false);
              setFormData({
                name: "",
                email: initialEmail || "",
                category: "installation",
                subject: "",
                description: "",
                attachments: [],
              });
            }}
            variant="outline"
            className="flex-1 border-primary/30 hover:bg-primary/10"
          >
            Criar Outro Ticket
          </Button>
          {onClose && (
            <Button
              onClick={onClose}
              className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-background"
            >
              Fechar
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      {/* Name */}
      <div className="space-y-2">
        <label className="text-sm font-semibold">
          Seu Nome <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="João Silva"
          className="w-full px-4 py-2 sm:py-3 rounded-lg border border-border bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition text-sm sm:text-base"
        />
        {errors.name && (
          <p className="text-xs sm:text-sm text-red-500 flex items-center gap-1">
            <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" /> {errors.name}
          </p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label className="text-sm font-semibold">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="seu-email@exemplo.com"
          className="w-full px-4 py-2 sm:py-3 rounded-lg border border-border bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition text-sm sm:text-base"
        />
        {errors.email && (
          <p className="text-xs sm:text-sm text-red-500 flex items-center gap-1">
            <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" /> {errors.email}
          </p>
        )}
      </div>

      {/* Category */}
      <div className="space-y-2">
        <label className="text-sm font-semibold">
          Categoria do Problema <span className="text-red-500">*</span>
        </label>
        <select
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          className="w-full px-4 py-2 sm:py-3 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition text-sm sm:text-base"
        >
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      {/* Subject */}
      <div className="space-y-2">
        <label className="text-sm font-semibold">
          Assunto <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="subject"
          value={formData.subject}
          onChange={handleInputChange}
          placeholder="Resumo do problema"
          className="w-full px-4 py-2 sm:py-3 rounded-lg border border-border bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition text-sm sm:text-base"
        />
        {errors.subject && (
          <p className="text-xs sm:text-sm text-red-500 flex items-center gap-1">
            <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" /> {errors.subject}
          </p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="text-sm font-semibold">
          Descrição Detalhada <span className="text-red-500">*</span>
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Descreva o problema em detalhes. Inclua passos para reproduzir, mensagens de erro, etc."
          rows={5}
          className="w-full px-4 py-2 sm:py-3 rounded-lg border border-border bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition resize-none text-sm sm:text-base"
        />
        <div className="flex justify-between items-center">
          <p className="text-xs text-muted-foreground">
            {formData.description.length} caracteres
          </p>
          {errors.description && (
            <p className="text-xs sm:text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" /> {errors.description}
            </p>
          )}
        </div>
      </div>

      {/* File Upload */}
      <div className="space-y-2">
        <label className="text-sm font-semibold">
          Anexar Arquivos (Opcional)
        </label>
        <p className="text-xs text-muted-foreground">
          Máx 50MB total. Aceita: logs, screenshots, arquivos de erro
        </p>
        <label className="flex items-center justify-center w-full px-4 py-6 sm:py-8 border-2 border-dashed border-border rounded-lg hover:border-primary/50 hover:bg-primary/5 transition cursor-pointer">
          <div className="text-center space-y-2">
            <Upload className="w-6 h-6 sm:w-8 sm:h-8 mx-auto text-muted-foreground" />
            <p className="text-xs sm:text-sm font-semibold">
              Clique ou arraste arquivos aqui
            </p>
          </div>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="hidden"
            accept=".log,.txt,.jpg,.png,.zip,.pdf"
          />
        </label>

        {/* Attached Files */}
        {formData.attachments.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs sm:text-sm font-semibold">Arquivos anexados:</p>
            <div className="space-y-2">
              {formData.attachments.map((file, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-lg bg-card/50 border border-border/50"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-primary">📎</span>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-semibold truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {(file.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeAttachment(idx)}
                    className="p-1 hover:bg-card rounded transition flex-shrink-0"
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Info Box */}
      <Card className="p-4 sm:p-6 border-blue-500/30 bg-blue-500/5">
        <p className="text-xs sm:text-sm text-blue-500">
          <strong>💡 Dica:</strong> Para problemas de instalação, inclua:
          <br />• Seu sistema operacional e versão
          <br />• Mensagens de erro exatas
          <br />• Logs de instalação (se disponível)
          <br />• Screenshots do erro
        </p>
      </Card>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-background disabled:opacity-50 font-bold text-base sm:text-lg py-5 sm:py-6 h-auto gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
            Enviando...
          </>
        ) : (
          <>
            <Send className="w-4 h-4 sm:w-5 sm:h-5" />
            Enviar Ticket de Suporte
          </>
        )}
      </Button>
    </form>
  );
}
