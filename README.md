# Check de Vazamentos

Este projeto contém um script desenvolvido em Node.js para monitorar vazamentos de dados envolvendo empresas específicas. A verificação é realizada por meio da API pública do serviço [Have I Been Pwned](https://haveibeenpwned.com/).

## Como funciona

O ponto de entrada da aplicação é o arquivo `main.js`, que chama a função `checkVazamentos.js`, passando como argumento uma lista contendo os nomes das empresas a serem monitoradas.

Esses nomes estão definidos em um array dentro do arquivo `listaEmpresas.js`.

A cada execução, o script realiza uma consulta à API do HIBP (`https://haveibeenpwned.com/api/v3/latestbreach`) para obter o último vazamento registrado. Se o nome de alguma empresa da lista estiver contido nos dados do vazamento, uma verificação adicional será realizada para evitar notificações duplicadas.

## Verificação no banco de dados

Cada vazamento retornado pela API do HIBP possui um identificador único, representado pelo campo `Name`. Antes de enviar qualquer notificação, o script consulta o banco de dados para verificar se o vazamento já foi registrado.

- Se o vazamento **já estiver salvo**, nenhuma ação será realizada.
- Se o vazamento **ainda não estiver salvo**, ele será inserido no banco de dados e uma notificação será enviada via Webhook.

## Formato da notificação

As notificações são enviadas utilizando o formato "Card", compatível com plataformas como o Google Chat. A mensagem contém as seguintes informações:

- Nome da empresa
- Domínio afetado
- Data do vazamento
- Quantidade de contas impactadas
- Tipos de dados vazados
- Descrição do incidente

## Exemplo de uso

Para monitorar vazamentos relacionados à empresa Oracle, adicione o nome ao array `listaEmpresas`:

```javascript
const listaEmpresas = ["oracle"];
```

Com isso, sempre que o script for executado e encontrar algo relacionado à Oracle, ele tomará a ação adequada conforme o caso: se for um vazamento novo, será registrado e notificado; se já tiver sido alertado anteriormente, nenhuma ação será tomada.
