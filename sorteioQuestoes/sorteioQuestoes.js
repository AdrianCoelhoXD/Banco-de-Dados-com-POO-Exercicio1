// Import de bibliotecas 
const fs = require('fs');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const path = require('path');

// Criando uma variável para armazenar as questões com a descrição de cada questão
const questoes = [
    'Questão 1: Quanto é 10 + 1?',
    'Questão 2: Qual é o resultado de 12 - 2?',
    'Questão 3: Calcule 5 x 5.',
    'Questão 4: Quanto é 16 ÷ 2?',
    'Questão 5: Qual é a raiz quadrada de 81?',
];

// Função para atribuir questões aleatórias aos estudantes
function atribuirQuestoes(estudantes) {
    const resultado = [];

    estudantes.forEach(estudante => {
        const indiceAleatorio = Math.floor(Math.random() * questoes.length);
        const questao = questoes.splice(indiceAleatorio, 1)[0];
        resultado.push({ estudante, questao });
    });

    return resultado;
}

// Função para ler o arquivo CSV de entrada e atribuir as questões
function lerCsvEAtribuirQuestoes(caminhoCsvEntrada, callback) {
    const estudantes = [];

    fs.createReadStream(caminhoCsvEntrada)
        .pipe(csv())
        .on('data', (row) => {
            estudantes.push(row.Nome);
        })
        .on('end', () => {
            const resultado = atribuirQuestoes(estudantes);
            callback(resultado);
        });
}

// Função para salvar o resultado do sorteio em um arquivo CSV
function salvarResultadoEmCsv(resultado, caminhoCsvSaida) {
    const csvWriter = createCsvWriter({
        path: caminhoCsvSaida,
        header: [
            { id: 'estudante', title: 'Estudante' },
            { id: 'questao', title: 'Questão' }
        ]
    });

    csvWriter.writeRecords(resultado)
        .then(() => {
            console.log('Resultado salvo em:', caminhoCsvSaida);
            // Mostrar o resultado no terminal
            console.log('\n => Resultado do Sorteio <=');
            resultado.forEach(({ estudante, questao }) => {
                console.log(`Estudante: ${estudante} - Questão: ${questao}`);
            });
            console.log('====================================================================\n');
        });
}

// Definir o caminho do arquivo para o resultado
const caminhoArquivo = path.join(__dirname, 'resultadoSorteio.txt');

// Ler o CSV fornecido de entrada, atribui as questões e salva o resultado no arquivo de saída
lerCsvEAtribuirQuestoes('estudantes.csv', (resultado) => {
    salvarResultadoEmCsv(resultado, caminhoArquivo);
});
