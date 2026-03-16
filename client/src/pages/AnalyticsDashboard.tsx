/**
 * Analytics Dashboard - Visualização de métricas de vendas e gerações
 */

import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, Download, RefreshCw } from "lucide-react";
import { trpc } from "@/lib/trpc";

const COLORS = ["#00d9ff", "#8b5cf6", "#ff006e", "#ffbe0b", "#fb5607", "#3a86ff"];

export default function AnalyticsDashboard() {
  const [period, setPeriod] = useState<"day" | "week" | "month" | "year">("month");
  const [isLoading, setIsLoading] = useState(false);

  // Queries
  const summaryQuery = trpc.analytics.getSummary.useQuery();
  const salesStatsQuery = trpc.analytics.getSalesStats.useQuery({ platform: "all", period });
  const trendsQuery = trpc.analytics.getSalesTrends.useQuery({ days: period === "day" ? 1 : period === "week" ? 7 : period === "month" ? 30 : 365 });
  const roiQuery = trpc.analytics.getRoiByPlatform.useQuery({ period: (period === "day" || period === "week" ? "month" : period) as "month" | "year" });
  const popularQuery = trpc.analytics.getPopularGenerations.useQuery({ limit: 5 });

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        summaryQuery.refetch(),
        salesStatsQuery.refetch(),
        trendsQuery.refetch(),
        roiQuery.refetch(),
        popularQuery.refetch(),
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async () => {
    const exportMutation = trpc.analytics.exportReport.useMutation();
    await exportMutation.mutateAsync({
      format: "pdf",
      period,
    });
  };

  // Dados para gráficos
  const salesByPlatform = [
    { name: "Shopee", value: (salesStatsQuery.data as any)?.data?.byPlatform?.shopee || 0 },
    { name: "Mercado Livre", value: (salesStatsQuery.data as any)?.data?.byPlatform?.mercadolivre || 0 },
    { name: "Amazon", value: (salesStatsQuery.data as any)?.data?.byPlatform?.amazon || 0 },
  ];

  const roiData = (roiQuery.data as any)?.data
    ? [
        { name: "Shopee", roi: (roiQuery.data as any)?.data?.shopee?.roi || 0 },
        { name: "Mercado Livre", roi: (roiQuery.data as any)?.data?.mercadolivre?.roi || 0 },
        { name: "Amazon", roi: (roiQuery.data as any)?.data?.amazon?.roi || 0 },
      ]
    : [];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard de Analytics</h1>
            <p className="text-muted-foreground mt-2">Visualize suas métricas de vendas e desempenho</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Atualizar
            </Button>
            <Button size="sm" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Exportar PDF
            </Button>
          </div>
        </div>

        {/* Filtro de Período */}
        <div className="mb-6">
          <Select value={period} onValueChange={(value: any) => setPeriod(value)}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Selecione o período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Hoje</SelectItem>
              <SelectItem value="week">Última Semana</SelectItem>
              <SelectItem value="month">Último Mês</SelectItem>
              <SelectItem value="year">Último Ano</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">Total de Vendas</p>
                <p className="text-3xl font-bold text-foreground mt-2">
                  R$ {((summaryQuery.data as any)?.data?.totalSales || 0).toLocaleString("pt-BR")}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
          </Card>

          <Card className="p-6">
            <div>
              <p className="text-sm text-muted-foreground">Total de Pedidos</p>
              <p className="text-3xl font-bold text-foreground mt-2">{(summaryQuery.data as any)?.data?.totalOrders || 0}</p>
            </div>
          </Card>

          <Card className="p-6">
            <div>
              <p className="text-sm text-muted-foreground">Ticket Médio</p>
              <p className="text-3xl font-bold text-foreground mt-2">
                R$ {(((summaryQuery.data as any)?.data?.totalSales || 0) / ((summaryQuery.data as any)?.data?.totalOrders || 1)).toLocaleString("pt-BR", { maximumFractionDigits: 2 })}
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <div>
              <p className="text-sm text-muted-foreground">Gerações Criadas</p>
              <p className="text-3xl font-bold text-foreground mt-2">{(summaryQuery.data as any)?.data?.generationsThisMonth || 0}</p>
            </div>
          </Card>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Vendas por Plataforma */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Vendas por Plataforma</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={salesByPlatform}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: R$ ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {salesByPlatform.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `R$ ${value}`} />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* ROI por Plataforma */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">ROI por Plataforma (%)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={roiData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="roi" fill="#00d9ff" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Tendências de Vendas */}
        <Card className="p-6 mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-4">Tendência de Vendas</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={(trendsQuery.data as any)?.data || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => `R$ ${value}`} />
              <Legend />
              <Line type="monotone" dataKey="sales" stroke="#00d9ff" strokeWidth={2} name="Vendas" />
              <Line type="monotone" dataKey="orders" stroke="#8b5cf6" strokeWidth={2} name="Pedidos" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Gerações Populares */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Gerações Mais Populares</h3>
          <div className="space-y-3">
            {(popularQuery.data as any)?.data?.map((item: any, index: number) => (
              <div key={index} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <div>
                  <p className="font-medium text-foreground">{item.style}</p>
                  <p className="text-sm text-muted-foreground">{item.count} gerações</p>
                </div>
                <div className="w-32 bg-background rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: `${(item.count / ((popularQuery.data as any)?.[0]?.count || 1)) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
