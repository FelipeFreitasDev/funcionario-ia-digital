import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CheckCircle2, Copy, ExternalLink } from "lucide-react";

export default function IntegrationSetup() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("stripe");
  const [stripeKeys, setStripeKeys] = useState({ secret: "", publishable: "" });
  const [sendgridKey, setSendgridKey] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Faça login para acessar as configurações de integrações.</p>
      </div>
    );
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Configuração de Integrações</h1>
          <p className="text-muted-foreground">
            Configure as chaves de API para Stripe e SendGrid para ativar pagamentos e envio de emails
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="stripe">Stripe</TabsTrigger>
            <TabsTrigger value="sendgrid">SendGrid</TabsTrigger>
          </TabsList>

          {/* STRIPE SETUP */}
          <TabsContent value="stripe" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurar Stripe</CardTitle>
                <CardDescription>
                  Siga os passos abaixo para obter suas chaves de API do Stripe
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* PASSO 1 */}
                <div className="border-l-4 border-primary pl-4">
                  <h3 className="font-semibold mb-2">Passo 1: Criar Conta Stripe</h3>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground mb-4">
                    <li>Acesse <a href="https://dashboard.stripe.com/register" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1 inline-flex">https://dashboard.stripe.com/register <ExternalLink className="w-4 h-4" /></a></li>
                    <li>Preencha seus dados (email, nome, senha)</li>
                    <li>Confirme seu email</li>
                    <li>Complete o perfil da empresa</li>
                  </ol>
                </div>

                {/* PASSO 2 */}
                <div className="border-l-4 border-primary pl-4">
                  <h3 className="font-semibold mb-2">Passo 2: Obter Chaves de API</h3>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground mb-4">
                    <li>No Dashboard Stripe, clique em <strong>Developers</strong> (canto superior direito)</li>
                    <li>Clique em <strong>API Keys</strong></li>
                    <li>Você verá duas chaves:
                      <ul className="list-disc list-inside ml-4 mt-2">
                        <li><strong>Publishable Key</strong> (começa com pk_live_)</li>
                        <li><strong>Secret Key</strong> (começa com sk_live_)</li>
                      </ul>
                    </li>
                    <li>Copie ambas as chaves</li>
                  </ol>
                </div>

                {/* FORMULÁRIO */}
                <div className="bg-muted p-4 rounded-lg space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Secret Key</label>
                    <div className="flex gap-2">
                      <Input
                        type="password"
                        placeholder="sk_live_..."
                        value={stripeKeys.secret}
                        onChange={(e) => setStripeKeys({ ...stripeKeys, secret: e.target.value })}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(stripeKeys.secret, "stripe-secret")}
                      >
                        {copied === "stripe-secret" ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Publishable Key</label>
                    <div className="flex gap-2">
                      <Input
                        type="password"
                        placeholder="pk_live_..."
                        value={stripeKeys.publishable}
                        onChange={(e) => setStripeKeys({ ...stripeKeys, publishable: e.target.value })}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(stripeKeys.publishable, "stripe-pub")}
                      >
                        {copied === "stripe-pub" ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  <Button className="w-full">Salvar Chaves Stripe</Button>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-900">
                    <p className="font-semibold mb-1">⚠️ Segurança</p>
                    <p>Nunca compartilhe sua Secret Key com ninguém. Use apenas em ambiente seguro.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SENDGRID SETUP */}
          <TabsContent value="sendgrid" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurar SendGrid</CardTitle>
                <CardDescription>
                  Siga os passos abaixo para obter sua chave de API do SendGrid
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* PASSO 1 */}
                <div className="border-l-4 border-primary pl-4">
                  <h3 className="font-semibold mb-2">Passo 1: Criar Conta SendGrid</h3>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground mb-4">
                    <li>Acesse <a href="https://app.sendgrid.com/signup" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1 inline-flex">https://app.sendgrid.com/signup <ExternalLink className="w-4 h-4" /></a></li>
                    <li>Preencha seus dados (email, nome, empresa)</li>
                    <li>Confirme seu email</li>
                    <li>Configure seu perfil</li>
                  </ol>
                </div>

                {/* PASSO 2 */}
                <div className="border-l-4 border-primary pl-4">
                  <h3 className="font-semibold mb-2">Passo 2: Gerar Chave de API</h3>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground mb-4">
                    <li>No Dashboard SendGrid, clique em <strong>Settings</strong> (menu esquerdo)</li>
                    <li>Clique em <strong>API Keys</strong></li>
                    <li>Clique em <strong>Create API Key</strong></li>
                    <li>Escolha <strong>Full Access</strong> ou <strong>Restricted Access</strong></li>
                    <li>Copie a chave gerada (começa com SG.)</li>
                  </ol>
                </div>

                {/* PASSO 3 */}
                <div className="border-l-4 border-primary pl-4">
                  <h3 className="font-semibold mb-2">Passo 3: Verificar Domínio (Opcional)</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Para aumentar a entregabilidade de emails, verifique seu domínio:
                  </p>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground mb-4">
                    <li>Em <strong>Settings → Sender Authentication</strong></li>
                    <li>Clique em <strong>Verify a Domain</strong></li>
                    <li>Siga as instruções para adicionar registros DNS</li>
                  </ol>
                </div>

                {/* FORMULÁRIO */}
                <div className="bg-muted p-4 rounded-lg space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">SendGrid API Key</label>
                    <div className="flex gap-2">
                      <Input
                        type="password"
                        placeholder="SG...."
                        value={sendgridKey}
                        onChange={(e) => setSendgridKey(e.target.value)}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(sendgridKey, "sendgrid-key")}
                      >
                        {copied === "sendgrid-key" ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Email de Origem</label>
                    <Input
                      type="email"
                      placeholder="noreply@seudominio.com"
                      defaultValue={user?.email || ""}
                    />
                  </div>

                  <Button className="w-full">Salvar Chave SendGrid</Button>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-green-900">
                    <p className="font-semibold mb-1">✓ Plano Gratuito</p>
                    <p>SendGrid oferece 100 emails/dia gratuitamente. Ótimo para começar!</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* STATUS DAS INTEGRAÇÕES */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Status das Integrações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="font-medium">Stripe</span>
                <span className="text-sm text-muted-foreground">Não configurado</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="font-medium">SendGrid</span>
                <span className="text-sm text-muted-foreground">Não configurado</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
