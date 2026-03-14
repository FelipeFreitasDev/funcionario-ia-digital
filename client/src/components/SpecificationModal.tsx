import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface SpecificationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SpecificationModal({ open, onOpenChange }: SpecificationModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-96 overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Especificação Técnica Completa</DialogTitle>
          <DialogDescription>
            Arquitetura, stack tecnológica e roadmap de desenvolvimento
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <section>
            <h3 className="text-lg font-bold mb-3 text-primary">Stack Tecnológica</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-semibold text-foreground">Core LLM</p>
                <p className="text-muted-foreground">Ollama (Llama 3.1, Phi-4, Mistral)</p>
              </div>
              <div>
                <p className="font-semibold text-foreground">Voz (STT/TTS)</p>
                <p className="text-muted-foreground">Faster-Whisper + Piper/Kokoro-82M</p>
              </div>
              <div>
                <p className="font-semibold text-foreground">Orquestração</p>
                <p className="text-muted-foreground">LangGraph para agentes autônomos</p>
              </div>
              <div>
                <p className="font-semibold text-foreground">Automação Web</p>
                <p className="text-muted-foreground">Playwright para navegação e RPA</p>
              </div>
              <div>
                <p className="font-semibold text-foreground">Bancos de Dados</p>
                <p className="text-muted-foreground">SQLite + ChromaDB (Vetorial/RAG)</p>
              </div>
              <div>
                <p className="font-semibold text-foreground">Backend/Frontend</p>
                <p className="text-muted-foreground">FastAPI (Python) + React</p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-bold mb-3 text-secondary">Roadmap de Desenvolvimento</h3>
            <div className="space-y-3">
              <div className="border-l-2 border-primary pl-4">
                <p className="font-semibold">Fase 1: MVP Funcional (4-6 semanas)</p>
                <p className="text-sm text-muted-foreground">Ollama, Faster-Whisper, Piper e Interface Básica</p>
              </div>
              <div className="border-l-2 border-secondary pl-4">
                <p className="font-semibold">Fase 2: Skills de Produtividade (6-8 semanas)</p>
                <p className="text-sm text-muted-foreground">E-mail, Calendário, Documentos, RAG e Automação Web</p>
              </div>
              <div className="border-l-2 border-primary pl-4">
                <p className="font-semibold">Fase 3: Agente Autônomo (8-10 semanas)</p>
                <p className="text-sm text-muted-foreground">LangGraph, Redes Sociais, E-commerce e Desenvolvimento</p>
              </div>
              <div className="border-l-2 border-secondary pl-4">
                <p className="font-semibold">Fase 4: Personalização (4-6 semanas)</p>
                <p className="text-sm text-muted-foreground">Perfis, Aprendizado de Padrões e Dashboard de Insights</p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-bold mb-3 text-primary">Hardware Recomendado</h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="p-3 rounded-lg bg-card border border-border">
                <p className="font-semibold mb-2">Básico</p>
                <p className="text-muted-foreground text-xs">Intel i5, 16GB RAM, SSD 100GB</p>
              </div>
              <div className="p-3 rounded-lg bg-card border border-border">
                <p className="font-semibold mb-2">Intermediário</p>
                <p className="text-muted-foreground text-xs">Intel i7, 32GB RAM, RTX 3060, SSD 500GB</p>
              </div>
              <div className="p-3 rounded-lg bg-card border border-border">
                <p className="font-semibold mb-2">Avançado</p>
                <p className="text-muted-foreground text-xs">Intel i9, 64GB RAM, RTX 4090, SSD 1TB+</p>
              </div>
            </div>
          </section>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-border">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-background">
            Baixar Documentação PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
