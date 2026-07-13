# Kairos — Schema de Tema do Terminal ao Vivo (v1)

Um **tema** é um objeto JSON que descreve **toda** a aparência e o comportamento
visual do terminal ao vivo (modo cinema do Maestro). O renderizador
(`TermFX` + `KairosTheme`, em `index.html`) lê o objeto e monta o terminal a
partir dele. **Trocar de tema = trocar o objeto. Zero código novo por tema.**

Esta é a fundação do produto: no futuro, qualquer usuário cria/importa/compartilha
um tema — é só um JSON.

## Objeto completo (com defaults)

```json
{
  "schema": 1,
  "id": "matrix",
  "name": "Matrix",
  "author": "Kairos",

  "colors": {
    "bg": "#000000",
    "fg": "#00ff41",
    "dim": "#1fae4f",
    "accent": "#86ffb0",
    "ok": "#00ff41",
    "err": "#ff4d4d",
    "warn": "#ffd24a",
    "kinds": {
      "user":  "#aef7c4",
      "tool":  "#00d938",
      "think": "#2fbf6b",
      "done":  "#7dffa8",
      "error": "#ff6b6b",
      "start": "#45e07a"
    }
  },

  "font":   { "family": "'Courier New',ui-monospace,Menlo,Consolas,monospace",
              "size": 13, "lineHeight": 1.55, "weight": 500 },
  "glow":   { "enabled": true, "blur": 8, "strength": 0.85 },
  "cursor": { "char": "█", "blinkMs": 530 },
  "prompt": "> ",
  "typing": { "cps": 42, "jitter": 0.3 },

  "scanlines": { "enabled": true, "opacity": 0.10, "spacing": 3 },
  "flicker":   { "enabled": false, "amount": 0.04 },

  "backdrop": {
    "effect": "matrix-rain",
    "color": "#00ff41",
    "glyphs": "katakana",
    "density": 0.75,
    "speed": 1.0,
    "fade": 0.08,
    "opacity": 0.45
  },

  "hud": {
    "borderColor": "rgba(0,255,65,.3)",
    "background": "rgba(0,10,2,.55)",
    "statusColors": { "running": "#ffd24a", "done": "#00ff41",
                      "error": "#ff4d4d", "idle": "#5c6470" }
  },

  "fx": {
    "successFlash": { "enabled": true, "color": "#00ff41", "durationMs": 900 },
    "errorFlash":   { "enabled": true, "color": "#ff4d4d", "durationMs": 900 }
  },

  "sound": { "enabled": false, "blipHz": 880, "okHz": 660, "errHz": 180, "gain": 0.03 },

  "neural": {
    "node": "#00ff41", "node2": "#86ffb0", "node3": "#1fae4f",
    "link": "#1fae4f", "axon": "#00d938", "spark": "#b4ffcf",
    "halo": "#0d7a35", "soma": "#eafff2", "accent": "#86ffb0"
  }
}
```

## Campos

| Campo | O que controla |
|---|---|
| `schema` | Versão do schema (hoje `1`). Import rejeita versões diferentes. |
| `id`, `name`, `author` | Identidade do tema (marketplace-ready). |
| `colors.*` | Fundo, texto, dim (timestamps), accent (título), estados. |
| `colors.kinds.*` | Cor por tipo de evento do Maestro (`user`, `tool`, `think`, `done`, `error`, `start`). |
| `font` | Família (monospace), tamanho px, entrelinha, peso. |
| `glow` | Bloom do texto (text-shadow): raio `blur` px e força 0–1. |
| `cursor` | Caractere do cursor bloco e período do piscar (ms). |
| `prompt` | Prefixo digitado em cada linha (`> `). |
| `typing.cps` | Velocidade da digitação (chars/segundo). Acelera sozinho se a fila cresce. |
| `scanlines` | Linhas CRT: opacidade e espaçamento px. |
| `flicker` | Tremida de fósforo (CRT). `amount` = queda de opacidade 0–0.2. |
| `backdrop.effect` | Nome do efeito de fundo no **registro extensível** `TermFX.backdrops` (`matrix-rain`, `neural`, `none`; futuros: registrar factory nova). |
| `neural.*` | **Opcional** — paleta da REDE NEURAL do app (fundo ambiente + mapa da Central + efeito `neural` do cinema). Chaves: `node/node2/node3` (nós), `link` (conexões), `axon` (dendritos), `spark` (faíscas/pulsos), `halo`, `soma` (núcleo), `accent`. O que faltar deriva das cores do próprio tema — um tema "só de cores" já ganha rede neural coerente de graça. |
| `backdrop.glyphs` | `katakana`, `binary` ou string custom de caracteres. |
| `backdrop.density/speed/fade/opacity` | Colunas, velocidade, trilha e opacidade do canvas. |
| `hud` | Borda/fundo dos painéis (status+timer em cima, modelo+custo embaixo) e cor do LED por status. |
| `fx.successFlash/errorFlash` | Flash de tela ao concluir/errar. |
| `sound` | Som opcional (blip por linha + tom de sucesso/erro, WebAudio). Builtins vêm `enabled:false`. |

Todo campo é **opcional** — o tema é deep-merged sobre os defaults. Valores
inválidos são corrigidos: cores validadas via `CSS.supports('color', …)`,
números clampados, strings sanitizadas (um tema importado não injeta CSS/JS).

## Como o terminal renderiza a partir do objeto

1. `KairosTheme.resolve(tema)` → merge com defaults + validação.
2. `KairosTheme.applyVars(tema, el)` → converte o objeto em variáveis CSS
   `--ct-*` no overlay (`#cineTerm`). Todo o CSS do terminal referencia
   **apenas** essas variáveis — nenhuma cor/fonte hardcoded.
3. O efeito de fundo é escolhido por **nome** no registro `TermFX.backdrops`
   e recebe os parâmetros do tema (canvas 2D leve, ~30fps, DPR limitado,
   auto-degradação de densidade se o frame ficar caro).
4. Tipografia, cursor, velocidade de digitação, flashes e som saem direto do
   objeto em runtime.

## API pública (base do futuro marketplace)

```js
KairosTheme.list()        // [{id, name, author, builtin}]
KairosTheme.get(id)       // tema resolvido
KairosTheme.set(id)       // ativa + persiste + aplica ao vivo
KairosTheme.import(json)  // valida, salva como tema custom, aparece no seletor
KairosTheme.export(id)    // JSON completo pronto pra compartilhar
KairosTheme.remove(id)    // remove tema custom
```

Fluxo futuro de compartilhamento: usuário A `export()` → manda o JSON (link,
QR, marketplace) → usuário B `import()` → o tema aparece no seletor das
Configurações. Nada disso exige mudança na engine.

## Onde fica

- Engine + temas builtin (`matrix`, `amber`, `neon`): segundo `<script>` no
  final de `index.html`.
- Temas custom: `localStorage` chave `kairos_term_custom`.
- Tema ativo: `kairos_term_theme`. Animação de fundo on/off: `kairos_term_fx`.
