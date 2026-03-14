# Configuração do Webhook Kiwify

Este guia explica como configurar o webhook da Kiwify para processar automaticamente as compras do Funcionário Digital.

## 📋 Visão Geral

O webhook da Kiwify envia notificações de pagamento para nosso servidor, que processa automaticamente:
- ✅ Aprovação de pagamento
- ✅ Geração de token de download
- ✅ Envio de email de confirmação
- ✅ Notificação ao proprietário

## 🔧 Configuração no Dashboard Kiwify

### Passo 1: Acessar Configurações de Webhook

1. Acesse o [Dashboard Kiwify](https://app.kiwify.com.br)
2. Clique em **Configurações** → **Webhooks**
3. Clique em **Adicionar Webhook**

### Passo 2: Configurar URL do Webhook

**URL do Webhook:**
```
https://funciaia-sdysrify.manus.space/api/webhooks/kiwify
```

**Método:** POST

**Eventos para Ativar:**
- ✅ Pedido Aprovado
- ✅ Pedido Pendente
- ✅ Pedido Falhou
- ✅ Pedido Reembolsado
- ✅ Chargeback

### Passo 3: Obter Secret do Webhook

1. Após criar o webhook, Kiwify exibirá um **Secret**
2. Copie este valor
3. Adicione como variável de ambiente no servidor:

```bash
KIWIFY_WEBHOOK_SECRET=seu_secret_aqui
```

### Passo 4: Testar o Webhook

Kiwify fornece um botão "Enviar Teste" no dashboard. Clique para enviar um webhook de teste.

Você deve receber uma resposta `200 OK` com:
```json
{
  "success": true,
  "purchaseId": "PURCHASE-...",
  "message": "Webhook processado com sucesso"
}
```

## 🔐 Segurança

### Validação de Assinatura

Cada webhook inclui um header `X-Kiwify-Signature` que contém um HMAC-SHA256 da requisição.

O servidor valida automaticamente:
```typescript
// Validação implementada em server/_core/kiwifyWebhook.ts
const isValid = validateKiwifyWebhook(payload, signature, secret);
```

**Nunca processe um webhook sem validar a assinatura!**

## 📧 Emails Automáticos

Após processar o webhook, o sistema envia:

### 1. Email de Confirmação ao Cliente
- ✅ Confirmação de compra
- ✅ Link de download
- ✅ Guia de instalação
- ✅ Contato de suporte

### 2. Notificação ao Proprietário
- ✅ Nova compra aprovada
- ✅ Dados do cliente
- ✅ Valor da compra
- ✅ Data/hora

## 🧪 Teste com Endpoint de Teste

Para testar sem usar a Kiwify, use o endpoint de teste:

```bash
curl -X POST https://funciaia-sdysrify.manus.space/api/webhooks/test \
  -H "Content-Type: application/json" \
  -d '{
    "email": "cliente@example.com",
    "name": "João Silva",
    "amount": 299.90,
    "status": "approved"
  }'
```

Resposta esperada:
```json
{
  "success": true,
  "purchase": {
    "id": "PURCHASE-...",
    "email": "cliente@example.com",
    "status": "approved",
    "downloadToken": "..."
  },
  "downloadToken": "...",
  "message": "Compra de teste criada com sucesso"
}
```

## 📊 Fluxo de Processamento

```
1. Cliente realiza pagamento na Kiwify
                ↓
2. Kiwify envia webhook para /api/webhooks/kiwify
                ↓
3. Servidor valida assinatura do webhook
                ↓
4. Servidor processa pagamento (cria/atualiza compra)
                ↓
5. Servidor envia email de confirmação
                ↓
6. Cliente recebe link de download
                ↓
7. Cliente baixa executável
```

## 🔍 Monitoramento

### Health Check

Verifique se o webhook está funcionando:
```bash
curl https://funciaia-sdysrify.manus.space/api/webhooks/health
```

Resposta esperada:
```json
{
  "status": "ok",
  "timestamp": "2026-03-14T23:35:00.000Z"
}
```

### Logs

Os webhooks são registrados em:
- **Servidor:** Logs da aplicação (stdout)
- **Database:** Tabela `purchases` com todos os eventos

## 🚨 Troubleshooting

### "Assinatura inválida"
- Verifique se `KIWIFY_WEBHOOK_SECRET` está correto
- Confirme que o secret foi copiado completamente (sem espaços)
- Regenere o secret no dashboard Kiwify se necessário

### "Webhook não recebido"
- Verifique se a URL está correta
- Teste com `curl` manualmente
- Verifique firewall/proxy
- Confirme que o servidor está rodando

### "Email não enviado"
- Emails estão em modo simulado por padrão
- Para ativar emails reais, configure:
  ```
  SMTP_HOST=seu_smtp_host
  SMTP_PORT=587
  SMTP_USER=seu_email
  SMTP_PASS=sua_senha
  SMTP_FROM=noreply@funcionariodigital.com
  ```

## 📝 Variáveis de Ambiente Necessárias

```bash
# Kiwify
KIWIFY_WEBHOOK_SECRET=seu_secret_aqui

# Email (opcional, para ativar envio real)
SMTP_HOST=smtp.seuservidor.com
SMTP_PORT=587
SMTP_USER=seu_email@example.com
SMTP_PASS=sua_senha
SMTP_FROM=noreply@funcionariodigital.com
SMTP_SECURE=true

# Notificações
OWNER_EMAIL=seu_email@example.com
FRONTEND_URL=https://funciaia-sdysrify.manus.space
```

## 📞 Suporte

Se tiver dúvidas sobre a configuração:
- Documentação Kiwify: https://docs.kiwify.com.br
- Email: suporte@funcionariodigital.com
- Dashboard: https://funciaia-sdysrify.manus.space
