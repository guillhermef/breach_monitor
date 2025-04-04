import { listaEmpresas } from "./listaEmpresas";
import { checkVazamentoEmpresa } from "./checkVazamentos";
import { abrirConexaoNoBanco } from "./database";

async function executarScript() {
    
    try {

        console.log(`[INFO] Iniciando execução do script em ${adjustTimezone(new Date())}`);
        await abrirConexaoNoBanco();
        await checkVazamentoEmpresa(listaEmpresas);

    }     

    catch (error) {
        console.error("[ERRO] Ocorreu um erro durante a execução do script.", error);
    } 

    finally {

        try {
            console.log("[INFO] Fechando conexão com o banco de dados...");
            await fecharConexaoNoBanco();
        } 
        catch (error) {
            console.error("[ERRO] Erro ao fechar conexão com o banco de dados.", error);
        }
        
    }

    console.log(`[INFO] Execução do script finalizada em ${adjustTimezone(new Date())}`);
    console.log("[INFO] Aguardando 24 horas para a próxima execução...");
    console.log("--------------------------------------------------");
    
}

executarScript();
setInterval(executarScript, 24 * 60 * 60 * 1000);
