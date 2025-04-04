import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

// Variáveis de ambiente
const WEBHOOK = process.env.API_WEBHOOK;

export async function enviarWebhook(Title, Domain, BreachDate, PwnCount, Description, DataClasses, LogoPath = '') {
    try {
        const dataFormatada = new Date(BreachDate).toLocaleDateString('pt-BR');
        const tiposDados = DataClasses.join(', ');
        const descricaoLimpa = Description.replace(/<[^>]+>/g, '');

        const payload = {
            cards: [{
                header: {
                    title: `🚨 Nova violação detectada!`,
                    subtitle: Title,
                },
                sections: [{
                    widgets: [{
                        textParagraph: {
                            text:
                                `<b>🌐 Domínio:</b> ${Domain}<br>` +
                                `<b>📅 Data da Violação:</b> ${dataFormatada}<br>` +
                                `<b>👥 Contas Afetadas:</b> ${PwnCount.toLocaleString('pt-BR')}<br>` +
                                `<b>📂 Dados Vazados:</b> ${tiposDados}<br><br>` +
                                `<b>📖 Descrição:</b><br>${descricaoLimpa}`
                        }
                    }]
                }]
            }]
        };

        const response = await axios.post(WEBHOOK, payload);

        if (response.status === 200) {
            console.log("Webhook com card enviado com sucesso.");
        } else {
            console.error("Erro ao enviar webhook:", response.status);
        }
    } catch (error) {
        console.error("Falha no envio do webhook:", error.message);
    }
}
