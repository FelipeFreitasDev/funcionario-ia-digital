import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Facebook,
  Instagram,
  MessageCircle,
  Send,
  TrendingUp,
  Calendar,
  Settings,
  Plus,
  MoreVertical,
  Heart,
  MessageSquare,
  Share2,
  Eye,
  Zap,
  BarChart3,
  LogOut,
} from "lucide-react";

interface SocialAccount {
  id: string;
  platform: "facebook" | "instagram" | "whatsapp" | "telegram" | "tiktok" | "linkedin" | "twitter" | "youtube";
  name: string;
  followers: number;
  connected: boolean;
  icon: React.ReactNode;
}

interface Post {
  id: string;
  content: string;
  scheduledFor?: string;
  platforms: string[];
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    views: number;
  };
}

export default function Dashboard() {
  const { user, logout, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<"overview" | "posts" | "schedule" | "analytics">("overview");
  const [socialAccounts] = useState<SocialAccount[]>([
    {
      id: "1",
      platform: "facebook",
      name: "Minha Página",
      followers: 15420,
      connected: true,
      icon: <Facebook className="w-6 h-6" />,
    },
    {
      id: "2",
      platform: "instagram",
      name: "@meu_perfil",
      followers: 8320,
      connected: true,
      icon: <Instagram className="w-6 h-6" />,
    },
    {
      id: "3",
      platform: "whatsapp",
      name: "WhatsApp Business",
      followers: 0,
      connected: false,
      icon: <MessageCircle className="w-6 h-6" />,
    },
    {
      id: "4",
      platform: "telegram",
      name: "Meu Canal",
      followers: 3200,
      connected: true,
      icon: <Send className="w-6 h-6" />,
    },
    {
      id: "5",
      platform: "tiktok",
      name: "@meu_tiktok",
      followers: 12500,
      connected: true,
      icon: <Zap className="w-6 h-6" />,
    },
    {
      id: "6",
      platform: "linkedin",
      name: "Meu Perfil",
      followers: 4200,
      connected: false,
      icon: <BarChart3 className="w-6 h-6" />,
    },
  ]);

  const [recentPosts] = useState<Post[]>([
    {
      id: "1",
      content: "Novo conteúdo incrível chegando! 🚀",
      scheduledFor: "2026-03-15 14:00",
      platforms: ["facebook", "instagram"],
      engagement: { likes: 245, comments: 32, shares: 18, views: 2450 },
    },
    {
      id: "2",
      content: "Confira nossas dicas de produtividade 💡",
      platforms: ["linkedin", "twitter"],
      engagement: { likes: 128, comments: 45, shares: 62, views: 1820 },
    },
  ]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Funcionário Digital</h1>
            <p className="text-blue-100 mt-1">Gerenciador Inteligente de Redes Sociais</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <Settings className="w-4 h-4 mr-2" />
              Configurações
            </Button>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-semibold">{user?.name || "Usuário"}</p>
                <p className="text-xs text-blue-100">{user?.email}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">
                {user?.name?.[0] || "U"}
              </div>
            </div>
            <Button
              variant="ghost"
              className="text-white hover:bg-white/10"
              onClick={() => logout()}
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-slate-800/50 p-2 rounded-lg w-fit">
          {[
            { id: "overview", label: "Visão Geral", icon: Eye },
            { id: "posts", label: "Criar Post", icon: Plus },
            { id: "schedule", label: "Agendador", icon: Calendar },
            { id: "analytics", label: "Analytics", icon: BarChart3 },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white"
                    : "text-slate-400 hover:text-white hover:bg-slate-700/50"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Connected Accounts */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white">Contas Conectadas</h2>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Conectar Rede Social
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {socialAccounts.map((account) => (
                  <Card
                    key={account.id}
                    className="bg-slate-800 border-slate-700 p-4 hover:border-blue-500 transition cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-blue-400">{account.icon}</div>
                      {account.connected ? (
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-xs text-green-400">Conectado</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <span className="text-xs text-red-400">Desconectado</span>
                        </div>
                      )}
                    </div>
                    <h3 className="text-white font-semibold">{account.name}</h3>
                    <p className="text-slate-400 text-sm">
                      {account.followers > 0 ? `${account.followers.toLocaleString()} seguidores` : "Desconectado"}
                    </p>
                    {!account.connected && (
                      <Button className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white text-xs py-1">
                        Conectar
                      </Button>
                    )}
                  </Card>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: "Total de Seguidores", value: "43,640", icon: <Eye className="w-5 h-5" /> },
                { label: "Posts Este Mês", value: "24", icon: <Calendar className="w-5 h-5" /> },
                { label: "Engajamento Médio", value: "4.2%", icon: <TrendingUp className="w-5 h-5" /> },
                { label: "Alcance Total", value: "156.2K", icon: <Share2 className="w-5 h-5" /> },
              ].map((stat, idx) => (
                <Card key={idx} className="bg-gradient-to-br from-slate-800 to-slate-700 border-slate-600 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">{stat.label}</p>
                      <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                    </div>
                    <div className="text-blue-400">{stat.icon}</div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Recent Posts */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Posts Recentes</h2>
              <div className="space-y-3">
                {recentPosts.map((post) => (
                  <Card key={post.id} className="bg-slate-800 border-slate-700 p-4 hover:border-blue-500 transition">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-white">{post.content}</p>
                        <div className="flex gap-2 mt-2 flex-wrap">
                          {post.platforms.map((platform) => (
                            <span
                              key={platform}
                              className="text-xs bg-blue-600/20 text-blue-300 px-2 py-1 rounded"
                            >
                              {platform}
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-4 mt-3 text-slate-400 text-sm">
                          <span className="flex items-center gap-1">
                            <Heart className="w-4 h-4" /> {post.engagement.likes}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="w-4 h-4" /> {post.engagement.comments}
                          </span>
                          <span className="flex items-center gap-1">
                            <Share2 className="w-4 h-4" /> {post.engagement.shares}
                          </span>
                        </div>
                      </div>
                      <button className="text-slate-400 hover:text-white">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Posts Tab */}
        {activeTab === "posts" && (
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Criar Novo Post</h2>
            </div>
            <div className="space-y-4">
              <textarea
                placeholder="Escreva seu conteúdo aqui... Use #hashtags e @menções"
                className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg p-4 focus:outline-none focus:border-blue-500 min-h-32 placeholder-slate-500"
              />
              <div className="flex gap-2 flex-wrap">
                {socialAccounts
                  .filter((a) => a.connected)
                  .map((account) => (
                    <button
                      key={account.id}
                      className="px-3 py-2 bg-blue-600/20 text-blue-300 rounded-lg hover:bg-blue-600/30 transition flex items-center gap-2 text-sm"
                    >
                      {account.icon}
                      {account.platform}
                    </button>
                  ))}
              </div>
              <div className="flex gap-2">
                <Button className="bg-green-600 hover:bg-green-700 text-white">Publicar Agora</Button>
                <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                  Agendar
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Schedule Tab */}
        {activeTab === "schedule" && (
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Calendário de Posts</h2>
            <div className="grid grid-cols-7 gap-2 mb-4">
              {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"].map((day) => (
                <div key={day} className="text-center text-slate-400 font-semibold py-2">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 35 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square bg-slate-700 rounded-lg p-2 hover:bg-slate-600 transition cursor-pointer flex items-center justify-center text-slate-400 text-sm font-semibold"
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: "Impressões", value: "156.2K", change: "+12.5%" },
                { label: "Cliques", value: "12.4K", change: "+8.3%" },
                { label: "Conversões", value: "324", change: "+5.2%" },
              ].map((metric, idx) => (
                <Card key={idx} className="bg-slate-800 border-slate-700 p-4">
                  <p className="text-slate-400 text-sm">{metric.label}</p>
                  <div className="flex items-end justify-between mt-2">
                    <p className="text-3xl font-bold text-white">{metric.value}</p>
                    <p className="text-green-400 text-sm font-semibold">{metric.change}</p>
                  </div>
                </Card>
              ))}
            </div>
            <Card className="bg-slate-800 border-slate-700 p-6">
              <h3 className="text-white font-semibold mb-4">Engajamento por Rede Social</h3>
              <div className="space-y-3">
                {socialAccounts
                  .filter((a) => a.connected)
                  .map((account) => (
                    <div key={account.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {account.icon}
                        <span className="text-white">{account.name}</span>
                      </div>
                      <div className="w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                          style={{ width: `${Math.random() * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
