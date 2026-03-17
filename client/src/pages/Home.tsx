import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="border-b border-border">
        <div className="container flex items-center justify-between py-4">
          <h1 className="text-2xl font-bold">Funcionário Digital</h1>
          <Button onClick={() => window.location.href = getLoginUrl()}>
            Acessar SaaS
          </Button>
        </div>
      </nav>

      <section className="container py-20">
        <h2 className="text-4xl font-bold mb-4">Seu Assistente de IA Pessoal</h2>
        <p className="text-lg text-muted-foreground mb-8">
          Automatize tarefas, crie conteúdo e potencialize sua produtividade com inteligência artificial de ponta.
        </p>
        <div className="flex gap-4">
          <Button size="lg" onClick={() => window.location.href = getLoginUrl()}>
            Começar Agora
          </Button>
          <Button size="lg" variant="outline">
            Ver Planos
          </Button>
        </div>
      </section>
    </div>
  );
}
