# 🎫 Sistema de Suporte - Guia de Integração

Este documento explica como integrar o sistema de suporte com seu backend para capturar tickets de forma permanente.

## 1. Visão Geral

O sistema de suporte permite que usuários reportem problemas de instalação através de um formulário modal integrado na página de sucesso. O formulário coleta:

- Nome e email do usuário
- Categoria do problema (instalação, performance, compatibilidade, etc)
- Assunto e descrição detalhada
- Anexos (logs, screenshots, etc)

## 2. Fluxo de Funcionamento

```
Usuário clica em "Reportar Problema"
    ↓
Modal de Suporte abre
    ↓
Usuário preenche formulário
    ↓
Clica em "Enviar Ticket de Suporte"
    ↓
Frontend valida dados
    ↓
Envia para backend: POST /api/support/tickets
    ↓
Backend processa e salva no banco de dados
    ↓
Envia email de confirmação ao usuário
    ↓
Retorna ID do ticket único
    ↓
Frontend exibe confirmação com ID
```

## 3. Implementação no Backend

### 3.1 Estrutura de Dados

```typescript
interface SupportTicket {
  id: string; // SUPP-{timestamp}-{random}
  name: string;
  email: string;
  category: "installation" | "performance" | "compatibility" | "features" | "offline" | "other";
  subject: string;
  description: string;
  attachments: {
    filename: string;
    size: number;
    url: string; // URL do arquivo no S3/armazenamento
  }[];
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "critical";
  createdAt: Date;
  updatedAt: Date;
  responses: {
    author: string;
    message: string;
    timestamp: Date;
  }[];
}
```

### 3.2 Endpoint POST /api/support/tickets

```typescript
import express from "express";
import multer from "multer";
import nodemailer from "nodemailer";

const router = express.Router();
const upload = multer({ limits: { fileSize: 50 * 1024 * 1024 } });

router.post("/api/support/tickets", upload.array("attachments"), async (req, res) => {
  try {
    const { name, email, category, subject, description } = req.body;

    // Validar dados
    if (!name || !email || !category || !subject || !description) {
      return res.status(400).json({ error: "Dados obrigatórios faltando" });
    }

    // Gerar ID único
    const ticketId = `SUPP-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Processar anexos (upload para S3 ou armazenamento local)
    const attachments = [];
    if (req.files) {
      for (const file of req.files) {
        // Exemplo: fazer upload para S3
        const fileUrl = await uploadToS3(file);
        attachments.push({
          filename: file.originalname,
          size: file.size,
          url: fileUrl,
        });
      }
    }

    // Salvar no banco de dados
    const ticket = await SupportTicket.create({
      id: ticketId,
      name,
      email,
      category,
      subject,
      description,
      attachments,
      status: "open",
      priority: calculatePriority(category),
    });

    // Enviar email de confirmação
    await sendConfirmationEmail(email, ticketId, subject);

    // Notificar equipe de suporte
    await notifySupportTeam(ticket);

    res.json({
      success: true,
      ticketId,
      message: "Ticket criado com sucesso",
    });
  } catch (error) {
    console.error("Erro ao criar ticket:", error);
    res.status(500).json({ error: "Erro ao processar solicitação" });
  }
});

// Função auxiliar para calcular prioridade
function calculatePriority(category: string): string {
  const priorityMap = {
    installation: "high",
    offline: "high",
    performance: "medium",
    compatibility: "medium",
    features: "low",
    other: "low",
  };
  return priorityMap[category] || "low";
}

// Função para enviar email de confirmação
async function sendConfirmationEmail(email: string, ticketId: string, subject: string) {
  const transporter = nodemailer.createTransport({
    // Configurar com suas credenciais de email
  });

  const mailOptions = {
    from: "suporte@funcionariodigital.com",
    to: email,
    subject: `Ticket de Suporte Criado: ${ticketId}`,
    html: `
      <h2>Seu ticket foi criado com sucesso!</h2>
      <p><strong>ID do Ticket:</strong> ${ticketId}</p>
      <p><strong>Assunto:</strong> ${subject}</p>
      <p>Você pode acompanhar seu ticket em: https://suporte.funcionariodigital.com/tickets/${ticketId}</p>
      <p>Tempo de resposta: até 24 horas</p>
    `,
  };

  await transporter.sendMail(mailOptions);
}

// Função para notificar equipe de suporte
async function notifySupportTeam(ticket: any) {
  // Enviar notificação para equipe (Slack, Discord, email, etc)
  console.log("Novo ticket de suporte:", ticket);
}

export default router;
```

### 3.3 Endpoint GET /api/support/tickets/:id

```typescript
router.get("/api/support/tickets/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const ticket = await SupportTicket.findById(id);

    if (!ticket) {
      return res.status(404).json({ error: "Ticket não encontrado" });
    }

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar ticket" });
  }
});
```

### 3.4 Endpoint POST /api/support/tickets/:id/responses

```typescript
router.post("/api/support/tickets/:id/responses", async (req, res) => {
  try {
    const { id } = req.params;
    const { message, author } = req.body;

    const ticket = await SupportTicket.findByIdAndUpdate(
      id,
      {
        $push: {
          responses: {
            author,
            message,
            timestamp: new Date(),
          },
        },
      },
      { new: true }
    );

    // Notificar usuário sobre resposta
    await sendResponseNotificationEmail(ticket.email, id, message);

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: "Erro ao adicionar resposta" });
  }
});
```

## 4. Integração Frontend

### 4.1 Atualizar SupportForm.tsx

Substitua a função `handleSubmit` para fazer requisição real:

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!validateForm()) {
    toast.error("Por favor, preencha todos os campos corretamente");
    return;
  }

  setLoading(true);

  try {
    // Criar FormData para enviar arquivos
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("category", formData.category);
    formDataToSend.append("subject", formData.subject);
    formDataToSend.append("description", formData.description);

    // Adicionar arquivos
    formData.attachments.forEach((file) => {
      formDataToSend.append("attachments", file);
    });

    // Enviar para backend
    const response = await fetch("/api/support/tickets", {
      method: "POST",
      body: formDataToSend,
    });

    if (!response.ok) {
      throw new Error("Erro ao enviar ticket");
    }

    const data = await response.json();
    setTicketId(data.ticketId);
    setSubmitted(true);

    toast.success("Ticket de suporte criado com sucesso!");
  } catch (error) {
    toast.error("Erro ao enviar formulário. Tente novamente.");
    console.error("Erro:", error);
  } finally {
    setLoading(false);
  }
};
```

## 5. Banco de Dados

### 5.1 Schema MongoDB

```javascript
const supportTicketSchema = new Schema({
  id: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  category: {
    type: String,
    enum: ["installation", "performance", "compatibility", "features", "offline", "other"],
    required: true,
  },
  subject: { type: String, required: true },
  description: { type: String, required: true },
  attachments: [
    {
      filename: String,
      size: Number,
      url: String,
    },
  ],
  status: {
    type: String,
    enum: ["open", "in_progress", "resolved", "closed"],
    default: "open",
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high", "critical"],
    default: "low",
  },
  responses: [
    {
      author: String,
      message: String,
      timestamp: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
```

### 5.2 Schema PostgreSQL

```sql
CREATE TABLE support_tickets (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'open',
  priority VARCHAR(20) DEFAULT 'low',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ticket_attachments (
  id SERIAL PRIMARY KEY,
  ticket_id VARCHAR(50) NOT NULL,
  filename VARCHAR(255) NOT NULL,
  size INTEGER NOT NULL,
  url TEXT NOT NULL,
  FOREIGN KEY (ticket_id) REFERENCES support_tickets(id)
);

CREATE TABLE ticket_responses (
  id SERIAL PRIMARY KEY,
  ticket_id VARCHAR(50) NOT NULL,
  author VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ticket_id) REFERENCES support_tickets(id)
);
```

## 6. Página de Rastreamento de Tickets

Crie uma página `/tickets/:id` para que usuários acompanhem seus tickets:

```typescript
// client/src/pages/TicketStatus.tsx
export default function TicketStatus() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/support/tickets/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setTicket(data);
        setLoading(false);
      });
  }, [id]);

  // Renderizar status, respostas, etc
}
```

## 7. Checklist de Implementação

- [ ] Criar endpoints de API no backend
- [ ] Configurar banco de dados
- [ ] Implementar validação de dados
- [ ] Configurar upload de arquivos (S3, local, etc)
- [ ] Configurar envio de emails
- [ ] Testar formulário de suporte
- [ ] Criar página de rastreamento de tickets
- [ ] Configurar notificações para equipe de suporte
- [ ] Implementar dashboard de suporte
- [ ] Documentar processo de resolução de tickets

## 8. Variáveis de Ambiente

```env
# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu-email@gmail.com
SMTP_PASS=sua-senha-de-app

# Armazenamento
AWS_S3_BUCKET=seu-bucket
AWS_S3_REGION=us-east-1
AWS_ACCESS_KEY_ID=sua-chave
AWS_SECRET_ACCESS_KEY=seu-segredo

# Suporte
SUPPORT_EMAIL=suporte@funcionariodigital.com
SUPPORT_SLACK_WEBHOOK=https://hooks.slack.com/...
```

## 9. Próximos Passos

1. ✅ Implementar endpoints de API
2. ✅ Configurar banco de dados
3. ✅ Testar fluxo completo
4. ✅ Criar dashboard de suporte
5. ✅ Implementar SLA (Service Level Agreement)
6. ✅ Adicionar automação de resposta (chatbot)

---

**Desenvolvido com IA e ❤️**
© 2026 Funcionário Digital. Todos os direitos reservados.
