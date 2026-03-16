import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Copy, Eye, EyeOff, Save } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

export default function Settings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"vapid" | "notifications" | "platforms">("vapid");
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Queries and mutations
  const settingsQuery = trpc.settings.getSettings.useQuery();
  const updateSettingsMutation = trpc.settings.updateSettings.useMutation();
  const notificationPrefsQuery = trpc.settings.getNotificationPreferences.useQuery();
  const updateNotificationPrefsMutation = trpc.settings.updateNotificationPreferences.useMutation();
  const platformsQuery = trpc.settings.getAllPlatforms.useQuery();
  const savePlatformCredsMutation = trpc.settings.savePlatformCredentials.useMutation();

  const [vapidForm, setVapidForm] = useState({
    publicKey: settingsQuery.data?.data?.vapidPublicKey || "",
    privateKey: settingsQuery.data?.data?.vapidPrivateKey || "",
  });

  const [platformForm, setPlatformForm] = useState({
    platform: "shopee" as "shopee" | "mercadolivre" | "amazon",
    clientId: "",
    clientSecret: "",
  });

  const handleSaveVAPID = async () => {
    setIsSaving(true);
    try {
      const result = await updateSettingsMutation.mutateAsync({
        vapidPublicKey: vapidForm.publicKey,
        vapidPrivateKey: vapidForm.privateKey,
      });

      if (result.success) {
        setMessage({ type: "success", text: "VAPID keys saved successfully!" });
        await settingsQuery.refetch();
      } else {
        setMessage({ type: "error", text: result.error || "Failed to save VAPID keys" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Error saving VAPID keys" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePlatformCreds = async () => {
    setIsSaving(true);
    try {
      const result = await savePlatformCredsMutation.mutateAsync(platformForm);

      if (result.success) {
        setMessage({ type: "success", text: `${platformForm.platform} credentials saved!` });
        setPlatformForm({ platform: "shopee", clientId: "", clientSecret: "" });
        await platformsQuery.refetch();
      } else {
        setMessage({ type: "error", text: result.error || "Failed to save credentials" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Error saving credentials" });
    } finally {
      setIsSaving(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setMessage({ type: "success", text: "Copied to clipboard!" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Configurações</h1>
          <p className="text-slate-300">Gerencie suas credenciais e preferências</p>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              message.type === "success"
                ? "bg-green-900/30 border border-green-700 text-green-300"
                : "bg-red-900/30 border border-red-700 text-red-300"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            {message.text}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-slate-700">
          {[
            { id: "vapid", label: "VAPID Keys (Web Push)" },
            { id: "notifications", label: "Notificações" },
            { id: "platforms", label: "Plataformas" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 px-4 font-semibold transition-colors ${
                activeTab === tab.id
                  ? "text-cyan-400 border-b-2 border-cyan-400"
                  : "text-slate-400 hover:text-slate-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* VAPID Keys Tab */}
        {activeTab === "vapid" && (
          <Card className="bg-slate-800 border-slate-700 p-8">
            <h2 className="text-2xl font-bold text-white mb-4">Web Push - VAPID Keys</h2>
            <p className="text-slate-300 mb-6">
              Configure suas chaves VAPID para ativar notificações push. Gere as chaves em:
              <a
                href="https://web-push-codelab.glitch.me/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:underline ml-1"
              >
                Web Push Codelab
              </a>
            </p>

            <div className="space-y-6">
              {/* Public Key */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">Chave Pública</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={vapidForm.publicKey}
                    onChange={(e) => setVapidForm({ ...vapidForm, publicKey: e.target.value })}
                    placeholder="Colar chave pública aqui..."
                    className="flex-1 bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                  />
                  {vapidForm.publicKey && (
                    <Button
                      onClick={() => copyToClipboard(vapidForm.publicKey)}
                      variant="outline"
                      size="sm"
                      className="border-slate-600"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Private Key */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">Chave Privada</label>
                <div className="flex gap-2">
                  <input
                    type={showPrivateKey ? "text" : "password"}
                    value={vapidForm.privateKey}
                    onChange={(e) => setVapidForm({ ...vapidForm, privateKey: e.target.value })}
                    placeholder="Colar chave privada aqui..."
                    className="flex-1 bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                  />
                  <Button
                    onClick={() => setShowPrivateKey(!showPrivateKey)}
                    variant="outline"
                    size="sm"
                    className="border-slate-600"
                  >
                    {showPrivateKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <Button
                onClick={handleSaveVAPID}
                disabled={isSaving || !vapidForm.publicKey || !vapidForm.privateKey}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? "Salvando..." : "Salvar VAPID Keys"}
              </Button>
            </div>
          </Card>
        )}

        {/* Notifications Tab */}
        {activeTab === "notifications" && (
          <Card className="bg-slate-800 border-slate-700 p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Preferências de Notificação</h2>
            <p className="text-slate-300 mb-6">Escolha quais eventos você deseja ser notificado</p>

            <div className="space-y-4">
              {[
                { key: "newOrder", label: "Novo Pedido" },
                { key: "orderStatusChange", label: "Mudança de Status do Pedido" },
                { key: "publicationCompleted", label: "Publicação Concluída" },
                { key: "lowStockAlert", label: "Alerta de Estoque Baixo" },
                { key: "syncError", label: "Erro de Sincronização" },
                { key: "recommendation", label: "Recomendações" },
              ].map((pref) => (
                <label key={pref.key} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked={true}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-white">{pref.label}</span>
                </label>
              ))}
            </div>

            <Button className="w-full mt-6 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white">
              <Save className="w-4 h-4 mr-2" />
              Salvar Preferências
            </Button>
          </Card>
        )}

        {/* Platforms Tab */}
        {activeTab === "platforms" && (
          <div className="space-y-6">
            <Card className="bg-slate-800 border-slate-700 p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Credenciais de Plataformas</h2>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Plataforma</label>
                  <select
                    value={platformForm.platform}
                    onChange={(e) =>
                      setPlatformForm({ ...platformForm, platform: e.target.value as any })
                    }
                    className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="shopee">Shopee</option>
                    <option value="mercadolivre">Mercado Livre</option>
                    <option value="amazon">Amazon</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Client ID</label>
                  <input
                    type="text"
                    value={platformForm.clientId}
                    onChange={(e) => setPlatformForm({ ...platformForm, clientId: e.target.value })}
                    placeholder="Cole seu Client ID aqui..."
                    className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Client Secret</label>
                  <input
                    type="password"
                    value={platformForm.clientSecret}
                    onChange={(e) =>
                      setPlatformForm({ ...platformForm, clientSecret: e.target.value })
                    }
                    placeholder="Cole seu Client Secret aqui..."
                    className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <Button
                  onClick={handleSavePlatformCreds}
                  disabled={isSaving || !platformForm.clientId || !platformForm.clientSecret}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? "Salvando..." : "Salvar Credenciais"}
                </Button>
              </div>
            </Card>

            {/* Connected Platforms */}
            {platformsQuery.data?.data && platformsQuery.data.data.length > 0 && (
              <Card className="bg-slate-800 border-slate-700 p-8">
                <h3 className="text-xl font-bold text-white mb-4">Plataformas Conectadas</h3>
                <div className="space-y-3">
                  {platformsQuery.data.data.map((platform: any) => (
                    <div
                      key={platform.platform}
                      className="flex items-center justify-between p-3 bg-slate-700 rounded"
                    >
                      <div>
                        <p className="text-white font-semibold capitalize">{platform.platform}</p>
                        <p className="text-slate-400 text-sm">
                          Conectado em {new Date(platform.createdAt).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                      <div className="w-3 h-3 bg-green-500 rounded-full" />
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
