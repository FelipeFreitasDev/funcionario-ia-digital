import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { Loader2, CheckCircle, AlertCircle, Copy } from "lucide-react";

/**
 * Creative Studio Test Page
 * Página interativa para testar endpoints de geração de IA e persistência de histórico
 */

export default function CreativeStudioTest() {
  // Image generation state
  const [imagePrompt, setImagePrompt] = useState("A serene landscape with mountains");
  const [imageStyle, setImageStyle] = useState("moderno");
  const [imageQuality, setImageQuality] = useState("high");
  const [imageWidth, setImageWidth] = useState("1024");
  const [imageHeight, setImageHeight] = useState("768");

  // Video generation state
  const [videoPrompt, setVideoPrompt] = useState("A robot walking through a city");
  const [videoDuration, setVideoDuration] = useState("30");

  // Loading states
  const [imageLoading, setImageLoading] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);

  // Results
  const [imageResult, setImageResult] = useState<any>(null);
  const [videoResult, setVideoResult] = useState<any>(null);
  const [generationsList, setGenerationsList] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);

  // tRPC queries and mutations
  const generateImageMutation = trpc.creative.generateImage.useMutation();
  const generateVideoMutation = trpc.creative.generateVideo.useMutation();
  const createGenerationMutation = trpc.generations.create.useMutation();
  const listGenerationsQuery = trpc.generations.list.useQuery({ limit: 10 });
  const statsQuery = trpc.generations.getStats.useQuery();

  // Handle image generation
  const handleGenerateImage = async () => {
    setImageLoading(true);
    try {
      const result = await generateImageMutation.mutateAsync({
        prompt: imagePrompt,
        style: imageStyle as any,
        quality: imageQuality as any,
        width: parseInt(imageWidth),
        height: parseInt(imageHeight),
        useCache: true,
      });

      setImageResult(result);

      // Save to database
      if ((result as any).url) {
        await createGenerationMutation.mutateAsync({
          type: "image",
          prompt: imagePrompt,
          style: imageStyle,
          provider: (result as any).provider || "huggingface",
          quality: imageQuality,
          width: parseInt(imageWidth),
          height: parseInt(imageHeight),
          url: (result as any).url,
          fromCache: (result as any).fromCache,
        });

        // Refresh list
        listGenerationsQuery.refetch();
        statsQuery.refetch();
      }
    } catch (error) {
      console.error("Error generating image:", error);
      setImageResult({ error: error instanceof Error ? error.message : "Erro ao gerar imagem" });
    } finally {
      setImageLoading(false);
    }
  };

  // Handle video generation
  const handleGenerateVideo = async () => {
    setVideoLoading(true);
    try {
      const result = await generateVideoMutation.mutateAsync({
        prompt: videoPrompt,
        duration: parseInt(videoDuration) as any,
        style: "moderno",
      });

      setVideoResult(result);

      // Save to database
      if ((result as any).url) {
        await createGenerationMutation.mutateAsync({
          type: "video",
          prompt: videoPrompt,
          style: "moderno",
          provider: (result as any).provider || "replicate",
          duration: parseInt(videoDuration),
          url: (result as any).url,
        });

        // Refresh list
        listGenerationsQuery.refetch();
        statsQuery.refetch();
      }
    } catch (error) {
      console.error("Error generating video:", error);
      setVideoResult({ error: error instanceof Error ? error.message : "Erro ao gerar vídeo" });
    } finally {
      setVideoLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Creative Studio Test</h1>
          <p className="text-muted-foreground">
            Teste os endpoints de geração de IA e persistência de histórico
          </p>
        </div>

        {/* Main tabs */}
        <Tabs defaultValue="generate" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="generate">Gerar</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
            <TabsTrigger value="stats">Estatísticas</TabsTrigger>
          </TabsList>

          {/* Generate tab */}
          <TabsContent value="generate" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Image generation */}
              <Card>
                <CardHeader>
                  <CardTitle>Gerar Imagem</CardTitle>
                  <CardDescription>Teste a geração de imagens com IA</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Prompt</label>
                    <Textarea
                      value={imagePrompt}
                      onChange={(e) => setImagePrompt(e.target.value)}
                      placeholder="Descreva a imagem que deseja gerar..."
                      className="mt-2"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Estilo</label>
                      <select
                        value={imageStyle}
                        onChange={(e) => setImageStyle(e.target.value)}
                        className="w-full mt-2 px-3 py-2 border border-border rounded-md bg-background"
                      >
                        <option value="moderno">Moderno</option>
                        <option value="minimalista">Minimalista</option>
                        <option value="fotografico">Fotográfico</option>
                        <option value="ilustracao">Ilustração</option>
                        <option value="3d">3D</option>
                        <option value="anime">Anime</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Qualidade</label>
                      <select
                        value={imageQuality}
                        onChange={(e) => setImageQuality(e.target.value)}
                        className="w-full mt-2 px-3 py-2 border border-border rounded-md bg-background"
                      >
                        <option value="low">Baixa</option>
                        <option value="medium">Média</option>
                        <option value="high">Alta</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Largura</label>
                      <Input
                        type="number"
                        value={imageWidth}
                        onChange={(e) => setImageWidth(e.target.value)}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Altura</label>
                      <Input
                        type="number"
                        value={imageHeight}
                        onChange={(e) => setImageHeight(e.target.value)}
                        className="mt-2"
                      />
                    </div>
                  </div>

                  <Button
                    onClick={handleGenerateImage}
                    disabled={imageLoading}
                    className="w-full"
                  >
                    {imageLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Gerando...
                      </>
                    ) : (
                      "Gerar Imagem"
                    )}
                  </Button>

                  {/* Result */}
                  {imageResult && (
                    <div className="mt-4 p-4 border border-border rounded-lg">
                      {imageResult.error ? (
                        <div className="flex items-start gap-2 text-red-500">
                          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                          <p className="text-sm">{imageResult.error}</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-green-500">
                            <CheckCircle className="w-5 h-5" />
                            <span className="text-sm font-medium">Sucesso!</span>
                          </div>
                          {(imageResult as any).url && (
                            <div className="space-y-2">
                              <img
                                src={(imageResult as any).url}
                                alt="Generated"
                                className="w-full rounded-lg max-h-64 object-cover"
                              />
                              <div className="flex items-center gap-2 p-2 bg-muted rounded text-xs">
                                <code className="flex-1 truncate">{(imageResult as any).url}</code>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => navigator.clipboard.writeText((imageResult as any).url)}
                                >
                                  <Copy className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          )}
                          {(imageResult as any).fromCache && (
                            <p className="text-xs text-muted-foreground">✓ Do cache</p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Video generation */}
              <Card>
                <CardHeader>
                  <CardTitle>Gerar Vídeo</CardTitle>
                  <CardDescription>Teste a geração de vídeos com IA</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Prompt</label>
                    <Textarea
                      value={videoPrompt}
                      onChange={(e) => setVideoPrompt(e.target.value)}
                      placeholder="Descreva o vídeo que deseja gerar..."
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Duração (segundos)</label>
                    <select
                      value={videoDuration}
                      onChange={(e) => setVideoDuration(e.target.value)}
                      className="w-full mt-2 px-3 py-2 border border-border rounded-md bg-background"
                    >
                      <option value="15">15 segundos</option>
                      <option value="30">30 segundos</option>
                      <option value="60">60 segundos</option>
                    </select>
                  </div>

                  <Button
                    onClick={handleGenerateVideo}
                    disabled={videoLoading}
                    className="w-full"
                  >
                    {videoLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Gerando...
                      </>
                    ) : (
                      "Gerar Vídeo"
                    )}
                  </Button>

                  {/* Result */}
                  {videoResult && (
                    <div className="mt-4 p-4 border border-border rounded-lg">
                      {videoResult.error ? (
                        <div className="flex items-start gap-2 text-red-500">
                          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                          <p className="text-sm">{videoResult.error}</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-green-500">
                            <CheckCircle className="w-5 h-5" />
                            <span className="text-sm font-medium">Sucesso!</span>
                          </div>
                          {(videoResult as any).url && (
                            <div className="flex items-center gap-2 p-2 bg-muted rounded text-xs">
                              <code className="flex-1 truncate">{(videoResult as any).url}</code>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => navigator.clipboard.writeText((videoResult as any).url)}
                              >
                                <Copy className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* History tab */}
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Gerações</CardTitle>
                <CardDescription>Todas as imagens e vídeos que você gerou</CardDescription>
              </CardHeader>
              <CardContent>
                {listGenerationsQuery.isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin" />
                  </div>
                ) : listGenerationsQuery.data?.data && listGenerationsQuery.data.data.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {listGenerationsQuery.data.data.map((gen: any) => (
                      <div key={gen.id} className="border border-border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded">
                            {gen.type}
                          </span>
                          {gen.fromCache && (
                            <span className="text-xs font-medium bg-green-500/10 text-green-500 px-2 py-1 rounded">
                              Cache
                            </span>
                          )}
                        </div>
                        <p className="text-sm line-clamp-2 mb-2">{gen.prompt}</p>
                        <p className="text-xs text-muted-foreground mb-2">
                          Estilo: {gen.style} | Provider: {gen.provider}
                        </p>
                        {gen.url && gen.type === "image" && (
                          <img
                            src={gen.url}
                            alt={gen.prompt}
                            className="w-full rounded mb-2 max-h-32 object-cover"
                          />
                        )}
                        <p className="text-xs text-muted-foreground">
                          {new Date(gen.createdAt).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    Nenhuma geração ainda. Comece gerando uma imagem ou vídeo!
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Stats tab */}
          <TabsContent value="stats">
            <Card>
              <CardHeader>
                <CardTitle>Estatísticas</CardTitle>
                <CardDescription>Suas estatísticas de geração de IA</CardDescription>
              </CardHeader>
              <CardContent>
                {statsQuery.isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin" />
                  </div>
                ) : statsQuery.data?.data ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="p-4 border border-border rounded-lg">
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="text-3xl font-bold">{statsQuery.data.data.total}</p>
                    </div>
                    <div className="p-4 border border-border rounded-lg">
                      <p className="text-sm text-muted-foreground">Imagens</p>
                      <p className="text-3xl font-bold">{statsQuery.data.data.images}</p>
                    </div>
                    <div className="p-4 border border-border rounded-lg">
                      <p className="text-sm text-muted-foreground">Vídeos</p>
                      <p className="text-3xl font-bold">{statsQuery.data.data.videos}</p>
                    </div>
                    <div className="p-4 border border-border rounded-lg">
                      <p className="text-sm text-muted-foreground">Completas</p>
                      <p className="text-3xl font-bold">{statsQuery.data.data.completed}</p>
                    </div>
                    <div className="p-4 border border-border rounded-lg">
                      <p className="text-sm text-muted-foreground">Do Cache</p>
                      <p className="text-3xl font-bold">{statsQuery.data.data.fromCache}</p>
                    </div>
                    <div className="p-4 border border-border rounded-lg">
                      <p className="text-sm text-muted-foreground">Tempo Médio</p>
                      <p className="text-3xl font-bold">{statsQuery.data.data.avgProcessingTime}ms</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    Nenhuma estatística disponível
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
