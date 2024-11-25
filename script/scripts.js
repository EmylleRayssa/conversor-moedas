// Adiciona um ouvinte de evento no botão de conversão
document.getElementById('converter').addEventListener('click', () => {

    // Obtém o valor inserido pelo usuário no campo 'valor' e converte para um número de ponto flutuante
    const valor = parseFloat(document.getElementById('valor').value);

    // Obtém as moedas de origem e destino selecionadas pelo usuário nos campos de seleção (select)
    const moedaOrigem = document.getElementById('moedaOrigem').value;
    const moedaDestino = document.getElementById('moedaDestino').value;

    // Verifica se o valor inserido é válido (maior que 0) e se as moedas de origem e destino são diferentes
    if (!valor || valor <= 0 || moedaOrigem === moedaDestino) {
        // Exibe um alerta caso o valor seja inválido ou as moedas sejam iguais
        alert('Por favor, insira um valor válido (positivo) e selecione moedas diferentes.');
        return; // Sai da função, não faz a requisição para a API
    }

    // Monta a URL da API para obter a taxa de conversão entre as moedas selecionadas
    const url = `https://economia.awesomeapi.com.br/json/last/${moedaOrigem}-${moedaDestino}`;

    // Faz a requisição para a API utilizando a função fetch
    fetch(url)
        .then(response => {
            // Verifica se a resposta da API foi bem-sucedida (status 200)
            if (!response.ok) {
                throw new Error('Erro ao consultar a API'); // Caso contrário, lança um erro
            }
            return response.json(); // Retorna a resposta no formato JSON
        })
        .then(data => {
            // Monta a chave que será usada para acessar a taxa de conversão na resposta da API
            const key = `${moedaOrigem}${moedaDestino}`;

            // Verifica se a chave existe na resposta (se a conversão está disponível)
            if (data[key]) {
                // Obtém o valor da taxa de conversão (bid) e o converte para um número
                const taxa = parseFloat(data[key].bid);

                // Calcula o resultado da conversão multiplicando o valor pela taxa e arredonda para 2 casas decimais
                const resultado = (valor * taxa).toFixed(2);

                // Exibe o resultado no campo 'resultado' (input) no formato: "valor convertido MoedaDestino"
                document.getElementById('resultado').value = `${resultado} ${moedaDestino}`;
            } else {
                // Lança um erro caso a chave de conversão não seja encontrada na resposta da API
                throw new Error('Dados de conversão não encontrados.');
            }
        })
        .catch(error => {
            // Em caso de erro (seja na requisição ou no processamento), exibe uma mensagem de erro
            console.error('Erro:', error); // Exibe o erro no console para debug
            alert('Não foi possível obter a cotação. Tente novamente mais tarde.'); // Exibe um alerta para o usuário
        });
});

