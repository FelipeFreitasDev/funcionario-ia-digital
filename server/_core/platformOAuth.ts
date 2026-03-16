/**
 * Platform OAuth Service
 * Gerencia autenticação OAuth com Shopee, Mercado Livre e Amazon
 */

export interface PlatformCredentials {
  platform: "shopee" | "mercadolivre" | "amazon";
  accessToken: string;
  refreshToken?: string;
  expiresAt?: Date;
  userId: number;
  platformUserId: string;
  platformUsername: string;
  connectedAt: Date;
  lastSyncAt?: Date;
}

export interface OAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  authorizationUrl: string;
  tokenUrl: string;
  apiBaseUrl: string;
}

/**
 * Configurações OAuth para cada plataforma
 */
const OAUTH_CONFIGS: Record<string, OAuthConfig> = {
  shopee: {
    clientId: process.env.SHOPEE_CLIENT_ID || "",
    clientSecret: process.env.SHOPEE_CLIENT_SECRET || "",
    redirectUri: `${process.env.VITE_FRONTEND_URL || "http://localhost:3000"}/auth/shopee/callback`,
    authorizationUrl: "https://partner.shopeemobile.com/api/v2/oauth/authorize",
    tokenUrl: "https://partner.shopeemobile.com/api/v2/oauth/token",
    apiBaseUrl: "https://partner.shopeemobile.com/api/v2",
  },
  mercadolivre: {
    clientId: process.env.MERCADOLIVRE_CLIENT_ID || "",
    clientSecret: process.env.MERCADOLIVRE_CLIENT_SECRET || "",
    redirectUri: `${process.env.VITE_FRONTEND_URL || "http://localhost:3000"}/auth/mercadolivre/callback`,
    authorizationUrl: "https://auth.mercadolibre.com.br/authorization",
    tokenUrl: "https://api.mercadolibre.com/oauth/token",
    apiBaseUrl: "https://api.mercadolibre.com",
  },
  amazon: {
    clientId: process.env.AMAZON_CLIENT_ID || "",
    clientSecret: process.env.AMAZON_CLIENT_SECRET || "",
    redirectUri: `${process.env.VITE_FRONTEND_URL || "http://localhost:3000"}/auth/amazon/callback`,
    authorizationUrl: "https://sellercentral.amazon.com/apps/authorize",
    tokenUrl: "https://api.amazon.com/auth/o2/token",
    apiBaseUrl: "https://sellingpartnerapi-na.amazon.com",
  },
};

/**
 * Gerar URL de autorização
 */
export function getAuthorizationUrl(
  platform: "shopee" | "mercadolivre" | "amazon",
  state: string
): string {
  const config = OAUTH_CONFIGS[platform];
  if (!config.clientId) {
    throw new Error(`OAuth não configurado para ${platform}`);
  }

  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: "code",
    state,
    scope: getPlatformScopes(platform),
  });

  return `${config.authorizationUrl}?${params.toString()}`;
}

/**
 * Obter escopos necessários para cada plataforma
 */
function getPlatformScopes(platform: string): string {
  switch (platform) {
    case "shopee":
      return "product.basic_read product.full_read order.read";
    case "mercadolivre":
      return "read write";
    case "amazon":
      return "selling:orders:read selling:inventory:read";
    default:
      return "";
  }
}

/**
 * Trocar código por token de acesso
 */
export async function exchangeCodeForToken(
  platform: "shopee" | "mercadolivre" | "amazon",
  code: string
): Promise<{
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
  platformUserId: string;
  platformUsername: string;
}> {
  const config = OAUTH_CONFIGS[platform];

  try {
    const response = await fetch(config.tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        client_id: config.clientId,
        client_secret: config.clientSecret,
        redirect_uri: config.redirectUri,
      }).toString(),
    });

    if (!response.ok) {
      throw new Error(`OAuth token exchange failed: ${response.statusText}`);
    }

    const data = await response.json();

    // Obter informações do usuário
    const userInfo = await getPlatformUserInfo(platform, data.access_token);

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token || undefined,
      expiresIn: data.expires_in || 3600,
      platformUserId: userInfo.id,
      platformUsername: userInfo.username || userInfo.name || "unknown",
    };
  } catch (error) {
    console.error(`[OAuth] Erro ao trocar código por token (${platform}):`, error);
    throw error;
  }
}

/**
 * Obter informações do usuário na plataforma
 */
async function getPlatformUserInfo(
  platform: string,
  accessToken: string
): Promise<{ id: string; username?: string; name?: string }> {
  const config = OAUTH_CONFIGS[platform];

  try {
    let endpoint = "";
    switch (platform) {
      case "shopee":
        endpoint = `${config.apiBaseUrl}/shop/get_shop_info`;
        break;
      case "mercadolivre":
        endpoint = `${config.apiBaseUrl}/users/me`;
        break;
      case "amazon":
        endpoint = `${config.apiBaseUrl}/sellers/v1/account/marketplaceParticipations`;
        break;
    }

    const response = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get user info: ${response.statusText}`);
    }

    const data = await response.json();

    // Extrair informações conforme a plataforma
    switch (platform) {
      case "shopee":
        return { id: data.data.shop_id, username: data.data.shop_name };
      case "mercadolivre":
        return { id: data.id, username: data.nickname };
      case "amazon":
        return { id: data.payload[0].marketplace_id, username: data.payload[0].marketplace_id };
      default:
        return { id: "unknown", username: "unknown" };
    }
  } catch (error) {
    console.error(`[OAuth] Erro ao obter informações do usuário (${platform}):`, error);
    throw error;
  }
}

/**
 * Renovar token de acesso
 */
export async function refreshAccessToken(
  platform: "shopee" | "mercadolivre" | "amazon",
  refreshToken: string
): Promise<{
  accessToken: string;
  expiresIn: number;
}> {
  const config = OAUTH_CONFIGS[platform];

  try {
    const response = await fetch(config.tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: config.clientId,
        client_secret: config.clientSecret,
      }).toString(),
    });

    if (!response.ok) {
      throw new Error(`Token refresh failed: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      accessToken: data.access_token,
      expiresIn: data.expires_in || 3600,
    };
  } catch (error) {
    console.error(`[OAuth] Erro ao renovar token (${platform}):`, error);
    throw error;
  }
}

/**
 * Validar se token está expirado
 */
export function isTokenExpired(expiresAt?: Date): boolean {
  if (!expiresAt) return false;
  return new Date() >= new Date(expiresAt.getTime() - 5 * 60 * 1000); // 5 minutos antes
}

/**
 * Obter token válido (renovar se necessário)
 */
export async function getValidToken(
  credentials: PlatformCredentials
): Promise<string> {
  if (isTokenExpired(credentials.expiresAt) && credentials.refreshToken) {
    try {
      const { accessToken, expiresIn } = await refreshAccessToken(
        credentials.platform,
        credentials.refreshToken
      );

      // Aqui você deveria atualizar no banco de dados
      credentials.accessToken = accessToken;
      credentials.expiresAt = new Date(Date.now() + expiresIn * 1000);

      return accessToken;
    } catch (error) {
      console.error("[OAuth] Erro ao renovar token:", error);
      throw error;
    }
  }

  return credentials.accessToken;
}
