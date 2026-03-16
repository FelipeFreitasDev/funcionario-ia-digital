/**
 * Analytics Service - Collect and query metrics
 */

import { randomBytes } from "crypto";

export interface AnalyticsMetric {
  id: string;
  userId: number;
  date: Date;
  platform: "shopee" | "mercadolivre" | "amazon" | "all";
  metric: string;
  value: number;
  metadata?: Record<string, any>;
  createdAt: Date;
}

/**
 * Gerar ID único para métrica
 */
export function generateMetricId(): string {
  return `METRIC-${Date.now()}-${randomBytes(4).toString("hex")}`;
}

/**
 * Coletar métrica de venda
 */
export async function recordSaleMetric(
  userId: number,
  platform: "shopee" | "mercadolivre" | "amazon",
  amount: number,
  metadata?: Record<string, any>
): Promise<AnalyticsMetric> {
  const id = generateMetricId();
  const now = new Date();

  return {
    id,
    userId,
    date: now,
    platform,
    metric: "sales_amount",
    value: amount,
    metadata,
    createdAt: now,
  };
}

/**
 * Coletar métrica de geração
 */
export async function recordGenerationMetric(
  userId: number,
  style: string,
  type: "image" | "video"
): Promise<AnalyticsMetric> {
  const id = generateMetricId();
  const now = new Date();

  return {
    id,
    userId,
    date: now,
    platform: "all",
    metric: `generation_${type}_${style}`,
    value: 1,
    createdAt: now,
  };
}

/**
 * Obter estatísticas de vendas por período
 */
export async function getSalesStats(
  userId: number,
  platform: "shopee" | "mercadolivre" | "amazon" | "all",
  period: "day" | "week" | "month" | "year"
): Promise<{
  total: number;
  average: number;
  byDay?: Record<string, number>;
  byPlatform?: Record<string, number>;
}> {
  // Simulado - em produção, consultar banco de dados
  const baseValue = Math.floor(Math.random() * 10000) + 1000;

  return {
    total: baseValue,
    average: baseValue / 30,
    byDay: {
      "2026-03-16": baseValue * 0.3,
      "2026-03-15": baseValue * 0.25,
      "2026-03-14": baseValue * 0.45,
    },
    byPlatform: {
      shopee: baseValue * 0.4,
      mercadolivre: baseValue * 0.35,
      amazon: baseValue * 0.25,
    },
  };
}

/**
 * Obter gerações mais populares
 */
export async function getPopularGenerations(
  userId: number,
  limit: number = 10
): Promise<Array<{ style: string; type: string; count: number }>> {
  const styles = ["moderno", "minimalista", "fotografico", "ilustracao", "3d", "anime"];
  const types = ["image", "video"];

  return Array.from({ length: Math.min(limit, styles.length * types.length) }, (_, i) => ({
    style: styles[i % styles.length],
    type: types[i % types.length] as "image" | "video",
    count: Math.floor(Math.random() * 100) + 10,
  })).sort((a, b) => b.count - a.count);
}

/**
 * Obter ROI por plataforma
 */
export async function getRoiByPlatform(
  userId: number,
  period: "month" | "year"
): Promise<Record<string, { revenue: number; cost: number; roi: number }>> {
  return {
    shopee: {
      revenue: 5000,
      cost: 500,
      roi: 900,
    },
    mercadolivre: {
      revenue: 4500,
      cost: 450,
      roi: 900,
    },
    amazon: {
      revenue: 3500,
      cost: 350,
      roi: 900,
    },
  };
}

/**
 * Obter tendências de vendas
 */
export async function getSalesTrends(
  userId: number,
  days: number = 30
): Promise<Array<{ date: string; sales: number; orders: number }>> {
  return Array.from({ length: days }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - i - 1));

    return {
      date: date.toISOString().split("T")[0],
      sales: Math.floor(Math.random() * 500) + 100,
      orders: Math.floor(Math.random() * 20) + 5,
    };
  });
}

/**
 * Obter resumo de analytics
 */
export async function getAnalyticsSummary(userId: number) {
  return {
    totalSales: 12500,
    totalOrders: 250,
    averageOrderValue: 50,
    conversionRate: 3.2,
    topPlatform: "shopee",
    topStyle: "moderno",
    generationsThisMonth: 450,
    favoriteGenerations: 125,
  };
}

/**
 * Exportar dados para CSV
 */
export function generateAnalyticsCSV(
  data: Array<Record<string, any>>
): string {
  if (data.length === 0) {
    return "";
  }

  const headers = Object.keys(data[0]);
  const rows = data.map((row) => headers.map((header) => row[header]).join(","));

  return [headers.join(","), ...rows].join("\n");
}

/**
 * Calcular métrica de crescimento
 */
export function calculateGrowth(
  current: number,
  previous: number
): { percentage: number; trend: "up" | "down" | "stable" } {
  if (previous === 0) {
    return { percentage: 100, trend: "up" };
  }

  const percentage = ((current - previous) / previous) * 100;
  const trend = percentage > 5 ? "up" : percentage < -5 ? "down" : "stable";

  return { percentage: Math.round(percentage * 100) / 100, trend };
}
