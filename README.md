# Kairos AI — Assistente de voz (PWA)

Assistente pessoal de voz estilo Jarvis para a **Kairos Digital**, em PWA single-file (HTML/CSS/JS puro, zero frameworks).

**Live:** https://kairos-ai-jarvis.netlify.app

## Funcionalidades
- 🔌 **Online/Offline** — liga/desliga o agente (boot).
- 👂 **Escuta 24h** — microfone ambiente contínuo; reage proativamente por voz.
- 🗣️ **Voz bidirecional** — STT (Groq Whisper) + TTS (SpeechSynthesis nativa).
- 🤖 **Proatividade** — quando online, o agente puxa conversa sozinho.
- 🎧 **Controle do Fone** — testar voz/microfone e **Modo Mãos-livres** (conversa contínua pelo fone, com detecção de silêncio).
- 📱 **Modo Bolso** — tela inerte ao toque; destrava segurando 3s.
- 🔐 **Login** local com "manter conectado".
- 💬 Sessões com sidebar + memória cross-sessão.

## Stack
- HTML/CSS/JS puro (sem build).
- [Groq API](https://console.groq.com) — STT `whisper-large-v3-turbo`, LLM `llama-3.3-70b-versatile`.
- SpeechSynthesis API (TTS), MediaRecorder, localStorage.
- Deploy estático (Netlify).

## Configuração
A chave Groq **não** fica no código — é inserida em Configurações e guardada só no aparelho (localStorage).

## Rodar local
Qualquer servidor estático, ex.:
```bash
npx serve .
```

## Limites no iOS
O Safari não grava o microfone com o app fechado ou a tela bloqueada — a escuta 24h funciona com o app aberto em primeiro plano (há wake lock pra manter a tela acesa). Para escuta verdadeiramente em background, é necessário um app nativo.
