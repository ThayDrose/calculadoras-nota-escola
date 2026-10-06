"use strict";

/* Regras da escola: ajuste aqui se o regimento mudar. */
const REGRAS = {
  mediaAprovacao: 7, // média anual para aprovar direto
  mediaFinalMinima: 5, // média final mínima após a recuperação
  pesoMediaAnual: 3, // peso da média anual na média final
  pesoRecuperacao: 2, // peso da prova de recuperação
  notaMaxima: 10,
};

const $ = (id) => document.getElementById(id);
const CIRC = 2 * Math.PI * 68;
const campos = [...document.querySelectorAll(".nota")];
const sliders = [...document.querySelectorAll(".slider")];
const reduzMovimento = matchMedia("(prefers-reduced-motion: reduce)").matches;
let statusAnterior = "idle";

const fmt = (n) => n.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 2 });

/* Aceita "7,5" ou "7.5". Vazio vira NaN; fora de 0-10 vira -1 (inválido). */
function lerNota(texto) {
  const t = texto.trim().replace(",", ".");
  if (t === "") return NaN;
  const n = Number(t);
  return Number.isNaN(n) || n < 0 || n > REGRAS.notaMaxima ? -1 : n;
}

function avaliar(notas) {
  const media = notas.reduce((a, b) => a + b, 0) / notas.length;
  if (media >= REGRAS.mediaAprovacao) return { status: "aprovado", media };
  const { mediaFinalMinima: m, pesoMediaAnual: pa, pesoRecuperacao: pr, notaMaxima } = REGRAS;
  const necessaria = (m * (pa + pr) - media * pa) / pr;
  return necessaria > notaMaxima
    ? { status: "reprovado", media }
    : { status: "recuperacao", media, necessaria };
}

function mostrar({ status, media, titulo, texto }) {
  document.body.dataset.status = status;
  $("media").textContent = media == null ? "–" : fmt(media);
  $("arco").style.strokeDashoffset = CIRC * (1 - (media ?? 0) / REGRAS.notaMaxima);
  $("titulo").textContent = titulo;
  $("texto").textContent = texto;
  if (status === "aprovado" && statusAnterior !== "aprovado") confete();
  statusAnterior = status;
}

function atualizar() {
  const valores = campos.map((c) => lerNota(c.value));
  campos.forEach((c, i) => c.setAttribute("aria-invalid", valores[i] === -1));

  if (valores.includes(-1)) {
    return mostrar({ status: "idle", titulo: "Nota inválida", texto: `Use valores de 0 a ${REGRAS.notaMaxima}. Exemplo: 7,5.` });
  }

  const preenchidas = valores.filter((v) => !Number.isNaN(v));
  const materia = $("materia").value.trim();
  const sufixo = materia ? ` em ${materia}` : "";

  if (preenchidas.length === 0) {
    return mostrar({ status: "idle", titulo: "Digite suas notas", texto: "O medidor mostra sua média. A linha marca o 7, nota para passar direto." });
  }

  if (preenchidas.length < valores.length) {
    const mediaParcial = preenchidas.reduce((a, b) => a + b, 0) / preenchidas.length;
    let texto = "Preencha os três bimestres para ver o resultado final.";
    if (preenchidas.length === valores.length - 1) {
      const falta = valores.indexOf(NaN) + 1;
      const precisa = REGRAS.mediaAprovacao * valores.length - preenchidas.reduce((a, b) => a + b, 0);
      texto = precisa <= 0
        ? `Você já passa direto${sufixo}, qualquer que seja a nota do ${falta}º bimestre.`
        : precisa <= REGRAS.notaMaxima
          ? `Para passar direto${sufixo}, tire ${fmt(precisa)} no ${falta}º bimestre.`
          : `Passar direto${sufixo} não é mais possível, mas ainda dá para fechar na recuperação.`;
    }
    return mostrar({ status: "idle", media: mediaParcial, titulo: "Média parcial", texto });
  }

  const r = avaliar(valores);
  if (r.status === "aprovado") {
    mostrar({ ...r, titulo: "Aprovado! 🎉", texto: `Média ${fmt(REGRAS.mediaAprovacao)} ou mais${sufixo}. Sem recuperação.` });
  } else if (r.status === "recuperacao") {
    mostrar({ ...r, titulo: "Recuperação", texto: `Você precisa de ${fmt(r.necessaria)} na prova${sufixo} para fechar com média final ${fmt(REGRAS.mediaFinalMinima)}.` });
  } else {
    mostrar({ ...r, titulo: "Situação difícil", texto: `Nem 10 na recuperação${sufixo} chegaria à média ${fmt(REGRAS.mediaFinalMinima)}. Converse com a coordenação.` });
  }
}

/* Texto e slider andam juntos */
campos.forEach((campo, i) => {
  campo.addEventListener("input", () => {
    const n = lerNota(campo.value);
    sliders[i].value = n >= 0 ? n : 0;
    atualizar();
  });
});
sliders.forEach((s, i) => {
  s.addEventListener("input", () => {
    campos[i].value = fmt(Number(s.value)).replace(/(,\d)0$/, "$1");
    atualizar();
  });
});
$("materia").addEventListener("input", atualizar);
$("limpar").addEventListener("click", () => {
  $("form").reset();
  statusAnterior = "idle";
  atualizar();
});

/* Confete leve, desligado para quem prefere menos movimento */
function confete() {
  if (reduzMovimento) return;
  const cv = $("confete");
  const ctx = cv.getContext("2d");
  cv.width = innerWidth;
  cv.height = innerHeight;
  const cores = ["#3df5a7", "#38d9f5", "#8b7bff", "#ffc247", "#ff5c7a"];
  const peças = Array.from({ length: 110 }, () => ({
    x: cv.width / 2, y: cv.height * 0.35,
    vx: (Math.random() - 0.5) * 16, vy: -Math.random() * 14 - 3,
    s: 5 + Math.random() * 6, r: Math.random() * 6, cor: cores[(Math.random() * cores.length) | 0],
  }));
  let frames = 0;
  (function quadro() {
    ctx.clearRect(0, 0, cv.width, cv.height);
    peças.forEach((p) => {
      p.vy += 0.35; p.x += p.vx; p.y += p.vy; p.r += 0.2;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r);
      ctx.fillStyle = p.cor; ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); ctx.restore();
    });
    if (++frames < 130) requestAnimationFrame(quadro);
    else ctx.clearRect(0, 0, cv.width, cv.height);
  })();
}

$("regra").textContent =
  `Regra: média das três notas ≥ ${fmt(REGRAS.mediaAprovacao)} aprova direto. Abaixo disso, a média final é ` +
  `(média anual × ${REGRAS.pesoMediaAnual} + recuperação × ${REGRAS.pesoRecuperacao}) ÷ ${REGRAS.pesoMediaAnual + REGRAS.pesoRecuperacao} ` +
  `e precisa ser ao menos ${fmt(REGRAS.mediaFinalMinima)}.`;
