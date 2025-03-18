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
        sParametrosBusca: 'CPF=18760067730'
        
    }
})
    .then(
        (response) => { console.log(response.data) }
    )



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
//     )