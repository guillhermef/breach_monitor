import dotenv from 'dotenv';
dotenv.config();
import pkg from 'pg';
const { Client } = pkg;

const DB_USER = process.env.DB_USER;
const DB_HOST = process.env.DB_HOST;
const DB_DATABASE = process.env.DB_DATABASE;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_PORT = process.env.DB_PORT;

export const dbConfig = new Client ({
    user: DB_USER,
    host: DB_HOST,
    database: DB_DATABASE,
    password: DB_PASSWORD,
    port: DB_PORT,
});

export async function abrirConexaoNoBanco() {
    await dbConfig.connect();
    console.log("[INFO] Conexão com o banco de dados aberta.")
}

export async function fecharConexaoNoBanco() {
    await dbConfig.end();
    console.log("[INFO] Conexão com o banco de dados fechada.")
}

export async function inserirResultados(

    Name,
    Title,
    Domain,
    BreachDate,
    Addeddate,
    PwnCount,
    Description,
    DataClasses,
    notified

    ) {

    const query = `
        INSERT INTO vazamentos (
        name, 
        title,
        domain, 
        breach_date,
        added_date,
        pwn_count,
        description,
        data_classes,
        notified
        ) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);
    `;

    await dbConfig.query(query, [
        name,
        title,
        dominio,
        breach_date,
        added_date,
        pwn_count,
        description,
        data_classes,        
        notified
    ]);

}

// Faz um select no banco para verificar se o 'name' que é o identificador do vazamento já existe no banco
export async function existe(name) {

    const query = `SELECT name FROM vazamentos WHERE name = $1 LIMIT 1`;
    const resultado = await dbConfig.query(query, [name])

    return resultado.rowCount > 0;

};