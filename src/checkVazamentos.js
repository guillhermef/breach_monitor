import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

import { enviarWebhook } from './enviarNotificacao';
import { existe, inserirResultados } from './database';

// Variáveis de ambiente
const API = process.env.API_URL;

export async function checkVazamentoEmpresa(listaEmpresa = []) {

    try {

        const response = await axios.get(`${API}`);
        if (response.status !== 200) {
            throw new Error("[ERRO] Erro na requisição para o site...");
        }

        const {
            Name,
            Title,
            Domain,
            BreachDate,
            AddedDate,
            PwnCount,
            Description,
            DataClasses
        } = response.data;

        const nomeEmpresa = Name.toLowerCase();
        for (const empresa of listaEmpresa) {

            if (nomeEmpresa.includes(empresa.toLowerCase())) {

                console.log(`[INFO] Empresa encontrada: ${empresa}`);
                const registroExiste = await existe(Name);
                if (registroExiste === false) {

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
                    )

                }

            }

        }

    } 
    catch (error) {
        console.error("[ERRO] Erro ao verificar vazamento:", error.message);
    }

}
