import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Image as ImageIcon,
  Video,
  Palette,
  Download,
  Sparkles,
  Settings,
} from "lucide-react";

export default function CreativeStudio() {
  const [activeTab, setActiveTab] = useState<"images" | "videos" | "designs">(
    "images"
  );
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("moderno");
  const [generatedImages, setGeneratedImages] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateImage = async () => {
    if (!prompt) {
      alert("⚠️ Digite um prompt para gerar imagem");
      return;
    }

    setIsGenerating(true);

    // Simular geração de imagem
    setTimeout(() => {
      const newImage = {
        id: Date.now(),
        prompt,
        style,
        url: `https://via.placeholder.com/400x300?text=${encodeURIComponent(prompt)}`,
        generatedAt: new Date().toLocaleString(),
        size: "1024x768",
        format: "PNG",
      };

      setGeneratedImages([newImage, ...generatedImages]);
      setPrompt("");
      setIsGenerating(false);
      alert("✅ Imagem gerada com sucesso!");
    }, 2000);
  };

  const handleGenerateVideo = async () => {
    if (!prompt) {
      alert("⚠️ Digite um prompt para gerar vídeo");
      return;
    }

    setIsGenerating(true);

    // Simular geração de vídeo
    setTimeout(() => {
      alert("✅ Vídeo gerado com sucesso! (Simulado)");
      setPrompt("");
      setIsGenerating(false);
    }, 3000);
  };

  const downloadImage = (imageUrl: string, fileName: string) => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = fileName;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
            <Palette className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Creative Studio</h1>
            <p className="text-sm text-muted-foreground">
              Gerador de imagens, vídeos e designs com IA
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab("images")}
          className={`px-4 py-2 font-medium border-b-2 transition flex items-center gap-2 ${
            activeTab === "images"
              ? "border-purple-500 text-purple-500"
              : "border-transparent text-muted-foreground"
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          Imagens
        </button>
        <button
          onClick={() => setActiveTab("videos")}
          className={`px-4 py-2 font-medium border-b-2 transition flex items-center gap-2 ${
            activeTab === "videos"
              ? "border-purple-500 text-purple-500"
              : "border-transparent text-muted-foreground"
          }`}
        >
          <Video className="w-4 h-4" />
          Vídeos
        </button>
        <button
          onClick={() => setActiveTab("designs")}
          className={`px-4 py-2 font-medium border-b-2 transition flex items-center gap-2 ${
            activeTab === "designs"
              ? "border-purple-500 text-purple-500"
              : "border-transparent text-muted-foreground"
          }`}
        >
          <Palette className="w-4 h-4" />
          Designs
        </button>
      </div>

      {/* Gerador de Imagens */}
      {activeTab === "images" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Painel de Geração */}
          <Card className="lg:col-span-1 p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              Gerar Imagem
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Descrição</label>
                <Textarea
                  placeholder="Ex: Fone Bluetooth vermelho em fundo branco, estilo moderno..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={4}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Estilo</label>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="moderno">Moderno</option>
                  <option value="minimalista">Minimalista</option>
                  <option value="fotografico">Fotográfico</option>
                  <option value="ilustracao">Ilustração</option>
                  <option value="3d">3D</option>
                  <option value="anime">Anime</option>
                </select>
              </div>

              <Button
                onClick={handleGenerateImage}
                disabled={isGenerating}
                className="w-full bg-purple-500 hover:bg-purple-600"
              >
                {isGenerating ? "Gerando..." : "Gerar Imagem"}
              </Button>

              <div className="text-xs text-muted-foreground p-3 bg-muted rounded">
                💡 Dica: Seja específico na descrição para melhores resultados.
                Inclua cores, estilo e contexto.
              </div>
            </div>
          </Card>

          {/* Galeria de Imagens */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-bold mb-4">Suas Imagens Geradas</h2>
            {generatedImages.length === 0 ? (
              <Card className="p-8 text-center">
                <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">
                  Nenhuma imagem gerada ainda
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {generatedImages.map((image) => (
                  <Card key={image.id} className="overflow-hidden">
                    <img
                      src={image.url}
                      alt={image.prompt}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <p className="text-sm font-medium mb-2 line-clamp-2">
                        {image.prompt}
                      </p>
                      <div className="text-xs text-muted-foreground mb-3">
                        <p>Estilo: {image.style}</p>
                        <p>Gerado em: {image.generatedAt}</p>
                      </div>
                      <Button
                        onClick={() =>
                          downloadImage(image.url, `imagem-${image.id}.png`)
                        }
                        size="sm"
                        className="w-full bg-purple-500 hover:bg-purple-600"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Gerador de Vídeos */}
      {activeTab === "videos" && (
        <Card className="p-6">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Video className="w-5 h-5 text-purple-500" />
            Gerar Vídeo
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Descrição do Vídeo</label>
                <Textarea
                  placeholder="Ex: Vídeo de unboxing de fone Bluetooth com efeitos de transição..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={4}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Duração</label>
                <select className="w-full border rounded px-3 py-2">
                  <option value="15">15 segundos</option>
                  <option value="30">30 segundos</option>
                  <option value="60">1 minuto</option>
                </select>
              </div>

              <Button
                onClick={handleGenerateVideo}
                disabled={isGenerating}
                className="w-full bg-purple-500 hover:bg-purple-600"
              >
                {isGenerating ? "Gerando..." : "Gerar Vídeo"}
              </Button>
            </div>

            <div className="bg-muted rounded p-6 flex items-center justify-center">
              <div className="text-center">
                <Video className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">
                  Seus vídeos gerados aparecerão aqui
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Designer de Posts */}
      {activeTab === "designs" && (
        <Card className="p-6">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Palette className="w-5 h-5 text-purple-500" />
            Designer de Posts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                name: "Post Instagram",
                size: "1080x1080px",
                icon: "📱",
              },
              {
                name: "Post Facebook",
                size: "1200x628px",
                icon: "📘",
              },
              {
                name: "Pin Pinterest",
                size: "1000x1500px",
                icon: "📌",
              },
              {
                name: "Thumbnail YouTube",
                size: "1280x720px",
                icon: "🎬",
              },
              {
                name: "Story Instagram",
                size: "1080x1920px",
                icon: "📸",
              },
              {
                name: "Banner Twitter",
                size: "1500x500px",
                icon: "🐦",
              },
            ].map((template) => (
              <Card key={template.name} className="p-4 cursor-pointer hover:shadow-lg transition">
                <div className="text-4xl mb-2">{template.icon}</div>
                <h3 className="font-bold text-sm">{template.name}</h3>
                <p className="text-xs text-muted-foreground mb-3">
                  {template.size}
                </p>
                <Button size="sm" className="w-full bg-purple-500 hover:bg-purple-600">
                  Usar Template
                </Button>
              </Card>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
