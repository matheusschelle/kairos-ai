# CONTEXTO KAIROS — memória do projeto

> Este arquivo é a memória do projeto. O Maestro LÊ este arquivo antes de mexer no app.
> Pode editar à vontade — é texto simples, sem código. Mantenha curto e atual.

## O que é

**Kairos Digital** é o estúdio do Matheus Schelle (Guarujá/SP): sites premium, agentes de IA e automação para clientes. O **Kairos AI** (este repo) é o PWA de voz que comanda tudo — funciona no celular, publicado em https://matheusschelle.github.io/kairos-ai via GitHub Pages (branch master, arquivo único `index.html`).

## Os 3 agentes (abas do app)

| Agente | O que é | Custo |
|---|---|---|
| **Kairos** | Conversa normal (Groq, chave do usuário). Voz: Whisper transcreve, ElevenLabs/vozes grátis respondem. | grátis |
| **Openclaw** | Agente na VPS via ngrok (`python-roving-distance.ngrok-free.dev`). Gemini 2.5 Flash. NUNCA mexer na URL/túnel dele. | grátis |
| **Maestro** | Voz→terminal na VPS. Claude Code headless roda tarefas no sandbox `/root/maestro-sandbox`. URL fixa: `https://kairos-maestro.tail250cee.ts.net` (Tailscale Funnel). Threads por tarefa com `--resume`. Modelo padrão **haiku** (barato); opus/fable só se pedido na fala. | centavos |

A 4ª aba **Central** é o dashboard (status, custo do dia, tarefas ao vivo, mapa).

## Decisões de arquitetura (não desfazer sem motivo)

- **App = 1 arquivo** `index.html` (PWA estático, service worker network-first). Sem framework, sem build step. Todo JS inline.
- **Temas**: engine `window.KairosTheme` — tema = objeto JSON (ver `THEME_SCHEMA.md`). Aparência do Terminal Cinema vem 100% de variáveis CSS `--ct-*`. Nunca hard-codar cor nova no terminal: passa pelo tema.
- **Terminal Cinema**: `window.TermFX`, camada 100% visual (só observa as threads, nunca muda lógica). Efeitos de fundo são plugáveis: `TermFX.backdrops['nome']`.
- **Fundo neural**: `window.NeuralBG` (canvas 2D, paleta vem do tema ativo, pulsa quando o Maestro trabalha). Performance mobile é requisito: cap de FPS, pausa quando oculto, respeita reduced-motion.
- **Maestro edita este repo** pelo fluxo devops: branch de preview → build-check → link de preview → produção SÓ com a frase falada "pode publicar". Rollback: "volta pro anterior". Nunca commit direto no master, nunca force-push.
- **Chaves/segredos NUNCA no código nem no git** — sempre em Configurações (localStorage do aparelho), opcionalmente cifradas no cofre Supabase (PIN).
- Login: Supabase Auth (e-mail+senha+2FA TOTP+PIN). Erros sempre em PT-BR simples.

## Red lines (proibido)

1. Quebrar o fluxo de voz, threads, kill-switch, publicar/descartar/rollback.
2. Mexer no túnel/URL do Openclaw (ngrok) ou em `/root/kairos3` na VPS.
3. Executor do Maestro fora do sandbox (exceto o fluxo devops deste repo).
4. Segredo/token em código ou git.
5. Performance no celular: nada de lib pesada pra efeito visual; canvas 2D com degradação automática.
6. Force-push. Produção sem confirmação falada.

## Estado atual (atualize ao publicar)

- Versão: veja `APP_BUILD` no index.html.
- Últimas grandes entregas: threads por tarefa + Central (v30), URL fixa Tailscale (v31), Maestro edita o app por voz (v32), Terminal Cinema + temas (v33).
