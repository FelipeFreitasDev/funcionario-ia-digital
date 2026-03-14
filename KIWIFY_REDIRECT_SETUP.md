# 🔄 Configuração de Redirecionamento Kiwify

Este guia explica como configurar o redirecionamento automático após pagamento na Kiwify para sua página de sucesso.

## 1. Acessar Dashboard Kiwify

1. Acesse [dashboard.kiwify.com.br](https://dashboard.kiwify.com.br)
2. Faça login com suas credenciais
3. Clique em **"Meus Produtos"**
4. Selecione seu produto (Funcionário Digital)

## 2. Configurar URL de Redirecionamento

### 2.1 Encontrar Configurações do Produto

1. No dashboard do produto, procure por **"Configurações"** ou **"Settings"**
2. Localize a seção **"URLs de Redirecionamento"** ou **"Redirect URLs"**

### 2.2 Adicionar URL de Sucesso

Configure as seguintes URLs:

**URL de Sucesso (após pagamento aprovado):**
```
https://seu-dominio.com/success?transaction_id={transaction_id}&email={customer_email}&status=approved
```

**URL de Cancelamento (se o cliente cancelar):**
```
https://seu-dominio.com/checkout?cancelled=true
```

**Variáveis Disponíveis da Kiwify:**
- `{transaction_id}` - ID único da transação
- `{customer_email}` - Email do cliente
- `{customer_name}` - Nome do cliente
- `{product_name}` - Nome do produto
- `{purchase_date}` - Data da compra

### 2.3 Salvar Configurações

1. Clique em **"Salvar"** ou **"Save"**
2. Aguarde a confirmação

## 3. Testar Redirecionamento

### 3.1 Modo Teste

1. Ative o **"Modo Teste"** no dashboard Kiwify
2. Copie o link de checkout de teste
3. Acesse o link e complete um pagamento com:
   - Cartão: `4111 1111 1111 1111`
   - Qualquer data futura
   - Qualquer CVV (3 dígitos)

### 3.2 Verificar Redirecionamento

Após completar o pagamento, você deve ser redirecionado para:
```
https://seu-dominio.com/success?transaction_id=xxx&email=seu-email@exemplo.com&status=approved
```

## 4. Captura de Parâmetros na Página de Sucesso

A página `/success` captura automaticamente os parâmetros da URL:

```typescript
const params = new URLSearchParams(window.location.search);
const transactionId = params.get("transaction_id");
const email = params.get("email");
const status = params.get("status");
```

## 5. Implementar Webhook (Recomendado)

Além do redirecionamento, configure um webhook para maior segurança:

### 5.1 URL do Webhook

Configure na Kiwify:
```
https://seu-dominio.com/api/webhooks/kiwify
```

### 5.2 Eventos a Monitorar

- ✅ `purchase.approved` - Pagamento aprovado
- ✅ `purchase.completed` - Compra completada
- ✅ `purchase.refunded` - Reembolso processado

### 5.3 Implementar Endpoint Backend

```typescript
app.post("/api/webhooks/kiwify", express.json(), async (req, res) => {
  try {
    const { event, data } = req.body;

    if (event === "purchase.approved" || event === "purchase.completed") {
      const { customer_email, id: transaction_id } = data;

      // Salvar no banco de dados
      await savePurchase({
        email: customer_email,
        transaction_id,
        status: "approved",
        timestamp: new Date(),
      });

      // Enviar email com link de download
      await sendDownloadEmail(customer_email, transaction_id);

      res.json({ success: true });
    }
  } catch (error) {
    console.error("Erro no webhook:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
```

## 6. Fluxo Completo de Compra

```
1. Usuário clica em "Desbloquear Acesso"
   ↓
2. Redirecionado para Kiwify
   ↓
3. Completa o pagamento
   ↓
4. Kiwify chama webhook (backend)
   ↓
5. Webhook salva dados e envia email
   ↓
6. Kiwify redireciona para /success?transaction_id=xxx&email=xxx&status=approved
   ↓
7. Página de sucesso exibe confirmação e link de download
   ↓
8. Usuário baixa o executável
```

## 7. Variáveis de Ambiente

Se usar variáveis de ambiente, configure em `.env`:

```env
KIWIFY_CHECKOUT_URL=https://pay.kiwify.com.br/seu-link
KIWIFY_SUCCESS_URL=https://seu-dominio.com/success
KIWIFY_CANCEL_URL=https://seu-dominio.com/checkout?cancelled=true
KIWIFY_WEBHOOK_URL=https://seu-dominio.com/api/webhooks/kiwify
```

## 8. Troubleshooting

### Redirecionamento não funciona
- Verifique se a URL está correta no dashboard Kiwify
- Certifique-se de que seu domínio está acessível
- Teste em modo incógnito (sem cache)

### Parâmetros não aparecem na URL
- Verifique se a Kiwify está enviando os parâmetros corretos
- Teste com modo teste primeiro
- Verifique logs do navegador (F12)

### Email não é capturado
- Verifique se o cliente preencheu o email na Kiwify
- Teste com um email real
- Verifique a variável `{customer_email}` na URL

## 9. Próximos Passos

1. ✅ Configurar URL de redirecionamento na Kiwify
2. ✅ Testar com pagamento em modo teste
3. ✅ Implementar webhook para segurança
4. ✅ Configurar envio de email automático
5. ✅ Ativar modo produção na Kiwify

## 📚 Referências

- [Documentação Kiwify - Redirecionamento](https://docs.kiwify.com.br/redirecionamento)
- [Documentação Kiwify - Webhooks](https://docs.kiwify.com.br/webhooks)
- [API Kiwify](https://api.kiwify.com.br/docs)

---

**Desenvolvido com IA e ❤️**
© 2026 Funcionário Digital. Todos os direitos reservados.
