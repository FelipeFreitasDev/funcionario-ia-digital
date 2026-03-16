import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ShoppingCart,
  Search,
  TrendingUp,
  Package,
  DollarSign,
  Eye,
} from "lucide-react";

export default function EcommerceHub() {
  const [activeTab, setActiveTab] = useState<"search" | "products" | "sales">(
    "search"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [sales, setSales] = useState<any[]>([]);

  const handleSearchProducts = () => {
    if (!searchQuery) return;

    // Simular busca de produtos campeões
    const mockProducts = [
      {
        id: 1,
        name: "Fone Bluetooth Sem Fio",
        price: 89.9,
        platform: "Shopee",
        sales: 1250,
        rating: 4.8,
        image: "https://via.placeholder.com/150?text=Fone",
      },
      {
        id: 2,
        name: "Carregador Rápido USB-C",
        price: 45.9,
        platform: "Mercado Livre",
        sales: 890,
        rating: 4.7,
        image: "https://via.placeholder.com/150?text=Carregador",
      },
      {
        id: 3,
        name: "Suporte para Celular",
        price: 29.9,
        platform: "Shopee",
        sales: 2100,
        rating: 4.9,
        image: "https://via.placeholder.com/150?text=Suporte",
      },
      {
        id: 4,
        name: "Cabo USB Trançado",
        price: 19.9,
        platform: "Amazon",
        sales: 3400,
        rating: 4.6,
        image: "https://via.placeholder.com/150?text=Cabo",
      },
    ];

    setProducts(mockProducts);
  };

  const handlePublishProduct = (product: any) => {
    const newSale = {
      ...product,
      publishedDate: new Date().toLocaleDateString(),
      status: "Publicado",
      views: Math.floor(Math.random() * 5000),
    };
    setSales([newSale, ...sales]);
    alert(`✅ Produto "${product.name}" publicado com sucesso!`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
            <ShoppingCart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">E-commerce Hub</h1>
            <p className="text-sm text-muted-foreground">
              Shopee • Mercado Livre • Amazon
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab("search")}
          className={`px-4 py-2 font-medium border-b-2 transition ${
            activeTab === "search"
              ? "border-blue-500 text-blue-500"
              : "border-transparent text-muted-foreground"
          }`}
        >
          🔍 Pesquisar Produtos
        </button>
        <button
          onClick={() => setActiveTab("products")}
          className={`px-4 py-2 font-medium border-b-2 transition ${
            activeTab === "products"
              ? "border-blue-500 text-blue-500"
              : "border-transparent text-muted-foreground"
          }`}
        >
          📦 Meus Produtos ({sales.length})
        </button>
        <button
          onClick={() => setActiveTab("sales")}
          className={`px-4 py-2 font-medium border-b-2 transition ${
            activeTab === "sales"
              ? "border-blue-500 text-blue-500"
              : "border-transparent text-muted-foreground"
          }`}
        >
          💰 Vendas
        </button>
      </div>

      {/* Pesquisar Produtos */}
      {activeTab === "search" && (
        <div className="space-y-4">
          <Card className="p-6">
            <h2 className="text-lg font-bold mb-4">
              Encontrar Produtos Campeões
            </h2>
            <div className="flex gap-2">
              <Input
                placeholder="Ex: Fone Bluetooth, Carregador, Suporte..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearchProducts()}
              />
              <Button
                onClick={handleSearchProducts}
                className="bg-blue-500 hover:bg-blue-600"
              >
                <Search className="w-4 h-4 mr-2" />
                Pesquisar
              </Button>
            </div>
          </Card>

          {products.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {products.map((product) => (
                <Card key={product.id} className="overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-bold text-sm mb-2">{product.name}</h3>
                    <div className="space-y-2 text-sm mb-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Preço:</span>
                        <span className="font-bold">R$ {product.price}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Vendas:</span>
                        <span className="font-bold">{product.sales}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Rating:</span>
                        <span className="font-bold">⭐ {product.rating}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Plataforma:</span>
                        <span className="font-bold text-blue-500">
                          {product.platform}
                        </span>
                      </div>
                    </div>
                    <Button
                      onClick={() => handlePublishProduct(product)}
                      className="w-full bg-green-500 hover:bg-green-600 text-white"
                      size="sm"
                    >
                      Publicar na Minha Loja
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Meus Produtos */}
      {activeTab === "products" && (
        <div className="space-y-4">
          {sales.length === 0 ? (
            <Card className="p-8 text-center">
              <Package className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">
                Nenhum produto publicado ainda
              </p>
            </Card>
          ) : (
            sales.map((product) => (
              <Card key={product.id} className="p-4">
                <div className="flex gap-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-20 h-20 rounded object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold">{product.name}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Preço:</span>
                        <p className="font-bold">R$ {product.price}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Plataforma:</span>
                        <p className="font-bold text-blue-500">
                          {product.platform}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Status:</span>
                        <p className="font-bold text-green-500">
                          {product.status}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Visualizações:</span>
                        <p className="font-bold">{product.views}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Vendas */}
      {activeTab === "sales" && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total de Vendas</p>
                <p className="text-2xl font-bold">
                  {sales.reduce((acc, p) => acc + p.sales, 0)}
                </p>
              </div>
              <ShoppingCart className="w-8 h-8 text-blue-500" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Faturamento</p>
                <p className="text-2xl font-bold">
                  R${" "}
                  {(
                    sales.reduce((acc, p) => acc + p.price * p.sales, 0) / 100
                  ).toFixed(0)}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Visualizações</p>
                <p className="text-2xl font-bold">
                  {sales.reduce((acc, p) => acc + p.views, 0)}
                </p>
              </div>
              <Eye className="w-8 h-8 text-purple-500" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Taxa Conversão</p>
                <p className="text-2xl font-bold">
                  {sales.length > 0
                    ? (
                        (sales.reduce((acc, p) => acc + p.sales, 0) /
                          sales.reduce((acc, p) => acc + p.views, 0)) *
                        100
                      ).toFixed(1)
                    : 0}
                  %
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-500" />
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
