const axios = require("axios");
const { parseString } = require("xml2js");

require("dotenv").config();

const API_URL = "https://api.sponteeducacional.net.br/WSAPIEdu.asmx";

async function enviarDependencia(dados = [], mudarProgresso = () => {}) {
  console.log("Iniciando o envio de dependências...");
  const resultados = [];
  const quantidadeDeDependencias = dados.length;
  mudarProgresso(0, quantidadeDeDependencias);

  let dependenciasProcessadas = 0;

  for (const dado of dados) {
    const [
      nomeAluno,
      descricaoCobranca,
      dataVencimento,
      valorCobranca,
      categoriaID,
      alunoID 
    ] = dado;

    try {
      console.log(`Processando dependência para o aluno: ${nomeAluno}`);

      const soapRequestBody = `
      <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
        <soap:Body>
          <InsertPlano xmlns="http://api.sponteeducacional.net.br/">
            <nCodigoCliente>${process.env.CODIGO_CLIENTE}</nCodigoCliente>
            <sToken>${process.env.TOKEN}</sToken>
            <nAlunoID>${alunoID}</nAlunoID>
            <nCategoriaID>${categoriaID}</nCategoriaID>
            <dDataPrimeiroVencimento>${dataVencimento}</dDataPrimeiroVencimento>
            <nNumeroParcelas>1</nNumeroParcelas>
            <nValorParcelas>${valorCobranca}</nValorParcelas>
            <nFormaCobrancaID>-1</nFormaCobrancaID>
          </InsertPlano>
        </soap:Body>
      </soap:Envelope>
      `;

      console.log('XML enviado:', soapRequestBody);
      console.log('Parâmetros:', { nomeAluno, categoriaID, alunoID, dataVencimento, valorCobranca });

      const response = await axios.post(API_URL, soapRequestBody, {
        headers: {
          "Content-Type": "text/xml; charset=utf-8",
          SOAPAction: "http://api.sponteeducacional.net.br/InsertPlano",
        },
      });

      const result = await new Promise((resolve, reject) => {
        parseString(response.data, (err, res) => {
          if (err) reject(err);
          else resolve(res);
        });
      });

      const retornoOperacao =
        result["soap:Envelope"]["soap:Body"][0]["InsertPlanoResponse"][0][
          "InsertPlanoResult"
        ][0]["wsRetornoParcelas"][0]["RetornoOperacao"][0];

      console.log(`Resultado da operação: ${retornoOperacao}`);
      resultados.push({ nomeAluno, retornoOperacao });
    } catch (error) {
      console.error("Erro ao enviar dependência:", error);
    }

    dependenciasProcessadas++;
    mudarProgresso(dependenciasProcessadas, quantidadeDeDependencias);
  }

  console.log("Envio de dependências concluído.");
  return resultados;
}

module.exports = { enviarDependencia };
