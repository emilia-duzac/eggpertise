interface ContactFormData {
  nombre: string;
  email: string;
  empresa: string;
  pais: string;
  mensaje: string;
}

export function getContactFormEmailTemplate(formData: ContactFormData): string {
  const { nombre, email, empresa, pais, mensaje } = formData;
  const currentDate = new Date().toLocaleString("es-AR", {
    timeZone: "America/Argentina/Buenos_Aires",
  });

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 8px 8px 0 0;
            text-align: center;
          }
          .content {
            background: #ffffff;
            padding: 30px;
            border: 1px solid #e5e7eb;
            border-top: none;
          }
          .field {
            margin-bottom: 20px;
          }
          .label {
            font-weight: 600;
            color: #667eea;
            margin-bottom: 5px;
            display: block;
          }
          .value {
            color: #4b5563;
            padding: 10px;
            background: #f9fafb;
            border-radius: 4px;
            border-left: 3px solid #667eea;
          }
          .message-box {
            background: #f9fafb;
            padding: 15px;
            border-radius: 4px;
            border-left: 3px solid #667eea;
            white-space: pre-wrap;
          }
          .footer {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            font-size: 12px;
            color: #6b7280;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 style="margin: 0; font-size: 24px;">Nueva Consulta de Contacto</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">EggPertise LLC</p>
        </div>
        <div class="content">
          <div class="field">
            <span class="label">Nombre:</span>
            <div class="value">${nombre}</div>
          </div>
          
          <div class="field">
            <span class="label">Email:</span>
            <div class="value"><a href="mailto:${email}">${email}</a></div>
          </div>
          
          <div class="field">
            <span class="label">Empresa:</span>
            <div class="value">${empresa}</div>
          </div>

          <div class="field">
            <span class="label">País:</span>
            <div class="value">${pais}</div>
          </div>
          
          <div class="field">
            <span class="label">Mensaje:</span>
            <div class="message-box">${mensaje}</div>
          </div>
          
          <div class="footer">
            <p>Este mensaje fue enviado desde el formulario de contacto de eggpertise.com</p>
            <p>Fecha: ${currentDate}</p>
          </div>
        </div>
      </body>
    </html>
  `;
}
