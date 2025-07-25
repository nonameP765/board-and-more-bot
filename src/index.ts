import {
  Client,
  GatewayIntentBits,
  SlashCommandBuilder,
  REST,
  Routes,
  ActivityType
} from 'discord.js';
import * as dotenv from 'dotenv';

// 환경변수 로드
dotenv.config();

// 슬래시 명령어 정의
const commands = [
  new SlashCommandBuilder().setName('ping').setDescription('봇의 응답 시간을 확인합니다'),

  new SlashCommandBuilder().setName('안녕').setDescription('봇과 인사를 나눕니다'),

  new SlashCommandBuilder()
    .setName('주사위')
    .setDescription('주사위를 굴립니다')
    .addIntegerOption((option) =>
      option
        .setName('면수')
        .setDescription('주사위 면의 수 (기본값: 6)')
        .setMinValue(2)
        .setMaxValue(100)
        .setRequired(false)
    ),

  new SlashCommandBuilder().setName('동전').setDescription('동전을 던집니다'),

  new SlashCommandBuilder().setName('서버정보').setDescription('현재 서버의 정보를 보여줍니다'),

  new SlashCommandBuilder().setName('게임추천').setDescription('랜덤 보드게임을 추천합니다'),

  new SlashCommandBuilder()
    .setName('인원게임')
    .setDescription('지정된 인원수에 맞는 게임을 추천합니다')
    .addIntegerOption((option) =>
      option
        .setName('인원수')
        .setDescription('플레이어 수')
        .setMinValue(1)
        .setMaxValue(20)
        .setRequired(true)
    ),

  new SlashCommandBuilder().setName('도움말').setDescription('사용 가능한 명령어를 보여줍니다')
].map((command) => command.toJSON());

// 봇 클라이언트 생성
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

// 명령어 등록 함수
async function deployCommands() {
  const token = process.env.DISCORD_TOKEN;
  const guildId = process.env.GUILD_ID;

  if (!token) {
    console.error('❌ DISCORD_TOKEN이 설정되지 않았습니다!');
    return;
  }

  try {
    const rest = new REST({ version: '10' }).setToken(token);

    console.log('🔄 슬래시 명령어를 등록하는 중...');

    if (guildId) {
      // 특정 길드에만 등록 (테스트용, 즉시 반영)
      await rest.put(Routes.applicationGuildCommands(client.user!.id, guildId), { body: commands });
      console.log('✅ 길드 슬래시 명령어가 등록되었습니다!');
    } else {
      // 글로벌 명령어 등록 (1시간 정도 소요)
      await rest.put(Routes.applicationCommands(client.user!.id), { body: commands });
      console.log('✅ 글로벌 슬래시 명령어가 등록되었습니다!');
    }
  } catch (error) {
    console.error('❌ 명령어 등록 실패:', error);
  }
}

// 봇이 준비되었을 때 실행
client.once('ready', async (readyClient) => {
  console.log(`✅ ${readyClient.user.tag}로 로그인했습니다!`);

  // 봇 상태 설정
  client.user?.setActivity('스위트랜드', { type: ActivityType.Playing });

  // 슬래시 명령어 등록
  await deployCommands();
});

// 슬래시 명령어 처리
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName, options } = interaction;

  try {
    switch (commandName) {
      case 'ping':
        const ping = Date.now() - interaction.createdTimestamp;
        await interaction.reply(`🏓 퐁! 지연시간: ${ping}ms`);
        break;

      case '안녕':
        await interaction.reply(`안녕하세요, ${interaction.user.username}님! 👋`);
        break;

      case '주사위':
        const sides = options.getInteger('면수') || 6;
        const result = Math.floor(Math.random() * sides) + 1;
        await interaction.reply(`🎲 ${sides}면 주사위 결과: **${result}**`);
        break;

      case '동전':
        const coinResult = Math.random() < 0.5 ? '앞면' : '뒷면';
        await interaction.reply(`🪙 동전 던지기 결과: **${coinResult}**`);
        break;

      case '서버정보':
        if (interaction.guild) {
          const guild = interaction.guild;
          const infoEmbed = {
            color: 0x0099ff,
            title: `📊 ${guild.name} 서버 정보`,
            fields: [
              { name: '👥 멤버 수', value: guild.memberCount.toString(), inline: true },
              {
                name: '📅 생성일',
                value: guild.createdAt.toLocaleDateString('ko-KR'),
                inline: true
              },
              { name: '👑 소유자', value: `<@${guild.ownerId}>`, inline: true }
            ],
            timestamp: new Date().toISOString()
          };
          await interaction.reply({ embeds: [infoEmbed] });
        } else {
          await interaction.reply('❌ 서버 정보를 가져올 수 없습니다.');
        }
        break;

      case '게임추천':
        const boardGames = [
          '스플렌더',
          '킹 오브 토쿄',
          '사이드 리얼',
          '아줄',
          '카탄',
          '도미니온',
          '윙스팬',
          '티켓 투 라이드',
          '판데믹',
          '코드네임',
          '루트',
          '테라포밍 마스',
          '글룸헤이븐',
          '스카이테일즈',
          '7 원더스'
        ];
        const randomGame = boardGames[Math.floor(Math.random() * boardGames.length)];
        await interaction.reply(`🎲 추천 보드게임: **${randomGame}**`);
        break;

      case '인원게임':
        const playerCount = options.getInteger('인원수')!;
        let gamesByPlayers: string[] = [];

        if (playerCount <= 2) {
          gamesByPlayers = ['패치워크', '하이브', '7 원더스 듀얼', '제니티아', '로스트 시티'];
        } else if (playerCount <= 4) {
          gamesByPlayers = ['스플렌더', '킹 오브 토쿄', '사이드 리얼', '아줄', '카탄'];
        } else if (playerCount <= 6) {
          gamesByPlayers = ['시타델', '카르카손', '킹 오브 뉴욕', '스몰 월드', '뱅!'];
        } else {
          gamesByPlayers = [
            '코드네임',
            '원 나이트 웨어울프',
            '레지스탕스 아발론',
            '카멜롯을 향하여'
          ];
        }

        const recommendedGame = gamesByPlayers[Math.floor(Math.random() * gamesByPlayers.length)];
        await interaction.reply(`👥 ${playerCount}명을 위한 추천 게임: **${recommendedGame}**`);
        break;

      case '도움말':
        const helpMessage = `
📋 **사용 가능한 슬래시 명령어**

\`/ping\` - 봇의 응답 시간 확인
\`/안녕\` - 인사하기
\`/주사위 [면수]\` - 주사위 굴리기 (기본값: 6)
\`/동전\` - 동전 던지기
\`/서버정보\` - 서버 정보 보기
\`/도움말\` - 이 도움말 보기

🎲 **보드게임 명령어**
\`/게임추천\` - 랜덤 보드게임 추천
\`/인원게임 <인원수>\` - 해당 인원수에 맞는 게임 추천

💡 **팁**: 명령어를 입력할 때 자동완성과 설명을 확인하세요!
        `;
        await interaction.reply(helpMessage);
        break;

      default:
        await interaction.reply('❓ 알 수 없는 명령어입니다.');
    }
  } catch (error) {
    console.error('명령어 처리 중 오류:', error);
    if (interaction.deferred || interaction.replied) {
      await interaction.followUp('❌ 명령어 처리 중 오류가 발생했습니다.');
    } else {
      await interaction.reply('❌ 명령어 처리 중 오류가 발생했습니다.');
    }
  }
});

// 에러 처리
client.on('error', (error) => {
  console.error('Discord 클라이언트 에러:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('처리되지 않은 Promise 거부:', error);
});

// 봇 로그인
const token = process.env.DISCORD_TOKEN;
if (!token) {
  console.error('❌ DISCORD_TOKEN이 환경변수에 설정되지 않았습니다!');
  console.log('env.example 파일을 .env로 복사하고 토큰을 설정하세요.');
  process.exit(1);
}

client.login(token).catch((error) => {
  console.error('❌ 봇 로그인 실패:', error);
  process.exit(1);
});
