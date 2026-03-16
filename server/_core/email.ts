/**
 * Serviço de Email
 * Envia notificações para usuários e proprietário
 * 
 * TODO: Integrar com Nodemailer, SendGrid, Resend ou outro serviço
 */

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Enviar email de confirmação de compra
 */
export async function sendPurchaseConfirmationEmail(
  email: string,
  name: string,
  downloadToken: string,
  amount: number
): Promise<boolean> {
  try {
    const downloadUrl = `${process.env.FRONTEND_URL || "https://funciaia-sdysrify.manus.space"}/success?token=${downloadToken}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #00d9ff;">Compra Realizada com Sucesso! 🎉</h2>
        
        <p>Olá <strong>${name}</strong>,</p>
        
        <p>Obrigado por adquirir o <strong>Funcionário Digital</strong>!</p>
        
        <p>Sua compra foi processada com sucesso:</p>
        <ul>
          <li><strong>Valor:</strong> R$ ${(amount / 100).toFixed(2)}</li>
          <li><strong>Status:</strong> Aprovado ✓</li>
          <li><strong>Data:</strong> ${new Date().toLocaleDateString("pt-BR")}</li>
        </ul>
        
        <p style="margin-top: 30px;">
          <a href="${downloadUrl}" style="display: inline-block; padding: 12px 24px; background-color: #00d9ff; color: #0a0e27; text-decoration: none; border-radius: 6px; font-weight: bold;">
            📥 Baixar Agora
          </a>
        </p>
        
        <p style="margin-top: 30px; color: #666;">
          <strong>Próximos Passos:</strong>
        </p>
        <ol>
          <li>Clique no botão acima para baixar o executável</li>
          <li>Descompacte o arquivo ZIP</li>
          <li>Execute o instalador (Windows/Mac/Linux)</li>
          <li>Siga o guia de configuração inicial</li>
        </ol>
        
        <p style="margin-top: 30px; color: #666;">
          <strong>Precisa de Ajuda?</strong><br>
          Acesse nossa documentação completa em: <a href="https://docs.funcionariodigital.com">docs.funcionariodigital.com</a><br>
          Ou envie um email para: suporte@funcionariodigital.com
        </p>
        
        <p style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; color: #999; font-size: 12px;">
          Este é um email automático. Não responda a este email.<br>
          © 2026 Funcionário Digital. Todos os direitos reservados.
        </p>
      </div>
    `;

    const text = `
Compra Realizada com Sucesso!

Olá ${name},

Obrigado por adquirir o Funcionário Digital!

Sua compra foi processada com sucesso:
- Valor: R$ ${(amount / 100).toFixed(2)}
- Status: Aprovado ✓
- Data: ${new Date().toLocaleDateString("pt-BR")}

Link de Download: ${downloadUrl}

Próximos Passos:
1. Clique no link acima para baixar o executável
2. Descompacte o arquivo ZIP
3. Execute o instalador (Windows/Mac/Linux)
4. Siga o guia de configuração inicial

Precisa de Ajuda?
Acesse nossa documentação: docs.funcionariodigital.com
Ou envie um email: suporte@funcionariodigital.com

© 2026 Funcionário Digital. Todos os direitos reservados.
    `;

    return await sendEmail({
      to: email,
      subject: "Compra Confirmada - Funcionário Digital",
      html,
      text,
    });
  } catch (error) {
    console.error("[Email] Erro ao enviar email de confirmação:", error);
    return false;
  }
}

/**
 * Enviar email de falha de pagamento
 */
export async function sendPaymentFailedEmail(
  email: string,
  name: string,
  reason: string
): Promise<boolean> {
  try {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #ff6b6b;">Falha no Pagamento ❌</h2>
        
        <p>Olá <strong>${name}</strong>,</p>
        
        <p>Infelizmente, sua compra do <strong>Funcionário Digital</strong> não foi processada.</p>
        
        <p><strong>Motivo:</strong> ${reason}</p>
        
        <p style="margin-top: 30px;">
          <a href="https://funciaia-sdysrify.manus.space/checkout" style="display: inline-block; padding: 12px 24px; background-color: #00d9ff; color: #0a0e27; text-decoration: none; border-radius: 6px; font-weight: bold;">
            🔄 Tentar Novamente
          </a>
        </p>
        
        <p style="margin-top: 30px; color: #666;">
          Se o problema persistir, entre em contato com nosso suporte:<br>
          Email: suporte@funcionariodigital.com
        </p>
        
        <p style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; color: #999; font-size: 12px;">
          © 2026 Funcionário Digital. Todos os direitos reservados.
        </p>
      </div>
    `;

    return await sendEmail({
      to: email,
      subject: "Falha no Pagamento - Funcionário Digital",
      html,
    });
  } catch (error) {
    console.error("[Email] Erro ao enviar email de falha:", error);
    return false;
  }
}

/**
 * Enviar email de boas-vindas com acesso ao dashboard
 */
export async function sendWelcomeEmail(
  email: string,
  name: string,
  dashboardUrl: string
): Promise<boolean> {
  try {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #00d9ff;">Bem-vindo ao Funcionário Digital! 🚀</h2>
        
        <p>Olá <strong>${name}</strong>,</p>
        
        <p>Sua conta foi criada com sucesso! Agora você tem acesso completo ao seu <strong>Funcionário Digital</strong> pessoal.</p>
        
        <p style="margin-top: 30px;">
          <a href="${dashboardUrl}" style="display: inline-block; padding: 12px 24px; background-color: #00d9ff; color: #0a0e27; text-decoration: none; border-radius: 6px; font-weight: bold;">
            🎯 Acessar Seu Funcionário Digital
          </a>
        </p>
        
        <p style="margin-top: 30px; color: #666;">
          <strong>O que você pode fazer agora:</strong>
        </p>
        <ul style="color: #666;">
          <li>✅ Conectar suas redes sociais (Facebook, Instagram, Twitter, etc)</li>
          <li>✅ Criar e agendar posts automáticos</li>
          <li>✅ Visualizar analytics em tempo real</li>
          <li>✅ Usar IA para gerar conteúdo otimizado</li>
          <li>✅ Gerenciar múltiplas contas de uma vez</li>
        </ul>
        
        <p style="margin-top: 30px; color: #666;">
          <strong>Primeiros Passos:</strong>
        </p>
        <ol style="color: #666;">
          <li>Acesse seu dashboard clicando no botão acima</li>
          <li>Clique em "Conectar Rede Social" para adicionar suas contas</li>
          <li>Crie seu primeiro post usando o editor unificado</li>
          <li>Agende ou publique imediatamente</li>
        </ol>
        
        <p style="margin-top: 30px; color: #666;">
          <strong>Precisa de Ajuda?</strong><br>
          Acesse nossa documentação: <a href="https://docs.funcionariodigital.com">docs.funcionariodigital.com</a><br>
          Ou envie um email: suporte@funcionariodigital.com<br>
          Ou abra um ticket de suporte direto no seu dashboard
        </p>
        
        <p style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; color: #999; font-size: 12px;">
          Este é um email automático. Não responda a este email.<br>
          © 2026 Funcionário Digital. Todos os direitos reservados.
        </p>
      </div>
    `;

    const text = `
Bem-vindo ao Funcionário Digital!

Olá ${name},

Sua conta foi criada com sucesso!

Acesse seu dashboard: ${dashboardUrl}

O que você pode fazer agora:
- Conectar suas redes sociais
- Criar e agendar posts
- Visualizar analytics
- Usar IA para gerar conteúdo
- Gerenciar múltiplas contas

Primeiros Passos:
1. Acesse seu dashboard
2. Conecte suas redes sociais
3. Crie seu primeiro post
4. Agende ou publique

Precisa de ajuda? Visite: docs.funcionariodigital.com

© 2026 Funcionário Digital. Todos os direitos reservados.
    `;

    return await sendEmail({
      to: email,
      subject: "Bem-vindo ao Funcionário Digital!",
      html,
      text,
    });
  } catch (error) {
    console.error("[Email] Erro ao enviar email de boas-vindas:", error);
    return false;
  }
}

/**
 * Enviar notificação ao proprietário
 */
export async function sendOwnerNotificationEmail(
  subject: string,
  html: string
): Promise<boolean> {
  try {
    const ownerEmail = process.env.OWNER_EMAIL || "suporte@funcionariodigital.com";

    return await sendEmail({
      to: ownerEmail,
      subject: `[Notificação] ${subject}`,
      html,
    });
  } catch (error) {
    console.error("[Email] Erro ao enviar notificação ao proprietário:", error);
    return false;
  }
}

/**
 * Send confirmation email after Stripe payment
 */
export async function sendConfirmationEmail(
  email: string,
  userId: number,
  planId: string
): Promise<boolean> {
  const confirmationLink = `${process.env.FRONTEND_URL || "https://funciaia-sdysrify.manus.space"}/verify-email?userId=${userId}&token=${Buffer.from(email).toString("base64")}`;

  const planNames: Record<string, string> = {
    starter: "Starter (R$ 99/mês)",
    professional: "Professional (R$ 299/mês)",
    enterprise: "Enterprise (Customizado)",
  };

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #00d9ff, #8b5cf6); color: white; padding: 20px; border-radius: 8px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; border-radius: 8px; margin: 20px 0; }
          .button { display: inline-block; background: linear-gradient(135deg, #00d9ff, #8b5cf6); color: white; padding: 12px 30px; border-radius: 6px; text-decoration: none; margin: 20px 0; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Bem-vindo ao Funcionário Digital!</h1>
          </div>
          
          <div class="content">
            <h2>Obrigado por sua compra!</h2>
            <p>Você adquiriu o plano <strong>${planNames[planId] || planId}</strong>.</p>
            
            <p>Para ativar sua conta, clique no botão abaixo para confirmar seu email:</p>
            
            <center>
              <a href="${confirmationLink}" class="button">Confirmar Email</a>
            </center>
            
            <h3>Próximos Passos:</h3>
            <ol>
              <li>Confirme seu email clicando no link acima</li>
              <li>Crie uma senha segura para sua conta</li>
              <li>Conecte suas plataformas (Shopee, Mercado Livre, Amazon)</li>
              <li>Comece a automatizar seu e-commerce!</li>
            </ol>
          </div>
          
          <div class="footer">
            <p>© 2026 Funcionário Digital. Todos os direitos reservados.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return await sendEmail({
    to: email,
    subject: "Confirme seu email - Funcionário Digital",
    html,
    text: `Bem-vindo ao Funcionário Digital! Confirme seu email clicando aqui: ${confirmationLink}`,
  });
}

/**
 * Função genérica de envio de email
 * TODO: Implementar com Nodemailer, SendGrid, Resend ou outro serviço
 */
async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    // TODO: Implementar envio real
    // Por enquanto, apenas logar
    console.log("[Email] Email enviado (simulado):", {
      to: options.to,
      subject: options.subject,
      timestamp: new Date().toISOString(),
    });

    // Exemplo com Nodemailer (descomente quando configurado):
    /*
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM || "noreply@funcionariodigital.com",
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });
    */

    return true;
  } catch (error) {
    console.error("[Email] Erro ao enviar email:", error);
    return false;
  }
}
