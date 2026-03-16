import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Download, Copy, Trash2, BarChart3 } from "lucide-react";
import { trpc } from "@/lib/trpc";

/**
 * Creative Studio - Interface para geração de conteúdo com IA
 */
export default function CreativeStudioUI() {
  const [activeTab, setActiveTab] = useState("images");

  // Image generation state
  const [imagePrompt, setImagePrompt] = useState("");
  const [imageStyle, setImageStyle] = useState("moderno");
  const [imageQuality, setImageQuality] = useState("high");
  const [generatedImages, setGeneratedImages] = useState<any[]>([]);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  // Video generation state
  const [videoPrompt, setVideoPrompt] = useState("");
  const [videoDuration, setVideoDuration] = useState("15");
  const [videoStyle, setVideoStyle] = useState("moderno");
  const [generatedVideos, setGeneratedVideos] = useState<any[]>([]);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);

  // Cache stats
  const { data: cacheStats, refetch: refetchCacheStats } =
    trpc.creative.getCacheStats.useQuery();
  const clearCacheMutation = trpc.creative.clearCache.useMutation();

  // Image generation mutation
  const generateImageMutation = trpc.creative.generateImage.useMutation({
    onSuccess: (result) => {
      if (result.success) {
        setGeneratedImages([result, ...generatedImages]);
      }
      setIsGeneratingImage(false);
    },
    onError: () => {
      setIsGeneratingImage(false);
    },
  });

  // Video generation mutation
  const generateVideoMutation = trpc.creative.generateVideo.useMutation({
    onSuccess: (result) => {
      if (result.success) {
        setGeneratedVideos([result, ...generatedVideos]);
      }
      setIsGeneratingVideo(false);
    },
    onError: () => {
      setIsGeneratingVideo(false);
    },
  });

  const handleGenerateImage = async () => {
    if (!imagePrompt.trim()) return;
    setIsGeneratingImage(true);
    await generateImageMutation.mutateAsync({
      prompt: imagePrompt,
      style: imageStyle as any,
      quality: imageQuality as any,
      useCache: true,
    });
  };

  const handleGenerateVideo = async () => {
    if (!videoPrompt.trim()) return;
    setIsGeneratingVideo(true);
    await generateVideoMutation.mutateAsync({
      prompt: videoPrompt,
      duration: videoDuration as any,
      style: videoStyle as any,
    });
  };

  const handleClearCache = async () => {
    await clearCacheMutation.mutateAsync();
    refetchCacheStats();
  };

  const styles = ["moderno", "minimalista", "fotografico", "ilustracao", "3d", "anime"];
  const qualities = ["standard", "high", "ultra"];
  const durations = ["15", "30", "60"];
  const videoStyles = ["moderno", "minimalista", "cinematico", "animado", "corporativo"];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Creative Studio</h1>
          <p className="text-muted-foreground">
            Gere imagens e vídeos com IA 100% gratuita usando Hugging Face
          </p>
        </div>

        {/* Cache Stats */}
        {cacheStats && (
          <Card className="mb-6 bg-card border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg">Cache Stats</CardTitle>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleClearCache}
                  disabled={cacheStats.entries === 0}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Limpar Cache
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Imagens em Cache</p>
                  <p className="text-2xl font-bold text-foreground">{cacheStats.entries}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tamanho Máximo</p>
                  <p className="text-2xl font-bold text-foreground">{cacheStats.maxSize}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">TTL (segundos)</p>
                  <p className="text-2xl font-bold text-foreground">{cacheStats.ttl}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="images">Gerar Imagens</TabsTrigger>
            <TabsTrigger value="videos">Gerar Vídeos</TabsTrigger>
          </TabsList>

          {/* Image Generation Tab */}
          <TabsContent value="images" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Input Panel */}
              <Card className="lg:col-span-1 bg-card border-border">
                <CardHeader>
                  <CardTitle>Gerar Imagem</CardTitle>
                  <CardDescription>Descreva a imagem que deseja gerar</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">Descrição</label>
                    <Textarea
                      placeholder="Ex: Um lindo pôr do sol na praia com palmeiras..."
                      value={imagePrompt}
                      onChange={(e) => setImagePrompt(e.target.value)}
                      className="mt-2 min-h-24"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground">Estilo</label>
                    <select
                      value={imageStyle}
                      onChange={(e) => setImageStyle(e.target.value)}
                      className="w-full mt-2 px-3 py-2 border border-border rounded-md bg-background text-foreground"
                    >
                      {styles.map((style) => (
                        <option key={style} value={style}>
                          {style.charAt(0).toUpperCase() + style.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground">Qualidade</label>
                    <select
                      value={imageQuality}
                      onChange={(e) => setImageQuality(e.target.value)}
                      className="w-full mt-2 px-3 py-2 border border-border rounded-md bg-background text-foreground"
                    >
                      {qualities.map((q) => (
                        <option key={q} value={q}>
                          {q.charAt(0).toUpperCase() + q.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Button
                    onClick={handleGenerateImage}
                    disabled={!imagePrompt.trim() || isGeneratingImage}
                    className="w-full"
                  >
                    {isGeneratingImage ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Gerando...
                      </>
                    ) : (
                      "Gerar Imagem"
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Gallery Panel */}
              <div className="lg:col-span-2">
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle>Galeria de Imagens</CardTitle>
                    <CardDescription>
                      {generatedImages.length} imagem(ns) gerada(s)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {generatedImages.length === 0 ? (
                      <div className="flex items-center justify-center h-64 text-muted-foreground">
                        Nenhuma imagem gerada ainda. Comece gerando uma!
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {generatedImages.map((img, idx) => (
                          <div
                            key={idx}
                            className="border border-border rounded-lg overflow-hidden bg-muted"
                          >
                            {img.url && (
                              <div className="aspect-square bg-muted flex items-center justify-center">
                                <img
                                  src={img.url}
                                  alt={img.prompt}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src =
                                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect fill='%23333' width='400' height='400'/%3E%3Ctext x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='16' fill='%23999'%3EImagem não disponível%3C/text%3E%3C/svg%3E";
                                  }}
                                />
                              </div>
                            )}
                            <div className="p-3 space-y-2">
                              <p className="text-sm text-foreground line-clamp-2">
                                {img.prompt}
                              </p>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline" className="flex-1">
                                  <Download className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="outline" className="flex-1">
                                  <Copy className="w-4 h-4" />
                                </Button>
                              </div>
                              {img.fromCache && (
                                <p className="text-xs text-primary">✓ Do cache</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Video Generation Tab */}
          <TabsContent value="videos" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Input Panel */}
              <Card className="lg:col-span-1 bg-card border-border">
                <CardHeader>
                  <CardTitle>Gerar Vídeo</CardTitle>
                  <CardDescription>Descreva o vídeo que deseja gerar</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">Descrição</label>
                    <Textarea
                      placeholder="Ex: Um vídeo mostrando um produto sendo usado..."
                      value={videoPrompt}
                      onChange={(e) => setVideoPrompt(e.target.value)}
                      className="mt-2 min-h-24"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground">Duração</label>
                    <select
                      value={videoDuration}
                      onChange={(e) => setVideoDuration(e.target.value)}
                      className="w-full mt-2 px-3 py-2 border border-border rounded-md bg-background text-foreground"
                    >
                      {durations.map((d) => (
                        <option key={d} value={d}>
                          {d} segundos
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground">Estilo</label>
                    <select
                      value={videoStyle}
                      onChange={(e) => setVideoStyle(e.target.value)}
                      className="w-full mt-2 px-3 py-2 border border-border rounded-md bg-background text-foreground"
                    >
                      {videoStyles.map((style) => (
                        <option key={style} value={style}>
                          {style.charAt(0).toUpperCase() + style.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Button
                    onClick={handleGenerateVideo}
                    disabled={!videoPrompt.trim() || isGeneratingVideo}
                    className="w-full"
                  >
                    {isGeneratingVideo ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Gerando...
                      </>
                    ) : (
                      "Gerar Vídeo"
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Videos Panel */}
              <div className="lg:col-span-2">
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle>Vídeos Gerados</CardTitle>
                    <CardDescription>
                      {generatedVideos.length} vídeo(s) gerado(s)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {generatedVideos.length === 0 ? (
                      <div className="flex items-center justify-center h-64 text-muted-foreground">
                        Nenhum vídeo gerado ainda. Comece gerando um!
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {generatedVideos.map((video, idx) => (
                          <div
                            key={idx}
                            className="border border-border rounded-lg p-4 bg-muted"
                          >
                            <p className="text-sm text-foreground mb-2 line-clamp-2">
                              {video.prompt}
                            </p>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" className="flex-1">
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </Button>
                              <Button size="sm" variant="outline" className="flex-1">
                                Status: {video.status}
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
