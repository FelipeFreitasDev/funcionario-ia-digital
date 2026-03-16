import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Store,
  Plus,
  Edit2,
  Trash2,
  DollarSign,
  Package,
  Settings,
  Link2,
} from "lucide-react";

export default function OnlineStore() {
  const [activeTab, setActiveTab] = useState<"produtos" | "vendas" | "config">(
    "produtos"
  );
  const [products, setProducts] = useState<any[]>([
    {
      id: 1,
      name: "eBook: Marketing Digital 2024",
      description: "Guia completo sobre marketing digital",
      price: 49.9,
      type: "digital",
      format: "PDF",
      sales: 45,
      revenue: 2245.5,
      image: "https://via.placeholder.com/200?text=eBook",
    },
    {
      id: 2,
      name: "Curso: Python para Iniciantes",
      description: "Aprenda Python do zero",
      price: 99.9,
      type: "digital",
      format: "Vídeo + PDF",
      sales: 28,
      revenue: 2797.2,
      image: "https://via.placeholder.com/200?text=Curso",
    },
  ]);

  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    type: "digital",
    format: "PDF",
  });

  const [showForm, setShowForm] = useState(false);

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price) {
      alert("⚠️ Preencha todos os campos");
      return;
    }

    const product = {
      id: Date.now(),
      ...newProduct,
      price: parseFloat(newProduct.price),
      sales: 0,
      revenue: 0,
      image: "https://via.placeholder.com/200?text=Produto",
    };

    setProducts([product, ...products]);
    setNewProduct({ name: "", description: "", price: "", type: "digital", format: "PDF" });
    setShowForm(false);
    alert("✅ Produto adicionado com sucesso!");
  };

  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter((p) => p.id !== id));
    alert("✅ Produto removido!");
  };

  const totalRevenue = products.reduce((sum, p) => sum + p.revenue, 0);
  const totalSales = products.reduce((sum, p) => sum + p.sales, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
            <Store className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Minha Loja Online</h1>
            <p className="text-sm text-muted-foreground">
              Venda produtos digitais integrado com Kiwify
            </p>
          </div>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-500 hover:bg-green-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Produto
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab("produtos")}
          className={`px-4 py-2 font-medium border-b-2 transition flex items-center gap-2 ${
            activeTab === "produtos"
              ? "border-green-500 text-green-500"
              : "border-transparent text-muted-foreground"
          }`}
        >
          <Package className="w-4 h-4" />
          Produtos ({products.length})
        </button>
        <button
          onClick={() => setActiveTab("vendas")}
          className={`px-4 py-2 font-medium border-b-2 transition flex items-center gap-2 ${
            activeTab === "vendas"
              ? "border-green-500 text-green-500"
              : "border-transparent text-muted-foreground"
          }`}
        >
          <DollarSign className="w-4 h-4" />
          Vendas
        </button>
        <button
          onClick={() => setActiveTab("config")}
          className={`px-4 py-2 font-medium border-b-2 transition flex items-center gap-2 ${
            activeTab === "config"
              ? "border-green-500 text-green-500"
              : "border-transparent text-muted-foreground"
          }`}
        >
          <Settings className="w-4 h-4" />
          Configurações
        </button>
      </div>

      {/* Formulário de Novo Produto */}
      {showForm && activeTab === "produtos" && (
        <Card className="p-6">
          <h2 className="text-lg font-bold mb-4">Adicionar Novo Produto</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Nome do Produto</label>
              <Input
                placeholder="Ex: eBook Marketing Digital"
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, name: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium">Preço (R$)</label>
              <Input
                type="number"
                placeholder="49.90"
                value={newProduct.price}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, price: e.target.value })
                }
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium">Descrição</label>
              <Textarea
                placeholder="Descreva seu produto..."
                value={newProduct.description}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, description: e.target.value })
                }
                rows={3}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Tipo</label>
              <select
                value={newProduct.type}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, type: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
              >
                <option value="digital">Digital</option>
                <option value="fisico">Físico</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Formato</label>
              <select
                value={newProduct.format}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, format: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
              >
                <option value="PDF">PDF</option>
                <option value="Vídeo">Vídeo</option>
                <option value="Áudio">Áudio</option>
                <option value="Software">Software</option>
                <option value="Curso">Curso Online</option>
              </select>
            </div>
            <div className="md:col-span-2 flex gap-2">
              <Button
                onClick={handleAddProduct}
                className="flex-1 bg-green-500 hover:bg-green-600"
              >
                Adicionar Produto
              </Button>
              <Button
                onClick={() => setShowForm(false)}
                variant="outline"
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Produtos */}
      {activeTab === "produtos" && (
        <div className="space-y-4">
          {products.length === 0 ? (
            <Card className="p-8 text-center">
              <Package className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">Nenhum produto adicionado</p>
            </Card>
          ) : (
            products.map((product) => (
              <Card key={product.id} className="p-4">
                <div className="flex gap-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-24 h-24 rounded object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{product.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {product.description}
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                      <div>
                        <span className="text-muted-foreground">Preço:</span>
                        <p className="font-bold">R$ {product.price.toFixed(2)}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Tipo:</span>
                        <p className="font-bold">{product.type}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Vendas:</span>
                        <p className="font-bold">{product.sales}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Faturamento:</span>
                        <p className="font-bold">
                          R$ {product.revenue.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Edit2 className="w-4 h-4 mr-1" />
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-500"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Remover
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Vendas */}
      {activeTab === "vendas" && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Total de Vendas</p>
            <p className="text-3xl font-bold">{totalSales}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Faturamento Total</p>
            <p className="text-3xl font-bold">R$ {totalRevenue.toFixed(2)}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Ticket Médio</p>
            <p className="text-3xl font-bold">
              R$ {totalSales > 0 ? (totalRevenue / totalSales).toFixed(2) : "0.00"}
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Produtos Ativos</p>
            <p className="text-3xl font-bold">{products.length}</p>
          </Card>

          <Card className="md:col-span-4 p-6">
            <h3 className="font-bold mb-4">Produtos Mais Vendidos</h3>
            <div className="space-y-2">
              {products
                .sort((a, b) => b.sales - a.sales)
                .slice(0, 5)
                .map((product) => (
                  <div key={product.id} className="flex justify-between items-center p-2 border rounded">
                    <span className="font-medium">{product.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {product.sales} vendas
                    </span>
                  </div>
                ))}
            </div>
          </Card>
        </div>
      )}

      {/* Configurações */}
      {activeTab === "config" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="font-bold mb-4">Integração Kiwify</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">ID da Loja Kiwify</label>
                <Input placeholder="Seu ID Kiwify" />
              </div>
              <div>
                <label className="text-sm font-medium">Chave de API</label>
                <Input placeholder="Sua chave de API" type="password" />
              </div>
              <Button className="w-full bg-green-500 hover:bg-green-600">
                Conectar Kiwify
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-bold mb-4">Domínio Personalizado</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">URL da Loja</label>
                <Input
                  value="https://loja.funcionariodigital.com"
                  readOnly
                  className="bg-muted"
                />
              </div>
              <div className="text-sm text-muted-foreground">
                <p>Seu domínio personalizado está ativo</p>
                <p className="mt-2">
                  <Link2 className="w-4 h-4 inline mr-1" />
                  Compartilhe seu link:
                </p>
                <a
                  href="#"
                  className="text-blue-500 hover:underline break-all"
                >
                  https://loja.funcionariodigital.com
                </a>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-bold mb-4">Configurações de Pagamento</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 border rounded">
                <span>Kiwify</span>
                <span className="text-green-500 font-bold">✓ Ativo</span>
              </div>
              <div className="flex items-center justify-between p-2 border rounded">
                <span>Stripe</span>
                <span className="text-gray-500">Desativado</span>
              </div>
              <div className="flex items-center justify-between p-2 border rounded">
                <span>PagSeguro</span>
                <span className="text-gray-500">Desativado</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-bold mb-4">Informações da Loja</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Nome da Loja</label>
                <Input placeholder="Minha Loja Digital" />
              </div>
              <div>
                <label className="text-sm font-medium">Email de Contato</label>
                <Input placeholder="contato@loja.com" />
              </div>
              <Button className="w-full bg-green-500 hover:bg-green-600">
                Salvar Configurações
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
