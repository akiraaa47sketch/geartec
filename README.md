# Arena X1 · Multiplayer

Um único serviço Node serve o jogo (pasta `public/`) e os lobbies via WebSocket (`/ws`).

## Estrutura
```
server.js              servidor: arquivos de public/ + lobbies WebSocket
public/index.html      telas e HUD (só marcação)
public/css/style.css   estilos
public/js/             código do jogo, carregado nesta ordem:
  core.js          THREE, configurações salvas, cena, câmera, renderer, utilitários
  textures.js      texturas procedurais e materiais
  map.js           mapa, props de cobertura, lista de coberturas
  character.js     armas, skins, modelo do personagem
  combat.js        som, dano/derrubado/execução, tiro, pose, física comum
  player.js        movimento, cobertura, corner rush, ações do jogador
  bot.js           IA do bot
  render.js        FSR, HUD e loop principal
  menu.js          menus, teclado/mouse, personalização
  multiplayer.js   cliente WebSocket
  gamepad.js       controle
  main.js          inicialização
```
Os arquivos são scripts comuns (não módulos) e compartilham variáveis globais, então a ordem dos `<script>` no `index.html` importa.

## Testar local
```
npm install
npm start
```
Abra `http://localhost:3000` em duas abas → MULTIPLAYER → CRIAR SALA numa e ENTRAR na outra.

## Deploy no Render
1. Suba esta pasta para um repositório no GitHub.
2. Render → **New + → Blueprint** (usa o `render.yaml`) ou **Web Service** com Build `npm install` e Start `npm start`.
3. Abra a URL `https://SEU-APP.onrender.com`. O cliente conecta sozinho em `wss://SEU-APP.onrender.com/ws`.

> Plano free: o serviço dorme após ~15 min sem uso e a primeira conexão pode levar ~1 min.
> Para abrir o HTML de outro lugar: `index.html?server=wss://SEU-APP.onrender.com/ws`.

## Como funciona
- **Sala:** quem cria é o host e configura na própria sala: kills para vencer (5–50), máximo de jogadores (2–8), times (todos contra todos / 2 / 3 / 4) e mapa (hoje só "Torre do Relógio"; o campo `map` já existe no servidor e na UI).
- **Times:** cada jogador escolhe o time na sala, sem fogo amigo e com placar por time.
- **Autoridade:** o servidor controla salas, times, placar, limite de kills e fim de partida. Movimento e acertos são calculados no cliente de quem atira e o servidor repassa o dano (ver limitações).

## Mecânicas
- **Cobertura:** qualquer parede, pilar, árvore, caixote ou bloco é cobertura. Baixa (sacos de areia / barreiras, 1,32 m): agachado fica 100% escondido, botão direito levanta pra mirar, atirar sem mirar = tiro cego. Alta (paredes, pilares): só atira pela ponta (segurar mira ou atirar perto da ponta sai do canto sozinho).
- **Contornar quina:** na ponta de pilares/caixotes/blocos, A/D + Espaço passa pra face lateral da mesma cobertura (se tiver outra cobertura perto, troca pra ela).
- **Derrubado + execução:** vida zerada sem gib = cai e rasteja (sangra em 12 s). Perto do inimigo derrubado: **E** (ou **X** no controle) executa; tiros também terminam. Dá pra desligar no treino e na sala ("Vida zerada").
- **Escopeta:** gib só colado (até ~3,5 m com 6+ pellets); fora disso dano por pellet com queda por distância.
- **Poder de parada:** tomar tiro deixa você mais lento por ~0,3 s.
- **Câmera:** V troca o ombro; na cobertura ela vai pro lado que você anda.
- **Bot:** procura cobertura do lado oposto ao seu com visão pra você, levanta pra atirar e abaixa, recarrega escondido, troca de posição se for flanqueado, avança com a escopeta, rola pra desviar e executa você se te derrubar.

## Limitações atuais
- Sem anti-cheat: acertos são confiados ao atirador.
- Não dá para entrar numa partida já iniciada.
- Voadora (cover slip) e o mira-vermelha do crosshair ainda só funcionam contra o bot do treino.
- Todos precisam estar com a mesma versão do `index.html` (o índice de cobertura enviado na rede depende da lista de coberturas).
- Mapas: para adicionar, crie a geometria por índice de `cfg.map` (hoje o mapa é construído direto no script).
