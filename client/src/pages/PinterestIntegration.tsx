import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Pin, Calendar, BarChart3, Link2 } from "lucide-react";

export default function PinterestIntegration() {
  const [pins, setPins] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [boardUrl, setBoardUrl] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  const handleConnectPinterest = () => {
    // Simular conexão com Pinterest OAuth
    setIsConnected(true);
    alert("✅ Pinterest conectado com sucesso!");
  };

  const handleCreatePin = () => {
    if (!title || !description || !imageUrl || !boardUrl) {
      alert("⚠️ Preencha todos os campos");
      return;
    }

    const newPin = {
      id: Date.now(),
      title,
      description,
      imageUrl,
      boardUrl,
      scheduledDate: scheduledDate || new Date().toISOString(),
      status: scheduledDate ? "Agendado" : "Publicado",
      engagement: Math.floor(Math.random() * 500),
      saves: Math.floor(Math.random() * 200),
    };

    setPins([newPin, ...pins]);
    setTitle("");
    setDescription("");
    setImageUrl("");
    setBoardUrl("");
    setScheduledDate("");
    alert("✅ Pin criado com sucesso!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
            <Pin className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Pinterest</h1>
            <p className="text-sm text-muted-foreground">
              {isConnected ? "✅ Conectado" : "❌ Desconectado"}
            </p>
          </div>
        </div>
        {!isConnected && (
          <Button
            onClick={handleConnectPinterest}
            className="bg-red-500 hover:bg-red-600"
          >
            Conectar Pinterest
          </Button>
        )}
      </div>

      {isConnected && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Criar Pin */}
          <Card className="lg:col-span-1 p-6">
            <h2 className="text-lg font-bold mb-4">Criar Novo Pin</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Título</label>
                <Input
                  placeholder="Título do pin"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Descrição</label>
                <Textarea
                  placeholder="Descrição do pin"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                />
              </div>
              <div>
                <label className="text-sm font-medium">URL da Imagem</label>
                <Input
                  placeholder="https://..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">URL do Board</label>
                <Input
                  placeholder="https://pinterest.com/..."
                  value={boardUrl}
                  onChange={(e) => setBoardUrl(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Agendar (opcional)</label>
                <Input
                  type="datetime-local"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                />
              </div>
              <Button
                onClick={handleCreatePin}
                className="w-full bg-red-500 hover:bg-red-600"
              >
                Criar Pin
              </Button>
            </div>
          </Card>

          {/* Pins Criados */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-bold">Seus Pins</h2>
            {pins.length === 0 ? (
              <Card className="p-8 text-center">
                <Pin className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">Nenhum pin criado ainda</p>
              </Card>
            ) : (
              pins.map((pin) => (
                <Card key={pin.id} className="p-4">
                  <div className="flex gap-4">
                    <img
                      src={pin.imageUrl}
                      alt={pin.title}
                      className="w-24 h-24 rounded object-cover"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://via.placeholder.com/100?text=Pin";
                      }}
                    />
                    <div className="flex-1">
                      <h3 className="font-bold">{pin.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {pin.description.substring(0, 100)}...
                      </p>
                      <div className="flex gap-4 text-sm">
                        <span className="flex items-center gap-1">
                          <BarChart3 className="w-4 h-4" />
                          {pin.engagement} engajamentos
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {pin.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
