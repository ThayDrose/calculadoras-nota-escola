# 📊 Vou passar? Calculadora de Média e Recuperação

Calculadora web que mostra, em tempo real, se o aluno está **aprovado direto**, em **recuperação** ou em situação crítica, e informa a **nota mínima necessária na prova de recuperação**. Criada para uso na escola, com foco em clareza, acessibilidade e boa experiência no celular.

🔗 **Demo:** https://thaydrose.github.io/NOME-DO-REPOSITORIO/

---

## ✨ Funcionalidades

- **Resultado instantâneo:** sem botão de calcular. O resultado muda enquanto o aluno digita ou arrasta o controle deslizante.
- **Medidor circular:** exibe a média anual, com uma marca na nota de aprovação.
- **Tema por situação:** verde (aprovado), âmbar (recuperação) e vermelho (situação crítica).
- **Simulação:** com duas notas preenchidas, informa quanto falta tirar no bimestre restante para passar direto.
- **Confete** ao ser aprovado (desativado para quem prefere movimento reduzido).
- **Aceita vírgula ou ponto** nas notas (`7,5` ou `7.5`).
- **Responsivo** e com boa leitura em telas pequenas.
- **Acessível:** navegação por teclado, foco visível, resultado anunciado por leitores de tela e respeito a `prefers-reduced-motion`.

## 📐 Regra de cálculo

| Situação | Condição |
| --- | --- |
| Aprovado direto | Média anual (média das 3 notas) ≥ **7,0** |
| Recuperação | Média anual < 7,0 e nota necessária ≤ 10 |
| Situação crítica | Nem 10 na recuperação alcança a média final mínima |

Quando a média anual é menor que 7,0, a média final é:

```
Média final = (Média anual × 3 + Nota da recuperação × 2) ÷ 5
```

E precisa ser de, no mínimo, **5,0**. Assim, a nota necessária na recuperação é:

```
Nota necessária = (25 − Média anual × 3) ÷ 2
```

> ⚠️ Confirme os valores com o regimento da sua escola. Se forem diferentes, veja a seção de personalização abaixo.

## 🛠️ Tecnologias

- HTML5 semântico
- CSS3 (variáveis, Grid, Flexbox, `backdrop-filter`, animações)
- JavaScript puro (ES6+), sem dependências nem etapa de build
- Fonte [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) (Google Fonts)

## 📁 Estrutura

```
.
├── index.html   # estrutura da página
├── styles.css   # visual e responsividade
└── script.js    # regras de cálculo e interações
```

Os três arquivos devem ficar **na mesma pasta**.

## 🚀 Como executar

**Localmente:** baixe ou clone o repositório e abra o `index.html` no navegador (ou use a extensão Live Server do VS Code).

```bash
git clone https://github.com/ThayDrose/NOME-DO-REPOSITORIO.git
cd NOME-DO-REPOSITORIO
```

**No GitHub Pages:** em *Settings → Pages*, escolha *Deploy from a branch*, selecione a branch `main` e a pasta `/ (root)`.

## ⚙️ Personalização

As regras ficam em um único objeto no início do `script.js`:

```js
const REGRAS = {
  mediaAprovacao: 7,     // média anual para aprovar direto
  mediaFinalMinima: 5,   // média final mínima após a recuperação
  pesoMediaAnual: 3,     // peso da média anual na média final
  pesoRecuperacao: 2,    // peso da prova de recuperação
  notaMaxima: 10,
};
```

O texto da regra no rodapé é gerado a partir desses valores e se atualiza sozinho.

## 👩‍💻 Autora

Desenvolvido por **Thayane Dröse**.

---

⭐ Se o projeto foi útil, deixe uma estrela no repositório!
