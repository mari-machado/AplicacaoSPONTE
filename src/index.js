const xlsx = require("xlsx");
const fs = require("fs");
const { format, endOfMonth } = require("date-fns");
const { log } = require("console");

require("dotenv").config();

function lerXLSX(caminhoArquivo) {
  const arquivo = xlsx.readFile(caminhoArquivo);
  const workbook =
    arquivo.Sheets[arquivo.SheetNames[arquivo.SheetNames.length - 1]];
  const jsonData = xlsx.utils.sheet_to_json(workbook, { header: 1 });
  return jsonData;
}

async function tratarDados(dados, posicoesParaLer, periodoConfig) {
  const dadosTratados = [];
  let tiroualgo = false;
  let contador = 0;
  const ANO_ATUAL = periodoConfig.ano || process.env.ANO_ATUAL || "2023";
  log(ANO_ATUAL);

  for (const linha of dados) {
    let adicionarLinha = true;
    let linhaTratada = [];

    for (const posicao of posicoesParaLer) {
      if (contador === 0) {
        linhaTratada.push(linha[posicao]);
      } else {
        if (posicao === 2) {
          linhaTratada.push(linha[posicao]);
        } else {
          if (posicao === 2) {
            if (
              linha[posicao]
                .toString()
                .toLowerCase()
                .includes("Anna Karolina da Silva Lima".toLowerCase()) ||
              linha[posicao]
                .toString()
                .toLowerCase()
                .includes("Clara Meireles Pereira".toLowerCase()) ||
              linha[posicao]
                .toString()
                .toLowerCase()
                .includes("Guilherme da Silva Nascimento".toLowerCase()) ||
              linha[posicao]
                .toString()
                .toLowerCase()
                .includes("Kaylane da Silva Alves".toLowerCase()) ||
              linha[posicao]
                .toString()
                .toLowerCase()
                .includes("Kayo da Silva Alves".toLowerCase())
            ) {
              adicionarLinha = false;
              tiroualgo = true;
              break;
            }

            if (
              linha[posicao]
                .toString()
                .toLowerCase()
                .includes("Allicia França Mello".toLowerCase())
            ) {
              linha[posicao] = "Allicia de França Mello";
            }
            if (
              linha[posicao]
                .toString()
                .toLowerCase()
                .includes("Graziella D' Emilio Teixeira".toLowerCase())
            ) {
              linha[posicao] = "Graziella D´ Emilio Teixeira";
            }
            if (
              linha[posicao]
                .toString()
                .toLowerCase()
                .includes("Joseph Arthur Fernandes da Silva".toLowerCase())
            ) {
              linha[posicao] = "Joseph Arthur Azevedo da Silva";
            }
            if (
              linha[posicao]
                .toString()
                .toLowerCase()
                .includes("Manoel Junior Alves Leita".toLowerCase())
            ) {
              linha[posicao] = "Manoel Junior Alves Leite";
            }
          }

          if (posicao === 5) {
            if (linha[posicao].toString().toLowerCase().includes("inativo")) {
              adicionarLinha = false;
              tiroualgo = true;
              break;
            }
          }

          if (posicao === 6) {
            if (linha[posicao].toString().toLowerCase().includes("entrada")) {
              adicionarLinha = false;
              tiroualgo = true;
              break;
            }
          }

          if (posicao === 13) {
            const anoLinha = linha[posicao].toString();
            if (anoLinha !== periodoConfig.ano) {
              adicionarLinha = false;
              tiroualgo = true;
              break;
            }
          }

          if (posicao === 17) {
            if (Number(linha[posicao]) <= 0 || Number(linha[posicao]) > 700) {
              adicionarLinha = false;
              tiroualgo = true;
              break;
            }
          }

          if (posicao === 11) {
            const mes = Number(String(linha[posicao]).substring(3, 5));
            const data = new Date(ANO_ATUAL, mes - 1);
            const ultimoDiaMes = format(endOfMonth(data), "dd/MM/yyyy");
            console.table([linha[posicao], mes, data, ultimoDiaMes]);
            linha[posicao] = ultimoDiaMes;
          }

          if (posicao === 18) {
            if (linha[posicao].toLowerCase() !== "paga") {
              adicionarLinha = false;
              tiroualgo = true;
              break;
            }
          }

          if (posicao === 12) {
            const mes = Number(linha[posicao].toString().substring(0, 2));
            
            if (periodoConfig.tipo === 'mes') {
              if (mes !== Number(periodoConfig.mes)) {
                adicionarLinha = false;
              }
            } else if (periodoConfig.tipo === 'periodo') {
              const mesInicio = Number(periodoConfig.mesInicio);
              const mesFim = Number(periodoConfig.mesFim);
              if (mes < mesInicio || mes > mesFim) {
                adicionarLinha = false;
              }
            }
          }

          linhaTratada.push(linha[posicao]);
        }
      }
    }

    if (adicionarLinha) {
      dadosTratados.push(linhaTratada);
    }

    contador++;
  }

  // if (tiroualgo === true) {
  //   console.log("Tirou algo");
  // }

  return dadosTratados;
}

function salvarJSON(dados, nomeArquivo) {
  const jsonData = JSON.stringify(dados);
  const outputFolder = "output";

  if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder);
  }

  const filePath = `${outputFolder}/${nomeArquivo}.json`;

  fs.writeFile(filePath, jsonData, (err) => {
    if (err) {
      console.error("Erro ao salvar o arquivo JSON:", err);
      return;
    }
    console.log("Arquivo JSON salvo com sucesso:", filePath);
  });
}

function jsonParaXLSX(dados, nomeArquivo) {
  const outputFolder = "output";

  if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder);
  }

  const workbook = xlsx.utils.book_new();
  const worksheet = xlsx.utils.json_to_sheet(dados, { skipHeader: true });
  xlsx.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  const filePath = `${outputFolder}/${nomeArquivo}.xlsx`;

  xlsx.writeFile(workbook, filePath);
  console.log("Arquivo XLSX salvo com sucesso:", filePath);
}

async function fixData(filePath, fileName, periodoConfig) {
  const caminhoArquivo = filePath;
  const posicoesParaLer = [2, 5, 6, 9, 10, 11, 12, 13, 14, 15, 16, 17, 19];
  const outputArquivo = fileName;

  const dadosFinais = await tratarDados(
    lerXLSX(caminhoArquivo),
    posicoesParaLer,
    periodoConfig
  );

  let quantidadeLinhasDesejada = parseInt(process.env.QTDLINHAS) || Infinity;
  quantidadeLinhasDesejada++;
  const dadosTratadosLimitados = dadosFinais.slice(0, quantidadeLinhasDesejada);

  jsonParaXLSX(dadosTratadosLimitados, outputArquivo);
  salvarJSON(dadosTratadosLimitados, outputArquivo);

  return dadosTratadosLimitados;
}

module.exports = {
  fixData,
};
