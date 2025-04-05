import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

import { enviarWebhook } from './enviarNotificacao.js';
import { existe, inserirResultados } from './database.js';

// Variáveis de ambiente
const API = process.env.API_URL;

export async function checkVazamentoEmpresa(listaEmpresa = []) {
    try {
        const response = await axios.get(API);
        if (response.status !== 200) {
            throw new Error("[ERRO] Erro na requisição para o site...");
        }

        let vazamentos = response.data;

        if (!Array.isArray(vazamentos)) {
            vazamentos = [vazamentos];
        }

        for (const vazamento of vazamentos) {

            const {
                Name,
                Title,
                Domain,
                BreachDate,
                AddedDate,
                PwnCount,
                Description,
                DataClasses
            } = vazamento;

            const nomeEmpresa = Title.toLowerCase();

            for (const empresa of listaEmpresa) {

                if (nomeEmpresa.includes(empresa.toLowerCase())) {

                    const registroExiste = await existe(Name);
                    if (!registroExiste) {

                        console.log(`[INFO] Vazamento novo encontrado para: ${Title}`);
                        await enviarWebhook(
                            Title,
                            Domain,
                            BreachDate,
                            PwnCount,
                            Description,
                            DataClasses
                        );

                        await inserirResultados(
                            Name,
                            Title,
                            Domain,
                            BreachDate,
                            AddedDate,
                            PwnCount,
                            Description,
                            DataClasses,
                            true
                        );
                    }
                }
            }
        }

    } catch (error) {
        console.error("[ERRO] Erro ao verificar vazamentos:", error.message);
    }
}
