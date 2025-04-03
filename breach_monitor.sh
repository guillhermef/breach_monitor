#!/bin/bash

# Configurações
API_URL="https://haveibeenpwned.com/api/v3/latestbreach"
LOG_DIR="/tmp/breach_monitor"
PREVIOUS_FILE="$LOG_DIR/previous_breach.json"
CURRENT_FILE="$LOG_DIR/current_breach.json"

# Cria diretório de logs se não existir
mkdir -p "$LOG_DIR"

# Baixa o último vazamento
echo "Consultando API..."
response=$(curl -s "$API_URL")

# Extrai os campos necessários e salva em JSON
current_data=$(echo "$response" | jq '{Name: .Name, Title: .Title, Domain: .Domain, BreachDate: .BreachDate, AddedDate: .AddedDate, Description: .Description}')
echo "$current_data" > "$CURRENT_FILE"

# Verifica se existe um arquivo anterior para comparar
if [ -f "$PREVIOUS_FILE" ]; then
    echo "Comparando com o vazamento anterior..."
    diff_result=$(diff "$PREVIOUS_FILE" "$CURRENT_FILE")

    if [ -z "$diff_result" ]; then
        echo "Nenhuma nova violação detectada."
        exit 0
    else
        echo "🚨 Nova violação detectada!"
        echo "$current_data" | jq .

        # Extrai os dados para a mensagem
        name=$(echo "$current_data" | jq -r '.Name')
        title=$(echo "$current_data" | jq -r '.Title')
        domain=$(echo "$current_data" | jq -r '.Domain')
        breach_date=$(echo "$current_data" | jq -r '.BreachDate')
        added_date=$(echo "$current_data" | jq -r '.AddedDate')
        description=$(echo "$current_data" | jq -r '.Description')

        description_escaped=$(jq -Rs '.' <<< "$description" | sed 's/^"//;s/"$//')
       
	    echo "enviando notificação"

        curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "cards": [{
      "header": {
        "title": "🔔 Nova Violação de Dados Detectada!",
        "subtitle": "Sherlock App - '"$(date +%H:%M)"'"
      },
      "sections": [{
        "widgets": [{
          "textParagraph": {
            "text": "<b>📌 Nome:</b> '"$name"'<br><b>📝 Título:</b> '"$title"'<br><b>🌐 Domínio:</b> '"$domain"'<br><b>📅 Data da Violação:</b> '"$breach_date"'<br><b>⏱️ Adicionado em:</b> '"$added_date"'<br><br><b>📖 Descrição:</b><br>'"$description_escaped"'"
          }
        }]
      }]
    }]
  }' \
  "GOOGLE WEBHOOK"
        

    fi
else
    echo "Primeira execução: Salvando dados atuais como referência."
    cp "$CURRENT_FILE" "$PREVIOUS_FILE"
    echo "$current_data" | jq .

    name=$(echo "$current_data" | jq -r '.Name')
    title=$(echo "$current_data" | jq -r '.Title')
    domain=$(echo "$current_data" | jq -r '.Domain')
    breach_date=$(echo "$current_data" | jq -r '.BreachDate')
    added_date=$(echo "$current_data" | jq -r '.AddedDate')
    description=$(echo "$current_data" | jq -r '.Description')

    description_escaped=$(jq -Rs '.' <<< "$description" | sed 's/^"//;s/"$//')

    echo "enviando notificação"

    curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "cards": [{
      "header": {
        "title": "🔔 Nova Violação de Dados Detectada!",
        "subtitle": "Sherlock App - '"$(date +%H:%M)"'"
      },
      "sections": [{
        "widgets": [{
          "textParagraph": {
            "text": "<b>📌 Nome:</b> '"$name"'<br><b>📝 Título:</b> '"$title"'<br><b>🌐 Domínio:</b> '"$domain"'<br><b>📅 Data da Violação:</b> '"$breach_date"'<br><b>⏱️ Adicionado em:</b> '"$added_date"'<br><br><b>📖 Descrição:</b><br>'"$description_escaped"'"
          }
        }]
      }]
    }]
  }' \
  "GOOGLE WEBHOOK"

    
fi

# Atualiza o arquivo anterior para a próxima execução
cp "$CURRENT_FILE" "$PREVIOUS_FILE"
