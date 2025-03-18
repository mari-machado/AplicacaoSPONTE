const path = require("path");
const { fixData } = require("./src/index");
const { enviarParaAPI } = require("./src/enviarDadosAPI");

async function mudarProgresso(progressValue, progressMax, log) {
  const progress = document.querySelector("#progress-bar");
  progress.setAttribute("value", progressValue);
  progress.setAttribute("max", progressMax);
  const progressText = document.querySelector("#progress-text");
  const progressLog = document.querySelector("#progress-log");
  progressText.innerHTML = `${progressValue} de ${progressMax} parcelas processadas!`;
  progressLog.innerHTML = log;
  if (progressValue === progressMax) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    window.alert("Importação realizada com sucesso!")
    const progress = document.querySelector("#progress");
    progress.style.display = "none";
  }
}

async function enviarPlanilha() {
  const planilhaFile = document.getElementById("planilhaFile");

  const filePath = planilhaFile.files[0].path;
  const fileName = "Log-de-Importação";

  if (filePath === "") {
    alert("Selecione um arquivo");
  } else if (fileName === "") {
    alert("Escolha um nome para a planilha");
  } else {
    document.body.style.cursor = "wait";
    const overlay = document.querySelector("#overlay");
    overlay.style.display = "flex"; // Exibe a janela de sobreposição

    // Aguardar um pequeno atraso (100ms) para permitir que a alteração do estilo do cursor seja renderizada
    await new Promise((resolve) => setTimeout(resolve, 100));

    const absoluteFilePath = path.resolve(filePath);
    const dados = await fixData(absoluteFilePath, fileName);
    overlay.style.display = "none";
    document.body.style.cursor = "auto";
    await new Promise((resolve) => setTimeout(resolve, 100));
    window.alert(`Arquivo de log foi salvo na pasta output!`);
    if (window.confirm("Deseja iniciar o processo de importação?")) {
      const progress = document.querySelector("#progress");
      progress.style.display = "flex";
      await enviarParaAPI(dados, mudarProgresso);
    }
  }
}
