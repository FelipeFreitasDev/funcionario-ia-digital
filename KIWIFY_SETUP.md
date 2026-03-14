# 🔗 Configuração de Integração com Kiwify

Este guia explica como configurar a integração com Kiwify para processar pagamentos do Funcionário Digital.

## 1. Pré-requisitos

- Conta ativa em [Kiwify](https://kiwify.com.br)
- Seu produto/curso criado no dashboard Kiwify
- Acesso às chaves de API da Kiwify

## 2. Obter Dados da Kiwify

### 2.1 Link de Checkout
1. Acesse [dashboard.kiwify.com.br](https://dashboard.kiwify.com.br)
2. Vá para "Meus Produtos"
3. Clique no seu produto
4. Copie o **Link de Checkout** (exemplo: `https://kiwify.com.br/seu-usuario/seu-produto`)

### 2.2 ID do Produto
1. No mesmo produto, procure por **Product ID** ou **ID do Produto**
2. Copie este ID

### 2.3 Chave de API
1. Vá para **Configurações** → **API**
2. Gere uma nova chave de API se não tiver uma
3. Copie a chave

## 3. Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto com:

```env
# Kiwify Configuration
REACT_APP_KIWIFY_CHECKOUT_URL=https://kiwify.com.br/seu-usuario/seu-produto
REACT_APP_KIWIFY_PRODUCT_ID=seu-product-id
REACT_APP_KIWIFY_API_KEY=sua-api-key
REACT_APP_KIWIFY_WEBHOOK_URL=https://seu-dominio.com/api/webhooks/kiwify
```

## 4. Atualizar Configuração Frontend

Edite `client/src/config/kiwify.ts` e atualize os valores padrão:

```typescript
export const KIWIFY_CONFIG = {
  CHECKOUT_URL: "https://kiwify.com.br/seu-usuario/seu-produto",
  PRODUCT_ID: "seu-product-id",
  API_KEY: "sua-api-key",
  WEBHOOK_URL: "https://seu-dominio.com/api/webhooks/kiwify",
  PRICE_CENTS: 29990, // R$ 299,90
  ORIGINAL_PRICE_CENTS: 349990, // R$ 3.499,90
  DISCOUNT_PERCENTAGE: 91,
};
```

## 5. Configurar Webhook (Backend)

### 5.1 URL do Webhook
Na Kiwify, configure o webhook para apontar para:
```
https://seu-dominio.com/api/webhooks/kiwify
```

### 5.2 Eventos a Monitorar
Ative os seguintes eventos:
- ✅ `purchase.approved` - Pagamento aprovado
- ✅ `purchase.completed` - Compra completada
- ✅ `purchase.refunded` - Reembolso processado

### 5.3 Implementar Endpoint Backend

Crie um endpoint em seu backend (`server/index.ts` ou similar):

```typescript
import express from "express";

const app = express();

// Webhook da Kiwify
app.post("/api/webhooks/kiwify", express.json(), async (req, res) => {
  try {
    const { event, data } = req.body;

    if (event === "purchase.approved" || event === "purchase.completed") {
      const { customer_email, id: transaction_id } = data;

      // 1. Verificar assinatura do webhook (segurança)
      // const isValid = verifyKiwifySignature(req);
      // if (!isValid) return res.status(401).json({ error: "Invalid signature" });

      // 2. Salvar no banco de dados
      // await savePurchase({
      //   email: customer_email,
      //   transaction_id,
      //   status: "approved",
      //   timestamp: new Date(),
      // });

      // 3. Enviar email de confirmação com link de download
      // await sendDownloadEmail(customer_email, transaction_id);

      res.json({ success: true });
    } else if (event === "purchase.refunded") {
      // Processar reembolso
      res.json({ success: true });
    } else {
      res.json({ success: true }); // Ignorar outros eventos
    }
  } catch (error) {
    console.error("Erro no webhook:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint para verificar status de pagamento
app.post("/api/webhooks/kiwify/verify", express.json(), async (req, res) => {
  try {
    const { transaction_id } = req.body;

    // Verificar no banco de dados se o pagamento foi aprovado
    // const purchase = await getPurchase(transaction_id);

    // if (purchase && purchase.status === "approved") {
    //   return res.json({ verified: true });
    // }

    res.json({ verified: false });
  } catch (error) {
    console.error("Erro ao verificar pagamento:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint para gerar link de download
app.post("/api/downloads/generate-link", express.json(), async (req, res) => {
  try {
    const { email, transaction_id } = req.body;

    // 1. Verificar se pagamento foi aprovado
    // const purchase = await getPurchase(transaction_id);
    // if (!purchase || purchase.status !== "approved") {
    //   return res.status(403).json({ error: "Payment not verified" });
    // }

    // 2. Gerar token temporário (válido por 24 horas)
    // const token = generateToken(email, transaction_id, 24 * 60 * 60);

    // 3. Retornar link de download
    // const downloadUrl = `https://seu-dominio.com/download?token=${token}`;

    res.json({
      download_url: "https://seu-dominio.com/download?token=...",
    });
  } catch (error) {
    console.error("Erro ao gerar link:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
```

## 6. Testar Integração

### 6.1 Modo Teste da Kiwify
1. Acesse o dashboard Kiwify
2. Ative "Modo Teste"
3. Use cartão de teste: `4111 1111 1111 1111`

### 6.2 Testar Fluxo Completo
1. Acesse `/checkout`
2. Clique em "Desbloquear Acesso Agora"
3. Você será redirecionado para Kiwify
4. Complete o pagamento com dados de teste
5. Verifique se o webhook foi acionado
6. Acesse `/download` com os parâmetros de verificação

## 7. Segurança

### 7.1 Verificar Assinatura do Webhook
Sempre verifique a assinatura do webhook para garantir que é da Kiwify:

```typescript
import crypto from "crypto";

function verifyKiwifySignature(req: any): boolean {
  const signature = req.headers["x-kiwify-signature"];
  const body = JSON.stringify(req.body);
  const secret = process.env.KIWIFY_API_KEY || "";

  const hash = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");

  return hash === signature;
}
```

### 7.2 Validar Email e Transação
Sempre valide email e ID de transação antes de liberar downloads.

### 7.3 Usar HTTPS
Certifique-se de que seu domínio usa HTTPS para comunicação segura.

## 8. Troubleshooting

### Webhook não está sendo chamado
- Verifique se a URL está correta e acessível
- Verifique logs do webhook no dashboard Kiwify
- Certifique-se de que o servidor está rodando

### Pagamento não é verificado
- Verifique se o banco de dados está salvando as compras
- Verifique se o email está correto
- Verifique logs do backend

### Link de download não funciona
- Verifique se o token é válido
- Verifique se o arquivo existe no servidor
- Verifique permissões de arquivo

## 9. Próximos Passos

1. ✅ Configurar variáveis de ambiente
2. ✅ Implementar webhook backend
3. ✅ Testar em modo teste
4. ✅ Ativar modo produção na Kiwify
5. ✅ Monitorar transações

## 📚 Referências

- [Documentação Kiwify](https://docs.kiwify.com.br)
- [API Kiwify](https://api.kiwify.com.br/docs)
- [Webhooks Kiwify](https://docs.kiwify.com.br/webhooks)

---

**Desenvolvido com IA e ❤️**
© 2026 Funcionário Digital. Todos os direitos reservados.
