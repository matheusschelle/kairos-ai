# Relatório — Consolidação Kairos AI (10/07/2026)

## TL;DR
- **Link único que você usa daqui pra frente:** **https://matheusschelle.github.io/kairos-ai/** (GitHub Pages).
- **Aposente o Netlify** (`kairos-ai-jarvis.netlify.app`): ele está **congelado em v25** desde 02/jul porque os créditos de build acabaram. É a fonte da sua confusão de "versões diferentes".
- **Voz:** agora dá pra usar **voz nativa do Brasil** (natural, sem sotaque) via ElevenLabs — botão novo nas Configurações.
- **Login:** o login de verdade na nuvem (Supabase, cross-device) **já existia**; eu adicionei o que faltava: **ver o e-mail logado, trocar senha, sair, e "esqueci a senha"**.

---

## 1. Auditoria — o que JÁ estava pronto no código mais novo (v25)
Seu clone local estava velho (v20, 20/jun). Sincronizei pro `master` real (estava **21 commits à frente**) sem empurrar nada velho. No latest **já existia e funciona**:

| Área | Estado | Detalhe |
|---|---|---|
| **Login na nuvem** | ✅ Pronto | Supabase Auth real (projeto `faajowrdwfffoicakaax.supabase.co`), e-mail+senha, **cross-device** (sessão persiste em qualquer aparelho). |
| **2FA** | ✅ Pronto | TOTP (app autenticador), enroll/verify. |
| **Cofre (PIN)** | ✅ Pronto | Suas chaves de API ficam cifradas por um PIN local + código de resgate. |
| **Voz grátis** | ✅ Pronto | Cascata Google TTS (pt-BR) → StreamElements (Vitória) → voz do aparelho. Natural-ish, mas **robótica**. |
| **Voz ElevenLabs** | ⚠️ Existia, mas ruim | Caía na voz **Rachel (americana)** com modelo `turbo` → sotaque "de alienígena". Era exatamente sua reclamação. |
| **Alexa / UI / agente** | ✅ Pronto | Painel Alexa, redesign neural, chat com agente. |

**Conclusão da auditoria:** o login cross-device **não precisava ser reconstruído** — só faltavam as telas de *gerenciar* a conta. A voz é que precisava de fato do ajuste pra ficar natural em pt-BR.

---

## 2. Voz — o que mudou (v26)
Aplicado **sobre o latest**, sem tocar na cascata grátis:
- Modelo ElevenLabs: `turbo_v2_5` → **`multilingual_v2`** (fala muito mais natural em pt-BR). Turbo virou só fallback.
- Ajuste fino: `stability 0.45 / similarity 0.9 / style 0 / speaker_boost` = som humano, sem robô.
- **Botão novo "🇧🇷 Buscar vozes brasileiras (naturais)"** em Configurações › Voz:
  - Busca ao vivo as vozes **nativas do Brasil** na biblioteca da ElevenLabs (`/v1/shared-voices`), filtrando só as que o plano free permite.
  - **Prévia é grátis** (não gasta crédito): toca a amostra da voz.
  - Ao **escolher**, a voz é instalada na sua conta ElevenLabs e passa a ser usada.
- A voz padrão deixou de ser a Rachel (americana). A UI avisa que as vozes "gringas" falam português com sotaque.

**Como usar:** Configurações → seção Voz → toque **🇧🇷 Buscar vozes brasileiras** → escolha uma (ex.: Sandro, Ana, Rafael, Roberta) → **Ouvir** pra testar → pronto, o agente fala com ela.

> ⚠️ **Preciso que você confirme no aparelho** (não tenho sua chave ElevenLabs aqui): abrir, buscar as vozes BR, ouvir e falar com o agente. É o único passo que depende da sua chave.

---

## 3. Login — o que eu adicionei (v26)
O núcleo (login cross-device) já existia. Faltava **gerenciar**, e era isso que você pediu:

**Configurações › nova seção "🔐 Sua conta":**
- **Mostra o e-mail logado** — pra você sempre saber *qual* conta está usando.
- **Trocar senha** — define uma senha nova (mín. 8, confirma) e vale em qualquer aparelho.
- **Sair** — logout (2 toques pra confirmar).

**Tela de login:**
- **"Esqueci minha senha"** → envia um link de recuperação por e-mail (usa o Resend configurado no Supabase). Ao clicar no link, o app pede a nova senha e entra.

**Fluxo do celular novo:** abre o link → entra com e-mail + senha (o mesmo de sempre) → 2FA se ativado → digita o PIN do cofre → falando com o agente. Mesma conta, qualquer lugar.

> ⚠️ **2 ajustes no painel do Supabase** (não tenho acesso ao seu dashboard) pra "esqueci a senha" funcionar 100%:
> 1. **Authentication → URL Configuration → Redirect URLs:** incluir `https://matheusschelle.github.io/kairos-ai/` (e qualquer domínio que você use).
> 2. **Authentication → SMTP:** confirmar que o **Resend** está setado como servidor de e-mail (pra os e-mails de reset/confirmação saírem de verdade).

---

## 4. Deploys — canônico e como aposentar o outro

**Por que GitHub Pages é o canônico:**
- Atualiza **de graça e na hora** a cada push (já está em v26).
- O Netlify (`kairos-ai-jarvis`) é **git-connected ao mesmo repo**, mas os builds **falham desde 02/jul** com `"Skipped due to account credit usage exceeded"`. Ele ficou preso no v25 e **não atualiza** (nem push nem deploy manual — dá "Forbidden"). É por isso que os dois links pareciam "contas/versões diferentes": um estava novo, o outro velho.

**Como aposentar o Netlify (escolha um):**
- **Recomendado:** app.netlify.com → site `kairos-ai-jarvis` → **Site configuration → Danger zone → Delete site** (ou "Stop builds"). Assim ele para de servir a versão velha.
- Ou simplesmente **pare de usar** o link `kairos-ai-jarvis.netlify.app`.
- (Se um dia quiser o Netlify de volta pela URL mais bonita + headers de microfone: ele volta a buildar sozinho quando os créditos resetarem no próximo ciclo, ou num plano pago. Aí seria só reapontar.)

**Observação técnica:** o Netlify tinha os headers `Permissions-Policy: microphone=*` e `COOP`. No GitHub Pages não dá pra setar headers, mas: o **microfone funciona** num PWA HTTPS de topo (é como você já vinha usando), e o login é e-mail+senha (não usa popup OAuth, que seria o único caso que precisaria do COOP). Sem impacto prático.

---

## 5. Estado do repositório
- Tudo commitado e no `master` (`origin/matheusschelle/kairos-ai`). Sem force-push.
- Commits: `752f316` (voz BR) e `22ff04d` (gerenciamento de conta), em cima do latest `4753495`.
- Build atual: **v26 · 10/07 · voz BR** (confere em Configurações, no rodapé).
- Branch `backup-v21-stale` guarda meu 1º commit (feito sobre o v20 velho, **descartado** — não foi pro ar).

## 6. O que falta VOCÊ fazer
1. Testar a **voz BR** no app (com sua chave ElevenLabs).
2. No **Supabase**: adicionar o Redirect URL do GitHub Pages + confirmar o SMTP (Resend).
3. **Aposentar o Netlify** (deletar/parar builds) e usar só: **https://matheusschelle.github.io/kairos-ai/**
4. No celular/PC: se aparecer versão velha, toque no botão **Atualizar** (limpa cache do PWA) — ou ele pega o v26 sozinho no próximo load.
