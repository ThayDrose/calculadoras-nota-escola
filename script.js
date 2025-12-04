function calcularRecuperacao() {
  const materia = document.getElementById("materia").value.trim();
  const nota1 = parseFloat(document.getElementById("nota1").value);
  const nota2 = parseFloat(document.getElementById("nota2").value);
  const nota3 = parseFloat(document.getElementById("nota3").value);

  const resultadoDiv = document.getElementById("resultado");
  resultadoDiv.className = "resultado-box";

  if (!materia || isNaN(nota1) || isNaN(nota2) || isNaN(nota3)) {
    resultadoDiv.innerHTML =
      "❌ Por favor, preencha todos os campos com notas válidas (0-10) e o nome da disciplina.";
    resultadoDiv.classList.add("reprovado");
    return;
  }

  const mediaAnual = (nota1 + nota2 + nota3) / 3;
  const mediaMinimaAprovacaoDireta = 7.0;

  let htmlResultado = `<h3>Situação para ${materia.toUpperCase()}</h3>`;
  htmlResultado += `<p>Média Anual (MA): <strong>${mediaAnual.toFixed(
    2
  )}</strong></p>`;

  if (mediaAnual >= mediaMinimaAprovacaoDireta) {
    htmlResultado += "<h2>🎉 APROVADO(A) DIRETAMENTE!</h2>";
    htmlResultado += "<p>Sua média foi igual ou superior a 7,0. Parabéns!</p>";
    resultadoDiv.classList.add("aprovado");
  } else {
    const notaRecuperacaoNecessaria = (25.0 - mediaAnual * 3) / 2;

    htmlResultado += `<p>Sua média (${mediaAnual.toFixed(
      2
    )}) é inferior a 7,0.</p>`;

    if (mediaAnual < 5.0 && notaRecuperacaoNecessaria > 10.0) {
      htmlResultado += "<h2>❌ REPROVAÇÃO POR MÉDIA INSUFICIENTE!</h2>";
      htmlResultado +=
        "<p>Sua Média Anual é inferior a 5,0. Você está **REPROVADO(A)**.</p>";
      resultadoDiv.classList.add("reprovado");
    } else if (notaRecuperacaoNecessaria <= 0.0) {
      htmlResultado += "<h2>✅ RECUPERAÇÃO GARANTIDA!</h2>";
      htmlResultado +=
        "<p>Para atingir a Média Final 5,0, você precisa de uma nota mínima de **0,0** na prova de Recuperação.</p>";
      resultadoDiv.classList.add("recuperacao");
    } else {
      const notaFinalExibida = Math.min(
        notaRecuperacaoNecessaria,
        10.0
      ).toFixed(2);

      htmlResultado += "<h2>⚠️ EM RECUPERAÇÃO ANUAL</h2>";
      htmlResultado += `<p>Para atingir a Média Final mínima de 5,0, você precisa de uma nota de, no mínimo:</p>`;
      htmlResultado += `<strong>${notaFinalExibida}</strong>`;
      htmlResultado += `<p>na prova de Recuperação Anual.</p>`;
      resultadoDiv.classList.add("recuperacao");
    }
  }

  resultadoDiv.innerHTML = htmlResultado;
}
