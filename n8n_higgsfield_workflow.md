# 🔗 n8n — Pipeline Automatizado FéTok

> Workflow completo: **Midjourney → Higgsfield → ElevenLabs → CapCut API → TikTok/Instagram**
> Rode o pipeline inteiro com 1 clique ou agendado via cron.

---

## 🏗️ Arquitetura do workflow

```
┌─────────────────┐
│  1. TRIGGER     │ Cron (02:00 diário) ou Webhook manual
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 2. LEITOR       │ Lê roteiro do JSON (3 roteiros disponíveis)
│    ROTEIRO      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 3. MIDJOURNEY   │ Gera 12 keyframes via API (loop)
│    BATCH        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 4. UPSCALE      │ Upscale U1-U4 das melhores variações
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 5. HIGGSFIELD   │ Anima 9 shots com DoP presets
│    I2V BATCH    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 6. ELEVENLABS   │ Gera narração PT-BR (3 variações stability)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 7. FFMPEG       │ Junta shots + áudio + legendas + trilha
│    MERGE        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 8. UPLOAD       │ TikTok Business API + Meta Graph (Reels)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 9. NOTIFY       │ Slack/Discord webhook com link do post
└─────────────────┘
```

---

## 🔐 Credenciais necessárias (.env)

```bash
# Midjourney (via ImagineAPI ou useapi.net)
MIDJOURNEY_API_KEY=sk_live_xxx
MIDJOURNEY_ENDPOINT=https://api.imagineapi.dev/items/images

# Higgsfield
HIGGSFIELD_API_KEY=hf_xxx
HIGGSFIELD_ENDPOINT=https://api.higgsfield.ai/v1/generate

# ElevenLabs
ELEVENLABS_API_KEY=sk_xxx
ELEVENLABS_VOICE_ID=pNInz6obpgDQGcFmaJgB  # Adam PT-BR

# TikTok Business
TIKTOK_ACCESS_TOKEN=xxx
TIKTOK_OPEN_ID=xxx

# Meta / Instagram
META_ACCESS_TOKEN=xxx
IG_BUSINESS_ACCOUNT_ID=xxx

# Notificação
SLACK_WEBHOOK_URL=https://hooks.slack.com/xxx
```

---

## 📄 Roteiros JSON (data source)

Crie `data/roteiros.json`:

```json
{
  "roteiros": [
    {
      "id": "pescador",
      "nome": "O Milagre do Pescador",
      "versiculo": "Salmos 126:5",
      "duracao": 42,
      "shots": [
        {
          "ordem": 1,
          "duracao": 1.5,
          "prompt_mj": "Extreme close-up weathered fisherman eye, single tear...",
          "higgsfield_preset": "crash_zoom_in",
          "higgsfield_mode": "turbo"
        },
        {
          "ordem": 2,
          "duracao": 5,
          "prompt_mj": "Exhausted biblical fisherman kneeling on empty boat...",
          "higgsfield_preset": "super_dolly_out",
          "higgsfield_mode": "standard"
        }
      ],
      "narracao": "Ele orou por quarenta dias. A rede continuou vazia...",
      "legenda": "A rede vazia não é o fim da história...",
      "hashtags": "#jesus #fé #deus #biblia #versiculododia",
      "cta": "Comenta AMÉM 🙏",
      "trilha_base": "epidemic_piano_build_001",
      "trilha_drop": "epidemic_choir_epic_hallelujah_007"
    }
  ]
}
```

---

## 🧩 Workflow n8n (JSON importável)

Salve como `n8n_workflow_fetok.json` e importe no n8n:

```json
{
  "name": "FéTok Autoposter Pipeline",
  "nodes": [
    {
      "parameters": {
        "rule": {
          "interval": [{"field": "hours", "hoursInterval": 8}]
        }
      },
      "name": "Cron Trigger",
      "type": "n8n-nodes-base.scheduleTrigger",
      "position": [250, 300]
    },
    {
      "parameters": {
        "filePath": "/data/roteiros.json"
      },
      "name": "Read Roteiro JSON",
      "type": "n8n-nodes-base.readBinaryFile",
      "position": [450, 300]
    },
    {
      "parameters": {
        "batchSize": 3,
        "options": {}
      },
      "name": "Split Shots",
      "type": "n8n-nodes-base.splitInBatches",
      "position": [650, 300]
    },
    {
      "parameters": {
        "method": "POST",
        "url": "={{$env.MIDJOURNEY_ENDPOINT}}",
        "authentication": "genericCredentialType",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {"name": "Authorization", "value": "=Bearer {{$env.MIDJOURNEY_API_KEY}}"},
            {"name": "Content-Type", "value": "application/json"}
          ]
        },
        "sendBody": true,
        "bodyParameters": {
          "parameters": [
            {"name": "prompt", "value": "={{$json.prompt_mj}} --ar 9:16 --v 7 --style raw --s 250"}
          ]
        }
      },
      "name": "Midjourney Generate",
      "type": "n8n-nodes-base.httpRequest",
      "position": [850, 300]
    },
    {
      "parameters": {
        "amount": 60,
        "unit": "seconds"
      },
      "name": "Wait MJ",
      "type": "n8n-nodes-base.wait",
      "position": [1050, 300]
    },
    {
      "parameters": {
        "method": "GET",
        "url": "=https://api.imagineapi.dev/items/images/{{$json.id}}",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {"name": "Authorization", "value": "=Bearer {{$env.MIDJOURNEY_API_KEY}}"}
          ]
        }
      },
      "name": "Poll MJ Status",
      "type": "n8n-nodes-base.httpRequest",
      "position": [1250, 300]
    },
    {
      "parameters": {
        "method": "POST",
        "url": "=https://api.higgsfield.ai/v1/dop/generate",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {"name": "Authorization", "value": "=Bearer {{$env.HIGGSFIELD_API_KEY}}"}
          ]
        },
        "sendBody": true,
        "bodyParameters": {
          "parameters": [
            {"name": "image_url", "value": "={{$json.upscaled_url}}"},
            {"name": "motion_preset", "value": "={{$json.higgsfield_preset}}"},
            {"name": "mode", "value": "={{$json.higgsfield_mode}}"},
            {"name": "duration", "value": "5"},
            {"name": "aspect_ratio", "value": "9:16"},
            {"name": "motion_strength", "value": "0.75"}
          ]
        }
      },
      "name": "Higgsfield Animate",
      "type": "n8n-nodes-base.httpRequest",
      "position": [1450, 300]
    },
    {
      "parameters": {
        "amount": 90,
        "unit": "seconds"
      },
      "name": "Wait Higgsfield",
      "type": "n8n-nodes-base.wait",
      "position": [1650, 300]
    },
    {
      "parameters": {
        "method": "GET",
        "url": "=https://api.higgsfield.ai/v1/jobs/{{$json.job_id}}"
      },
      "name": "Poll Higgsfield",
      "type": "n8n-nodes-base.httpRequest",
      "position": [1850, 300]
    },
    {
      "parameters": {
        "method": "POST",
        "url": "=https://api.elevenlabs.io/v1/text-to-speech/{{$env.ELEVENLABS_VOICE_ID}}",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {"name": "xi-api-key", "value": "={{$env.ELEVENLABS_API_KEY}}"},
            {"name": "Content-Type", "value": "application/json"}
          ]
        },
        "sendBody": true,
        "bodyParameters": {
          "parameters": [
            {"name": "text", "value": "={{$json.narracao}}"},
            {"name": "model_id", "value": "eleven_multilingual_v2"},
            {"name": "voice_settings", "value": "={\"stability\":0.45,\"similarity_boost\":0.75,\"style\":0.30}"}
          ]
        }
      },
      "name": "ElevenLabs Narrate",
      "type": "n8n-nodes-base.httpRequest",
      "position": [2050, 300]
    },
    {
      "parameters": {
        "command": "node /scripts/merge_video.js {{$json.shots_dir}} {{$json.audio_path}} {{$json.output_path}}"
      },
      "name": "FFmpeg Merge",
      "type": "n8n-nodes-base.executeCommand",
      "position": [2250, 300]
    },
    {
      "parameters": {
        "method": "POST",
        "url": "https://open.tiktokapis.com/v2/post/publish/video/init/",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {"name": "Authorization", "value": "=Bearer {{$env.TIKTOK_ACCESS_TOKEN}}"}
          ]
        },
        "sendBody": true,
        "bodyParameters": {
          "parameters": [
            {"name": "post_info", "value": "={\"title\":\"{{$json.legenda}}\",\"privacy_level\":\"PUBLIC_TO_EVERYONE\"}"},
            {"name": "source_info", "value": "={\"source\":\"FILE_UPLOAD\",\"video_size\":{{$json.file_size}},\"chunk_size\":{{$json.file_size}}}"}
          ]
        }
      },
      "name": "Upload TikTok",
      "type": "n8n-nodes-base.httpRequest",
      "position": [2450, 300]
    },
    {
      "parameters": {
        "webhookUrl": "={{$env.SLACK_WEBHOOK_URL}}",
        "text": "=✅ FéTok post publicado: {{$json.post_url}}"
      },
      "name": "Slack Notify",
      "type": "n8n-nodes-base.slack",
      "position": [2650, 300]
    }
  ],
  "connections": {
    "Cron Trigger": {"main": [[{"node": "Read Roteiro JSON", "type": "main", "index": 0}]]},
    "Read Roteiro JSON": {"main": [[{"node": "Split Shots", "type": "main", "index": 0}]]},
    "Split Shots": {"main": [[{"node": "Midjourney Generate", "type": "main", "index": 0}]]},
    "Midjourney Generate": {"main": [[{"node": "Wait MJ", "type": "main", "index": 0}]]},
    "Wait MJ": {"main": [[{"node": "Poll MJ Status", "type": "main", "index": 0}]]},
    "Poll MJ Status": {"main": [[{"node": "Higgsfield Animate", "type": "main", "index": 0}]]},
    "Higgsfield Animate": {"main": [[{"node": "Wait Higgsfield", "type": "main", "index": 0}]]},
    "Wait Higgsfield": {"main": [[{"node": "Poll Higgsfield", "type": "main", "index": 0}]]},
    "Poll Higgsfield": {"main": [[{"node": "ElevenLabs Narrate", "type": "main", "index": 0}]]},
    "ElevenLabs Narrate": {"main": [[{"node": "FFmpeg Merge", "type": "main", "index": 0}]]},
    "FFmpeg Merge": {"main": [[{"node": "Upload TikTok", "type": "main", "index": 0}]]},
    "Upload TikTok": {"main": [[{"node": "Slack Notify", "type": "main", "index": 0}]]}
  }
}
```

---

## 🚀 Setup rápido (5 passos)

### 1. Instalar n8n (local ou Docker)
```bash
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  -v $(pwd)/data:/data \
  -v $(pwd)/scripts:/scripts \
  --env-file .env \
  n8nio/n8n
```

### 2. Importar workflow
- Abra `http://localhost:5678`
- **Workflows → Import from File** → selecione `n8n_workflow_fetok.json`

### 3. Configurar credentials
No n8n: **Credentials → New** para cada API (Midjourney, Higgsfield, ElevenLabs, TikTok, Meta)

### 4. Copiar roteiros JSON e scripts
```bash
mkdir -p data scripts
cp data/roteiros.json /path/to/n8n/data/
cp scripts/merge_video.js /path/to/n8n/scripts/
```

### 5. Ativar workflow
No canvas n8n: toggle **Active** no canto superior direito. Rode manualmente via **Execute Workflow** pra testar.

---

## 🔧 Script auxiliar: merge_video.js

Salve em `scripts/merge_video.js`:

```javascript
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');

const [shotsDir, audioPath, outputPath] = process.argv.slice(2);

const shots = fs.readdirSync(shotsDir)
  .filter(f => f.endsWith('.mp4'))
  .sort()
  .map(f => path.join(shotsDir, f));

const command = ffmpeg();
shots.forEach(s => command.input(s));
command.input(audioPath);

command
  .complexFilter([
    shots.map((_, i) => `[${i}:v]scale=1080:1920,setsar=1[v${i}]`).join(';'),
    `${shots.map((_, i) => `[v${i}]`).join('')}concat=n=${shots.length}:v=1:a=0[vout]`,
    `[${shots.length}:a]volume=0.9[aout]`
  ])
  .outputOptions([
    '-map', '[vout]',
    '-map', '[aout]',
    '-c:v', 'libx264',
    '-preset', 'medium',
    '-crf', '20',
    '-c:a', 'aac',
    '-b:a', '320k',
    '-pix_fmt', 'yuv420p',
    '-r', '30'
  ])
  .save(outputPath)
  .on('end', () => {
    console.log(JSON.stringify({ success: true, output: outputPath }));
  })
  .on('error', (err) => {
    console.error(JSON.stringify({ success: false, error: err.message }));
    process.exit(1);
  });
```

---

## 📡 Integração com projeto existente (fetok-autoposter)

O projeto já tem `src/videoGenerator.js`, `src/batchGenerate.js` e `src/index.js`. Pra plugar o n8n sem quebrar nada:

### Opção A — n8n chama scripts Node via ExecuteCommand
```javascript
// node src/index.js --roteiro=pescador
```

### Opção B — Expor endpoints Express no index.js
Adicione em `src/index.js`:

```javascript
app.post('/api/generate/higgsfield', async (req, res) => {
  const { roteiro_id } = req.body;
  const result = await runHiggsfieldPipeline(roteiro_id);
  res.json(result);
});

app.post('/api/generate/elevenlabs', async (req, res) => {
  const { text, voice_id } = req.body;
  const audio = await generateNarration(text, voice_id);
  res.json({ audio_url: audio });
});
```

Aí o n8n só dispara webhooks pros endpoints. Controle 100% no código.

---

## 💸 Custos estimados por execução completa (1 vídeo)

| API | Chamadas | Custo |
|-----|----------|-------|
| Midjourney | 12 prompts (imagens) | ~$0.30 |
| Higgsfield Standard | 9 shots × $0.25 | $2.25 |
| ElevenLabs | ~80 tokens | $0.08 |
| TikTok API | upload | $0 |
| **Total** | | **~$2.65** |

**Custo mensal (60 vídeos, 2/dia):** ~$159/mês rodando 100% automatizado.

---

## ⚠️ Rate limits & retries

Adicione em cada node HTTP do n8n:
- **Retry on Fail:** 3 tentativas
- **Wait between retries:** 30s exponencial
- **Timeout:** 120s (Midjourney/Higgsfield podem demorar)

Pra Higgsfield, use polling (não webhook direto) — mais estável.

---

## 📊 Monitoramento

Adicione node **Error Trigger** que dispara pro Slack em caso de falha:

```json
{
  "parameters": {
    "webhookUrl": "={{$env.SLACK_WEBHOOK_URL}}",
    "text": "=❌ FéTok falhou no node {{$json.error.node.name}}: {{$json.error.message}}"
  },
  "name": "Error Notify",
  "type": "n8n-nodes-base.slack"
}
```

---

## 🧪 Teste incremental (não rode tudo de uma vez)

1. **Teste 1:** Trigger → Read JSON → Midjourney (1 prompt)
2. **Teste 2:** + Higgsfield (1 shot)
3. **Teste 3:** + ElevenLabs (1 narração)
4. **Teste 4:** + FFmpeg merge (1 vídeo completo)
5. **Teste 5:** + Upload TikTok (post de teste privado)
6. **Produção:** ativa cron + público

---

> Fim do pipeline. Para produção, adicione **Redis** pra cache de prompts Midjourney (economiza 30% dos custos em reruns).
