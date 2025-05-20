const axios = require('axios')

const codigoCliente = 30711;
const token = 'pAmOB17o30CH';
const url = 'https://api.sponteeducacional.net.br/WSAPIEdu.asmx/';

const endpoints = {
    GetAlunos: url + 'GetAlunos'
}

console.log(endpoints.GetAlunos);

// function enviarParaAPI(dados) {
//     console.log(dados)
// }

axios.get(endpoints.GetAlunos, {
    params: {
        nCodigoCliente: codigoCliente,
        sToken: token,
        // sParametrosBusca: 'CPF=18760067730'
        sParametrosBusca: 'NOME=Laura Oliveira dos Santos'
    }
})
    .then(
        (response) => { console.log(response.data) }
    )

const { enviarDependencia } = require('./dependencias');

// Simulação de alunos com dependências
async function testarEnviarDependenciasPorAluno() {
    const alunosComDependencias = [
        {
            nomeAluno: "Aluno Teste 1",
            dependencias: [
                { descricao: "DEPENDÊNCIA-01", dataVencimento: "2025-12-01", valor: 100, categoriaID: 609 },
                { descricao: "DEPENDÊNCIA-02", dataVencimento: "2025-12-01", valor: 120, categoriaID: 610 }
            ]
        },
        {
            nomeAluno: "Aluno Teste 2",
            dependencias: [
                { descricao: "DEPENDÊNCIA-03", dataVencimento: "2025-12-01", valor: 130, categoriaID: 611 }
            ]
        }
    ];

    const dadosParaEnvio = [];
    for (const aluno of alunosComDependencias) {
        for (const dep of aluno.dependencias) {
            dadosParaEnvio.push([
                aluno.nomeAluno,
                dep.descricao,
                dep.dataVencimento,
                dep.valor,
                dep.categoriaID,
                814 // alunoID 
            ]);
        }
    }

    console.log("Iniciando teste de integração com enviarDependencia...");
    try {
        const resultado = await enviarDependencia(
            dadosParaEnvio,
            (atual, total) => {
                console.log(`Progresso: ${atual}/${total}`);
            }
        );
        console.log("Resultado do teste de dependências:", resultado);
    } catch (e) {
        console.error("Erro ao testar enviarDependencia:", e);
    }
}

testarEnviarDependenciasPorAluno();

// module.exports = {
//     enviarParaAPI
// };

// axios.get(url, {
//     params: {
//         nCodigoCliente: codigoCliente,
//         sToken: token,
//         nContratoID: dados.nContratoID,
//         nContratoAulaLivreID: dados.nContratoAulaLivreID,
//         nAlunoID: dados.nAlunoID,
//         nTipoPlano: dados.nTipoPlano,
//         nBolsaID: dados.nBolsaID,
//         dDataPrimeiroVencimento: dados.dDataPrimeiroVencimento,
//         nNumeroParcelas: dados.nNumeroParcelas,
//         nValorParcelas: dados.nValorParcelas,
//         nFormaCobrancaID: dados.nFormaCobrancaID,
//         nCategoriaID: dados.nCategoriaID,
//         sObservacao: dados.sObservacao,
//         nClienteID: dados.nClienteID,
//         nContaID: dados.nContaID
//     }
// })
//     .then(
//         (response) => { console.log(response) }
    // )

// const axios = require('axios');
// axios.post = async (url, body, options) => {
//     console.log('[MOCK] axios.post chamado para:', url);
//     return {
//         data: `<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><InsertPlanoResponse xmlns="http://api.sponteeducacional.net.br/"><InsertPlanoResult><wsRetornoParcelas><RetornoOperacao>00 - Sucesso</RetornoOperacao><ContaReceberID>99999</ContaReceberID></wsRetornoParcelas></InsertPlanoResult></InsertPlanoResponse></soap:Body></soap:Envelope>`
//     };
// };