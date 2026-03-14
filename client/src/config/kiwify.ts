/**
 * Configuração de Integração com Kiwify
 * 
 * Para usar este arquivo:
 * 1. Crie uma conta em https://kiwify.com.br
 * 2. Configure seu produto/curso
 * 3. Substitua os valores abaixo com seus dados reais
 * 4. Ative webhooks para verificação de pagamento
 */

export const KIWIFY_CONFIG = {
  // Seu link de checkout da Kiwify
  // Exemplo: https://kiwify.com.br/seu-usuario/seu-produto
  CHECKOUT_URL: process.env.REACT_APP_KIWIFY_CHECKOUT_URL || "https://kiwify.com.br/seu-link-aqui",

  // Seu ID de produto na Kiwify (obtém no dashboard)
  PRODUCT_ID: process.env.REACT_APP_KIWIFY_PRODUCT_ID || "seu-product-id",

  // Sua chave de API da Kiwify (para webhooks)
  API_KEY: process.env.REACT_APP_KIWIFY_API_KEY || "sua-api-key",

  // URL do seu webhook (será chamado quando pagamento for confirmado)
  WEBHOOK_URL: process.env.REACT_APP_KIWIFY_WEBHOOK_URL || "https://seu-dominio.com/api/webhooks/kiwify",

  // Preço do produto em centavos (R$ 299,90 = 29990)
  PRICE_CENTS: 29990,

  // Preço original em centavos (R$ 3.499,90 = 349990)
  ORIGINAL_PRICE_CENTS: 349990,

  // Desconto percentual
  DISCOUNT_PERCENTAGE: 91,
};

/**
 * Função para redirecionar para checkout da Kiwify
 * @param email - Email do cliente (opcional)
 * @param name - Nome do cliente (opcional)
 */
export function redirectToKiwifyCheckout(email?: string, name?: string) {
  let url = KIWIFY_CONFIG.CHECKOUT_URL;

  // Adiciona parâmetros de pré-preenchimento se fornecidos
  const params = new URLSearchParams();
  if (email) params.append("email", email);
  if (name) params.append("name", name);

  if (params.toString()) {
    url += `?${params.toString()}`;
  }

  window.location.href = url;
}

/**
 * Função para verificar status de pagamento
 * Chama seu backend que verifica com a Kiwify
 */
export async function verifyPaymentStatus(transactionId: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/webhooks/kiwify/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ transaction_id: transactionId }),
    });

    if (!response.ok) {
      throw new Error("Falha ao verificar pagamento");
    }

    const data = await response.json();
    return data.verified === true;
  } catch (error) {
    console.error("Erro ao verificar pagamento:", error);
    return false;
  }
}

/**
 * Função para gerar link de download com token de acesso
 * Chama seu backend que cria um token temporário
 */
export async function generateDownloadLink(email: string, transactionId: string): Promise<string> {
  try {
    const response = await fetch(`/api/downloads/generate-link`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, transaction_id: transactionId }),
    });

    if (!response.ok) {
      throw new Error("Falha ao gerar link de download");
    }

    const data = await response.json();
    return data.download_url;
  } catch (error) {
    console.error("Erro ao gerar link de download:", error);
    throw error;
  }
}
